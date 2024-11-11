import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;  // Tên sản phẩm (MacBook, Mac mini, iMac)

  @Prop({ default: true })  // Set default value as true
  isPublic: boolean;

  @Prop({ required: true })
  description: string;  // Mô tả sản phẩm

  @Prop({ required: true, min: 0 })
  price: number;  // Giá bán sản phẩm

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ type: [{ image: String, publicId: String }], required: true })
  images: { image: string; publicId: string; }[];

  @Prop([String])
  tags: string[];  // Thẻ tìm kiếm cho sản phẩm

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
