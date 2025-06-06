// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CartsGateway } from './cart.gateway';
import { Cart, CartDocument } from './schema/cart.schema';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CartService {
  private readonly CACHE_TTL = 3600;
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly redisService: RedisService,
    private readonly cartsGateway: CartsGateway) { }

  async createCartForUser(userId: string): Promise<Cart> {
    const newCart = new this.cartModel({
      userId: userId,
      items: [],
    });
    return await newCart.save();
  }

  async create(userId: string, items: Array<{ productId: string; quantity: number }>): Promise<ResponseDto<Cart>> {
    try {
      const newCart = new this.cartModel({ userId, items });
      const savedCart = await newCart.save();
      return {
        success: true,
        message: 'Tạo giỏ hàng thành công',
        data: savedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Tạo giỏ hàng thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async addItem(userId: string, item: any): Promise<ResponseDto<Cart>> {
    const cacheKeyById = `cart_by_${userId}`;
    try {
      let cart = await this.cartModel.findOne({ userId });

      // Nếu không tìm thấy giỏ hàng, tạo giỏ hàng mới
      if (!cart) {
        cart = new this.cartModel({ userId, items: [] });
      }

      const productId = new Types.ObjectId(item.productId);
      const variantId = new Types.ObjectId(item.variantId);

      const existingItemIndex = cart.items.findIndex((i: any) =>
        i.productId.equals(productId) && i.variantId.equals(variantId)
      );

      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.items.push({
          productId,
          variantId,
          quantity: item.quantity
        });
      }

      // Lưu giỏ hàng đã cập nhật
      const updatedCart = await cart.save();

      // Gửi sự kiện giỏ hàng đã được cập nhật
      this.cartsGateway.sendEventAddCart(updatedCart);
      await this.redisService.clearCache(cacheKeyById);

      return {
        success: true,
        message: 'Thêm sản phẩm vào giỏ hàng thành công',
        data: updatedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Thêm sản phẩm vào giỏ hàng thất bại: ' + error.message,
        data: null,
      };
    }
  }


  async findByUserId(userId: string): Promise<ResponseDto<Cart>> {
    const cacheKey = `cart_by_${userId}`;

    // Check cache first
    const cachedCart = await this.redisService.getCache<Cart>(cacheKey);
    if (cachedCart) {
      return {
        success: true,
        message: 'Lấy thông tin giỏ hàng từ cache thành công',
        data: cachedCart,
      };
    }
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId', 'name description images')  // Lấy thông tin sản phẩm
        .populate('items.variantId', 'color colorCode ram ssd price stock status productId availableStock reservedStock lockUntil'); // Lấy thông tin biến thể

      if (!cart) {
        return {
          success: false,
          message: 'Không tìm thấy giỏ hàng',
          data: null,
        };
      }

      await this.redisService.setCache(cacheKey, cart, this.CACHE_TTL);
      return {
        success: true,
        message: 'Lấy thông tin giỏ hàng thành công',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy thông tin giỏ hàng thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async update(userId: string, items: Array<{ productId: string; variantId: string; quantity: number }>): Promise<ResponseDto<Cart>> {
    const cacheKey = `cart_by_${userId}`;
    try {
      const cart = await this.cartModel.findOne({ userId });
      const { productId, variantId, quantity } = items as any
      if (!cart) {
        return {
          success: false,
          message: 'Không tìm thấy giỏ hàng',
          data: null,
        };
      }

      // Find the item to update
      const item = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (!item) {
        return {
          success: false,
          message: 'Không tìm thấy sản phẩm trong giỏ hàng',
          data: null,
        };
      }

      // Update the quantity
      item.quantity = quantity;
      await cart.save();
      this.redisService.clearCache(cacheKey)
      return {
        success: true,
        message: 'Cập nhật số lượng thành công',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cập nhật giỏ hàng thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async delete(userId: string, items: Array<{ productId: string; variantId: string }>): Promise<ResponseDto<Cart>> {
    const cacheKey = `cart_by_${userId}`;
    try {
      // Kiểm tra nếu items là mảng
      if (!Array.isArray(items)) {
        return {
          success: false,
          message: 'Định dạng sản phẩm không hợp lệ. Yêu cầu một mảng.',
          data: null,
        };
      }

      // Tìm giỏ hàng của user
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        return {
          success: false,
          message: 'Không tìm thấy giỏ hàng',
          data: null,
        };
      }

      // Lọc ra các item trong cart có productId và variantId khớp với items cần xóa
      cart.items = cart.items.filter(
        (cartItem) =>
          !items.some(
            (item) =>
              cartItem.productId.toString() === item.productId &&
              cartItem.variantId.toString() === item.variantId
          )
      );

      // Cập nhật giỏ hàng sau khi xóa
      await cart.save();
      this.redisService.clearCache(cacheKey)

      return {
        success: true,
        message: 'Items deleted successfully from cart',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete items from cart: ' + error.message,
        data: null,
      };
    }
  }
}
