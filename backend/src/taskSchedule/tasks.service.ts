import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Order, OrderDocument } from 'src/order/schema/order.schema';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Variant, VariantDocument } from 'src/product/schema/variants.schema';

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) { }

  @Cron(CronExpression.EVERY_30_MINUTES) // Mỗi 30 phút chạy
  async releaseLockedStocks() {
    const now = new Date();
    // Tìm tất cả các đơn hàng chưa thanh toán và đã hết thời gian lockUntil
    const orders = await this.orderModel.find({
      status: 'pending',  // Chỉ các đơn hàng đang trong trạng thái pending
      lockUntil: { $lt: now },  // lockUntil đã qua
    });

    // Duyệt qua tất cả các đơn hàng
    for (const order of orders) {
      for (const item of order.items) {
        const variant = await this.variantModel.findById(item.variantId);

        if (variant) {
          // Giải phóng lại stock
          variant.reservedStock -= item.quantity;
          variant.availableStock += item.quantity;

          // Lưu lại variant đã được cập nhật
          await variant.save();
        }
      }
      order.status = 'cancelled';
      await order.save();
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_10PM) // Mỗi 30 phút chạy
  // async checkCartNoQuantity() {
  //   const now = new Date();
  //   // Tìm tất cả các đơn hàng chưa thanh toán và đã hết thời gian lockUntil
  //   const orders = await this.orderModel.find({
  //     status: 'pending',  // Chỉ các đơn hàng đang trong trạng thái pending
  //     lockUntil: { $lt: now },  // lockUntil đã qua
  //   });

  //   // Duyệt qua tất cả các đơn hàng
  //   for (const order of orders) {
  //     for (const item of order.items) {
  //       const variant = await this.variantModel.findById(item.variantId);

  //       if (variant) {
  //         // Giải phóng lại stock
  //         variant.reservedStock -= item.quantity;
  //         variant.availableStock += item.quantity;

  //         // Lưu lại variant đã được cập nhật
  //         await variant.save();
  //       }
  //     }
  //     order.status = 'cancelled';
  //     await order.save();
  //   }
  //   console.log('Stocks released and orders updated');
  // }
  // Cron job chạy mỗi 10 phút
  @Cron('*/11 * * * *')
  async handleCron() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://apple-macstore.onrender.com/categories'),
      );
    } catch (error) {
    }
  }
}
