// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) { }

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

  async addItem(userId: string, item: { id: string; quantity: number; stockId: string }): Promise<ResponseDto<Cart>> {
    console.log("🚀 ~ CartService ~ item:", item);
    console.log("🚀 ~ CartService ~ userId:", userId);

    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        return {
          success: false,
          message: 'Cart not found for user',
          data: null,
        };
      }

      const productId = new Types.ObjectId(item.id);
      const stockId = new Types.ObjectId(item.stockId);

      const existingItemIndex = cart.items.findIndex((i: any) => {
        if (i.productId && i.stockId) {
          return i.productId.equals(productId) && i.stockId.equals(stockId);
        }
        return false;
      });

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        cart.items.push({ productId, quantity: item.quantity, stockId }); // Đảm bảo stockId có mặt khi thêm mục mới
      }

      const updatedCart = await cart.save();
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
      const cart = await this.cartModel.findOne({ userId })
        .populate('items.productId')
        .exec();

      if (!cart) {
        return {
          success: false,
          message: 'Cart not found',
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


  async update(userId: string, items: Array<{ productId: string; quantity: number }>): Promise<ResponseDto<Cart>> {
    try {
      const updatedCart = await this.cartModel.findOneAndUpdate({ userId }, { items }, { new: true });
      if (!updatedCart) {
        return {
          success: false,
          message: 'Cart not found for update',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Cart updated successfully',
        data: updatedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update cart: ' + error.message,
        data: null,
      };
    }
  }
}
