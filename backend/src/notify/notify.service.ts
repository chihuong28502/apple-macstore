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
        message: 'Notification created successfully',
        data: savedNotify,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create notification: ' + error.message,
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
        message: 'Notifications retrieved from cache',
        data: cachedNotifications,
      };
    }

    try {
      const notifications = await this.notifyModel.find().exec();

      // Save to cache
      await this.redisService.setCache(cacheKey, notifications, this.CACHE_TTL);

      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notifications: ' + error.message,
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
        message: 'User notifications retrieved from cache',
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
        message: 'User notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve user notifications: ' + error.message,
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
        message: 'Notification retrieved from cache',
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
          message: 'Notification retrieved successfully',
          data: notification,
        };
      } else {
        return {
          success: false,
          message: 'Notification not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notification: ' + error.message,
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
          message: 'Notification updated successfully',
          data: updatedNotify,
        };
      } else {
        return {
          success: false,
          message: 'Notification not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update notification: ' + error.message,
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
          message: 'Notification deleted successfully',
          data: deletedNotify,
        };
      } else {
        return {
          success: false,
          message: 'Notification not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete notification: ' + error.message,
        data: null,
      };
    }
  }
}
