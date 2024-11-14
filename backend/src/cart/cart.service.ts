// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CartsGateway } from './cart.gateway';
import { Cart, CartDocument } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
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
        message: 'Cart created successfully',
        data: savedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create cart: ' + error.message,
        data: null,
      };
    }
  }

  async addItem(userId: string, item: any): Promise<ResponseDto<Cart>> {
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

      return {
        success: true,
        message: 'Item added to cart successfully',
        data: updatedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add item to cart: ' + error.message,
        data: null,
      };
    }
  }


  async findByUserId(userId: string): Promise<ResponseDto<Cart>> {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId', 'name description images')  // Lấy thông tin sản phẩm
        .populate('items.variantId', 'color colorCode ram ssd price stock status productId availableStock reservedStock lockUntil'); // Lấy thông tin biến thể

      if (!cart) {
        return {
          success: false,
          message: 'Cart not found for user',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve cart: ' + error.message,
        data: null,
      };
    }
  }

  async update(userId: string, items: Array<{ productId: string; variantId: string; quantity: number }>): Promise<ResponseDto<Cart>> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      const { productId, variantId, quantity } = items as any
      if (!cart) {
        return {
          success: false,
          message: 'Cart not found',
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
          message: 'Item not found in cart',
          data: null,
        };
      }

      // Update the quantity
      item.quantity = quantity;

      // Save the cart with updated quantity
      await cart.save();

      return {
        success: true,
        message: 'Quantity updated successfully',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update cart: ' + error.message,
        data: null,
      };
    }
  }

  async delete(userId: string, items: Array<{ productId: string; variantId: string }>): Promise<ResponseDto<Cart>> {
    try {
      // Kiểm tra nếu items là mảng
      if (!Array.isArray(items)) {
        return {
          success: false,
          message: 'Invalid items format. Expected an array.',
          data: null,
        };
      }

      // Tìm giỏ hàng của user
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        return {
          success: false,
          message: 'Cart not found',
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
