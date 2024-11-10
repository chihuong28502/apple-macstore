// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CartsGateway } from './cart.gateway';

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
        .populate('items.variantId', 'color colorCode ram ssd price stock status'); // Lấy thông tin biến thể
  
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
