import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  qr: string;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: Types.ObjectId, ref: 'Variant', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        productName: { type: String, required: true },
        productDescription: { type: String },
        productImages: { type: [] },
        color: { type: String },
        ram: { type: String },
        ssd: { type: String },
        stock: { type: Number }
      }
    ],
    required: true
  })
  items: Record<string, any>[];

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  taxAmount: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Shipping', required: true })
  shippingId: Types.ObjectId;

  @Prop({
    type: {
      method: { type: String, },
      transactionId: { type: String },
      status: { type: String, }
    },

  })
  paymentInfo: Record<string, any>;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
