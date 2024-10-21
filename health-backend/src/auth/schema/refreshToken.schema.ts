import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId; // Liên kết với mô hình User

  @Prop({ required: true })
  token: string; // Token JWT hoặc chuỗi token được tạo ra

  @Prop({ required: true })
  deviceInfo: string; // Thông tin về thiết bị

  @Prop({ required: true })
  ipAddress: string; // Địa chỉ IP của thiết bị

  @Prop({ required: true })
  expiresAt: Date; // Thời gian hết hạn của refresh token
}

// Tạo schema từ class RefreshToken
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
