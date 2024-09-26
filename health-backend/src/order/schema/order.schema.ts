import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        customizations: {
          size: { type: Number, required: true },
          color: { type: String, required: true },
          material: { type: String, required: true },
          addName: { type: String },
          addLogo: { type: String }
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    required: true
  })
  products: Record<string, any>[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true })
  status: string;

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  })
  shippingAddress: Record<string, any>;

  @Prop({
    type: {
      method: { type: String, required: true },
      transactionId: { type: String },
      status: { type: String, required: true }
    }
  })
  paymentInfo: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
