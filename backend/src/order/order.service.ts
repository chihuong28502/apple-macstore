import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import * as crypto from 'node:crypto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private configService: ConfigService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<ResponseDto<Order>> {
    try {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      const qr = `https://qr.sepay.vn/img?acc=${this.configService.getOrThrow('BANK_ACCOUNT_NUMBER')}&bank=${this.configService.getOrThrow('BANK_ACCOUNT_BANK')}&amount=${createOrderDto.totalPrice}&des=HD%20${code}`
      const createdOrder = new this.orderModel({
        ...createOrderDto,
        code, qr
      });
      await createdOrder.save();
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
      const order = await this.orderModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) }  // Tìm order theo ID
        }
      ]);

      if (order.length === 0) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      return {
        success: true,
        message: 'Order retrieved successfully',
        data: order[0],
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
}
