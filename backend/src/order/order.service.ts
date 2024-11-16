import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';
import { ObjectId } from 'mongodb';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Variant, VariantDocument } from 'src/product/schema/variants.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { SepayDto } from './dto/sepay.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersGateway } from './order.gateway';
import { Order, OrderDocument } from './schema/order.schema';
import { Cart, CartDocument } from 'src/cart/schema/cart.schema';
import { CartsGateway } from 'src/cart/cart.gateway';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    private configService: ConfigService,
    private readonly ordersGateway: OrdersGateway,
    private readonly cartsGateway: CartsGateway
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<ResponseDto<Order>> {
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
      return {
        success: true,
        message: 'Order created successfully',
        data: createdOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create order: ' + error.message,
        data: null,
      };
    }
  }

  async findAll(): Promise<ResponseDto<Order[]>> {
    try {
      const orders = await this.orderModel.find().exec();
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

  async findOne(id: string): Promise<ResponseDto<Order>> {
    try {
      const order = await this.orderModel.findById(id);

      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
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

  async findAllOrderByCustomer(id: string): Promise<ResponseDto<Order>> {
    try {
      const order = await this.orderModel.find({ userId: id }).sort({ createdAt: -1 }).limit(10);

      if (order.length === 0) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
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
    try {
      const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

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
    try {
      const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
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
      const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
      if (!deletedOrder) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

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

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng với mã code trùng khớp");
      }

      order.status = "shipping";
      const variantIds = order.items.map(item => item.variantId);

      for (const item of order.items) {
        await this.variantModel.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock: -parseInt(item.quantity as any, 10) } },
          { new: true }

        );
      }

      await order.save();
      await this.ordersGateway.sendOrder(order);

      return {
        success: true,
        message: 'Order thanh toán thành công',
        data: order,
      };
    } catch (error) {
      console.error("🚀 ~ Error:", error.message);
      return {
        success: false,
        message: `Failed to process thanh toán: ${error.message}`,
        data: null,
      };
    }
  }
}
