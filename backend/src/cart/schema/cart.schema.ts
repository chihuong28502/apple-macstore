import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CartItem = {
  productId: Types.ObjectId; // hoặc Schema.Types.ObjectId
  stockId: Types.ObjectId;    // hoặc Schema.Types.ObjectId
  quantity: number;
};

export type CartDocument = Cart & Document;
@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    type: [{ 
      productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      stockId: { type: MongooseSchema.Types.ObjectId, ref: 'Product.stock', required: true } // Đảm bảo rằng nó tham chiếu đúng
    }]
  })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);