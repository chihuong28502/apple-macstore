import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VariantDocument = Variant & Document;

@Schema({ timestamps: true })
export class Variant {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  colorCode: string;

  @Prop({ required: true })
  ram: string;

  @Prop({ required: true })
  ssd: string;

  @Prop({ required: true, min: 0 })
  price: number;  // Giá bán sản phẩm

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  availableStock: number;

  @Prop({ required: true, default: 0 })
  reservedStock: number;

  @Prop({ required: true })
  status: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
