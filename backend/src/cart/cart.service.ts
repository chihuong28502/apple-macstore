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

  async addItem(userId: string, item: { id: string; quantity: number; stockId: string }): Promise<ResponseDto<Cart>> {
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
      this.cartsGateway.sendEventAddCart(updatedCart)
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
      const cart: any = await this.cartModel.findOne({ userId })
        .populate('items.productId', '-createdAt -updatedAt -__v -specifications -tags -price')
        .select('-createdAt -updatedAt -__v')
        .exec();

      if (!cart) {
        return {
          success: false,
          message: 'Cart not found',
          data: null,
        };
      }

      // Lọc stock dựa trên stockId
      cart.items = cart.items.map(item => {
        const productId = item.productId;
        const stockId = item.stockId;
        const stock = this.getStockById(productId.stock, stockId); // Gọi hàm để lấy stock

        return {
          ...item,
          productId: {
            ...productId,
            stock: stock
          }
        };
      });

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

  private getStockById(stock: any, stockId: string): any {
    if (!stock || (typeof stock === 'object' && Object.keys(stock).length === 0)) {
      return null;
    }
    const isMap = stock instanceof Map;
    for (const colorKey of (isMap ? stock.keys() : Object.keys(stock))) {
      const color = isMap ? colorKey : stock[colorKey];
      const ramData = isMap ? stock.get(colorKey) : stock[colorKey];
      if (!ramData || typeof ramData !== "object") {
        continue;
      }
      for (const ramKey of (isMap ? ramData.keys() : Object.keys(ramData))) {
        const ram = isMap ? ramKey : ramData[ramKey];

        const storageData = isMap ? ramData.get(ramKey) : ramData[ramKey];

        if (!storageData || typeof storageData !== "object") {
          continue;
        }

        for (const storageKey of (isMap ? storageData.keys() : Object.keys(storageData))) {
          const storage = isMap ? storageKey : storageData[storageKey];
          const storageItem = isMap ? storageData.get(storageKey) : storageData[storageKey];
          // Kiểm tra sự tồn tại của storageItem
          if (storageItem && storageItem._id) {
            // So sánh ID sau khi chuyển sang string
            if (storageItem._id.toString() === stockId.toString()) {
              return { [color]: { [ram]: { [storage]: storageItem } } };
            } else {
            }
          } else {
          }
        }
      }
    }

    return null;
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
