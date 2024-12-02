import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 }) // Xếp hạng từ 1 đến 5
  rating: number;

  @Prop({ required: true })
  review_text: string;

  @Prop({ default: 0 }) // Số lượt đánh giá hữu ích
  helpful_count: number;

  @Prop({ default: false }) // Có phải là đơn hàng đã mua không
  is_verified_purchase: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);