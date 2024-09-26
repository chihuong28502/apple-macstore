import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecommendationDocument = Recommendation & Document;

@Schema({ timestamps: true })
export class Recommendation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        reason: { type: String, required: true }
      }
    ],
    required: true
  })
  recommendedProducts: Record<string, any>[];
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
