import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notify, NotifyDocument } from './schema/notify.schema';
import { NotificationsGateway } from './notifications.gateway';

interface ResponseDto<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export class NotifyService {
  constructor(@InjectModel(Notify.name) private notifyModel: Model<NotifyDocument>,
    private readonly notificationsGateway: NotificationsGateway) { }

  async createNotify(createNotifyDto: Partial<Notify>): Promise<ResponseDto<Notify>> {
    try {
      const newNotify = new this.notifyModel(createNotifyDto);
      const savedNotify = await newNotify.save();
      this.notificationsGateway.sendNotification(createNotifyDto)
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
    try {
      const notifications = await this.notifyModel.find().exec();

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
    try {
      const notifications = await this.notifyModel.find({ customer: new Types.ObjectId(userId) }).exec();
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
    try {
      const notification = await this.notifyModel.findById(id).exec();

      if (notification) {
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
