import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';
import { CartsGateway } from 'src/cart/cart.gateway';
import { Cart, CartDocument } from 'src/cart/schema/cart.schema';
import { CreateNotifyDto } from 'src/notify/dto/create-notify.dto';
import { NotifyService } from 'src/notify/notify.service';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Variant, VariantDocument } from 'src/product/schema/variants.schema';
import { RedisService } from 'src/redis/redis.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';
import Stripe from 'stripe';
import { CreateOrderDto } from './dto/create-order.dto';
import { SepayDto } from './dto/sepay.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersGateway } from './order.gateway';
import { Order, OrderDocument } from './schema/order.schema';


@Injectable()
export class OrderService {
  private readonly CACHE_TTL = 3600;
  private stripe: Stripe;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    private readonly redisService: RedisService,
    private configService: ConfigService,
    private notifyService: NotifyService,
    private readonly ordersGateway: OrdersGateway,
    private readonly cartsGateway: CartsGateway
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  async create(createOrderDto: CreateOrderDto): Promise<ResponseDto<Order>> {
    const cacheKeyById = `cart_by_${createOrderDto.userId}`;
    const cacheKeyByOrder = `order_by_user_${createOrderDto.userId}`;
    createOrderDto.items.map(item =>
      this.redisService.clearCache(item.productId))
    try {
      const user = await this.userModel.findById(createOrderDto.userId);
      const cart = await this.cartModel.findOne({ userId: createOrderDto.userId });
      const code = `${crypto.randomBytes(4).toString('hex').toUpperCase()}${user.code}`;
      const qr = `https://qr.sepay.vn/img?acc=${this.configService.getOrThrow('BANK_ACCOUNT_NUMBER')}&bank=${this.configService.getOrThrow('BANK_ACCOUNT_BANK')}&amount=${createOrderDto.totalPrice}&des=HD%20${code}`;
      const variantUpdates = createOrderDto.items.map(async (item) => {
        const variant = await this.variantModel.findById(item.variantId);
        if (variant.availableStock >= item.quantity) {
          // Giảm availableStock và tăng reservedStock
          variant.availableStock -= item.quantity;
          variant.reservedStock += item.quantity;

          await variant.save();
        } else {
          throw new Error(`Kho không còn đủ ${item.variantId}`);
        }
      });
      // Tạo đơn hàng
      await Promise.all(variantUpdates);
      const createdOrder = new this.orderModel({
        ...createOrderDto,
        totalPrice: parseFloat(createOrderDto.totalPrice.toFixed(1)),
        taxAmount: parseFloat(createOrderDto.taxAmount.toFixed(1)),
        code,
        qr,
        lockUntil: new Date(Date.now() + 3 * 60 * 60 * 1000),
      });

      cart.items = cart.items.filter(cartItem => {
        return !createOrderDto.items.some(orderItem => {
          return cartItem.variantId.toString() === new Types.ObjectId(orderItem.variantId).toString();
        });
      });

      await createdOrder.save();
      await this.ordersGateway.addOrder(createdOrder);
      const updateCart = await cart.save();
      this.cartsGateway.sendEventAddCart(updateCart);
      this.redisService.clearCache(cacheKeyById);
      this.redisService.clearCache(cacheKeyByOrder);
      return {
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: createdOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Tạo đơn hàng thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async findAll(): Promise<ResponseDto<Order[]>> {
    const keyCache = `order_all`;
    try {
      const orderCache = await this.redisService.getCache(keyCache);
      if (orderCache) {
        return {
          success: true,
          message: 'Orders retrieved successfully',
          data: orderCache
        };
      }
      const orders = await this.orderModel.find().exec();
      this.redisService.setCache(keyCache, orders, this.CACHE_TTL)
      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve orders: ' + error.message,
        data: [],
      };
    }
  }
  async findOrderById(orderId: string): Promise<ResponseDto<Order[]>> {
    try {
      const order = await this.orderModel.findById(orderId).exec();
      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve orders: ' + error.message,
        data: [],
      };
    }
  }

  async findAllOrderByCustomer(id: string): Promise<ResponseDto<Order>> {
    const keyCache = `order_by_user_${id}`;
    try {
      const orderCache = await this.redisService.getCache(keyCache);
      if (orderCache) {
        return {
          success: true,
          message: 'Orders retrieved successfully',
          data: orderCache
        };
      }
      const order = await this.orderModel.find({ userId: id }).sort({ createdAt: -1 })

      this.redisService.setCache(keyCache, order, this.CACHE_TTL)
      if (order.length === 0) {
        return {
          success: true,
          message: 'Order retrieved successfully',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve order: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<ResponseDto<Order>> {
    const keyCache = `order_by_user_${updateOrderDto.userId}`;
    const keyCacheAllOrder = `order_all`;

    try {
      const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      this.redisService.clearCache(keyCache)
      this.redisService.clearCache(keyCacheAllOrder)
      return {
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update order: ${error.message}`,
        data: null,
      };
    }
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto): Promise<ResponseDto<Order>> {
    // const cacheKeyUpdate = `variants_${updatedVariant.productId || 'all'}`;
    const keyCache = `order_by_user_${updateOrderDto.userId}`;
    const keyCacheAllOrder = `order_all`;

    try {
      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(id, { status: updateOrderDto.status }, { new: true }).exec();

      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      const productIds = updatedOrder.items.map(item => item.productId);
      if (updateOrderDto.status === 'cancelled') {
        // Hoàn lại stock khi hủy đơn hàng
        const updateStockTasks = updatedOrder.items.map(async (item) => {
          const variant = await this.variantModel.findById(item.variantId);
          if (variant) {
            variant.availableStock += item.quantity;
            variant.reservedStock -= item.quantity;

            // Đảm bảo không âm giá trị reservedStock
            if (variant.reservedStock < 0) {
              variant.reservedStock = 0;
            }

            await variant.save();
          }
        });
        await Promise.all(updateStockTasks);
      } else if (updateOrderDto.status === 'success') {
        // Trừ stock khi đơn hàng thành công
        const updateStockTasks = updatedOrder.items.map(async (item) => {
          const variant = await this.variantModel.findById(item.variantId);
          if (variant) {
            // Trừ số lượng từ reservedStock
            variant.reservedStock -= item.quantity;

            // Đảm bảo không âm giá trị reservedStock
            if (variant.reservedStock < 0) {
              variant.reservedStock = 0;
            }

            // Cập nhật stock
            variant.stock -= item.quantity;
            // Đảm bảo không âm giá trị stock
            if (variant.stock < 0) {
              variant.stock = 0;
            }

            await variant.save();
          }
        });
        await Promise.all(updateStockTasks);
      }

      // Xóa cache
      productIds.forEach(productId => {
        const productCacheKey = `${productId}`;
        this.redisService.clearCache(productCacheKey);
      });
      this.redisService.clearCache(keyCache);
      this.redisService.clearCache(keyCacheAllOrder);

      return {
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update order: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<ResponseDto<Order>> {
    try {
      const keyCacheAllOrder = `order_all`;

      const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
      if (!deletedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      this.redisService.clearCache(keyCacheAllOrder)
      return {
        success: true,
        message: 'Order deleted successfully',
        data: deletedOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete order: ${error.message}`,
        data: null,
      };
    }
  }

  async checkPayment(@Body() sepayDto: SepayDto): Promise<ResponseDto<Order>> {
    try {
      const match = sepayDto.content.match(/HD (\w+)/);
      const matchedCode = match ? match[1] : null;

      if (!matchedCode) {
        throw new Error("Không tìm thấy mã trong nội dung sepayDto");
      }

      const order = await this.orderModel.findOne({ code: matchedCode });
      const keyCache = `order_by_user_${order.userId}`;

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng với mã code trùng khớp");
      }

      order.status = "shipping";

      await order.save();
      await this.ordersGateway.sendOrder(order);
      this.redisService.clearCache(keyCache)
      const notifyDto: CreateNotifyDto = {
        title: `Thanh toán: ${sepayDto.content}`,
        content: `Thanh toán thành công`,
        isRead: false,
        customer: order.userId,
      };
      await this.notifyService.createNotify(notifyDto)
      return {
        success: true,
        message: 'Thanh toán đơn hàng thành công',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Xử lý thanh toán thất bại: ' + error.message,
        data: null,
      };
    }
  }

  // 
  async createStripePayment(orderId: string): Promise<ResponseDto<any>> {
    try {
      const order = await this.orderModel.findById(orderId);
      console.log("🚀 ~ OrderService ~ order:", order)
      if (!order) {
        throw new Error('Order not found');
      }

      // Create line items for Stripe
      const lineItems = order.items.map(item => ({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.productName,
            description: `Variant: 
            - COLOR: ${item.color} 
            - RAM:${item.ram}GB 
            - SSD: ${item.ssd}GB 
            - PRICE:${item.price} 
            - QUANTITY:${item.quantity}`,
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        client_reference_id: order._id.toString(),
        ui_mode: 'embedded',
        metadata: {
          orderId: order._id.toString(),
        },
        return_url: `${this.configService.get('FRONTEND_URL')}/checkout-stripe?sessionId={CHECKOUT_SESSION_ID}`
      });
      return {
        success: true,
        message: 'Stripe payment session created successfully',
        data: session.client_secret
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create Stripe payment: ' + error.message,
        data: null
      };
    }
  }

  async checkPaymentStatusStriper(sessionId: string): Promise<ResponseDto<any>> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
        // Cập nhật trạng thái đơn hàng
        const orderId = session.metadata.orderId;
        const order = await this.orderModel.findById(orderId);
        const keyCache = `order_by_user_${order.userId}`;

        if (order) {
          order.status = 'shipping';
          await order.save();

          // Tạo thông báo
          const notifyDto: CreateNotifyDto = {
            title: `Thanh toán đơn hàng #${order.code}`,
            content: `Thanh toán thành công`,
            isRead: false,
            customer: order.userId,
          };
          await this.notifyService.createNotify(notifyDto);
          this.redisService.clearCache(keyCache)
          return {
            success: true,
            message: 'Payment completed successfully',
            data: {
              status: session.status,
              orderId: order._id
            }
          };
        }
      }

      return {
        success: false,
        message: 'Payment not completed',
        data: null
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to check payment status: ' + error.message,
        data: null
      };
    }
  }

}
