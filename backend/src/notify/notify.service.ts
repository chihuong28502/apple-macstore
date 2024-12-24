import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notify, NotifyDocument } from './schema/notify.schema';

interface ResponseDto<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export class NotifyService {
  private readonly CACHE_TTL = 3600;
  constructor(@InjectModel(Notify.name) private notifyModel: Model<NotifyDocument>,
    private readonly redisService: RedisService,
    private readonly notificationsGateway: NotificationsGateway) { }

  async createNotify(createNotifyDto: Partial<Notify>): Promise<ResponseDto<Notify>> {
    try {
      const newNotify = new this.notifyModel(createNotifyDto);
      const savedNotify = await newNotify.save();
      this.notificationsGateway.sendNotification(createNotifyDto)

      await this.redisService.clearCache('notifications_all');
      await this.redisService.clearCache(`notifications_user_${createNotifyDto.customer}`);

      return {
        success: true,
        message: 'Tạo thông báo thành công',
        data: savedNotify,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Tạo thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async findAll(): Promise<ResponseDto<Notify[]>> {
    const cacheKey = 'notifications_all';

    // Check cache first
    const cachedNotifications = await this.redisService.getCache<Notify[]>(cacheKey);
    if (cachedNotifications) {
      return {
        success: true,
        message: 'Lấy danh sách thông báo từ cache thành công',
        data: cachedNotifications,
      };
    }

    try {
      const notifications = await this.notifyModel.find().exec();

      // Save to cache
      await this.redisService.setCache(cacheKey, notifications, this.CACHE_TTL);

      return {
        success: true,
        message: 'Lấy danh sách thông báo thành công',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy danh sách thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async findNotifyByUserId(userId: string): Promise<ResponseDto<Notify[]>> {
    const cacheKey = `notifications_user_${userId}`;

    // Check cache first
    const cachedNotifications = await this.redisService.getCache<Notify[]>(cacheKey);
    if (cachedNotifications) {
      return {
        success: true,
        message: 'Lấy thông tin thông báo từ cache thành công',
        data: cachedNotifications,
      };
    }

    try {
      const notifications = await this.notifyModel
        .find({ customer: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .exec();

      // Save to cache
      await this.redisService.setCache(cacheKey, notifications, this.CACHE_TTL);

      return {
        success: true,
        message: 'Lấy thông tin thông báo thành công',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy thông tin thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async findOne(id: string): Promise<ResponseDto<Notify>> {
    const cacheKey = `notification_${id}`;

    // Check cache first
    const cachedNotification = await this.redisService.getCache<Notify>(cacheKey);
    if (cachedNotification) {
      return {
        success: true,
        message: 'Lấy thông báo thành công',
        data: cachedNotification,
      };
    }

    try {
      const notification = await this.notifyModel.findById(id).exec();

      if (notification) {
        // Save to cache
        await this.redisService.setCache(cacheKey, notification, this.CACHE_TTL);

        return {
          success: true,
          message: 'Lấy thông báo thành công',
          data: notification,
        };
      } else {
        return {
          success: false,
          message: 'Không tìm thấy thông báo',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Lấy thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async updateNotify(id: string, updateNotifyDto: Partial<Notify>): Promise<ResponseDto<Notify>> {
    try {
      const updatedNotify = await this.notifyModel.findByIdAndUpdate(id, updateNotifyDto, { new: true }).exec();

      if (updatedNotify) {
        // Invalidate cache liên quan
        await this.redisService.clearCache(`notification_${id}`);
        await this.redisService.clearCache('notifications_all');
        await this.redisService.clearCache(`notifications_user_${updatedNotify.customer}`);

        return {
          success: true,
          message: 'Cập nhật thông báo thành công',
          data: updatedNotify,
        };
      } else {
        return {
          success: false,
          message: 'Không tìm thấy thông báo',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Cập nhật thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }

  async deleteNotify(id: string): Promise<ResponseDto<Notify>> {
    try {
      const deletedNotify = await this.notifyModel.findByIdAndDelete(id).exec();

      if (deletedNotify) {
        // Invalidate cache liên quan
        await this.redisService.clearCache(`notification_${id}`);
        await this.redisService.clearCache('notifications_all');
        await this.redisService.clearCache(`notifications_user_${deletedNotify.customer}`);

        return {
          success: true,
          message: 'Xóa thông báo thành công',
          data: deletedNotify,
        };
      } else {
        return {
          success: false,
          message: 'Không tìm thấy thông báo',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Xóa thông báo thất bại: ' + error.message,
        data: null,
      };
    }
  }
}
