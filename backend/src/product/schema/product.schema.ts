import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;  // Tên sản phẩm (MacBook, Mac mini, iMac)

  @Prop({ required: true })
  description: string;  // Mô tả sản phẩm

  @Prop({ required: true, min: 0 })
  basePrice: number;  // Giá nhập sản phẩm (giá gốc)

  @Prop({ required: true, min: 0 })
  price: number;  // Giá bán sản phẩm

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;  // ID danh mục sản phẩm (Mac mini, MacBook, iMac)

  @Prop([String])
  images: string[];  // URL hình ảnh sản phẩm

  @Prop([String])
  tags: string[];  // Thẻ tìm kiếm cho sản phẩm

  @Prop({
    type: {
      models: { type: [String], default: [] },  
      storageOptions: { type: [String], default: [] },
      ramOptions: { type: [String], default: [] },  
      colors: { type: [String], default: [] },
    },
    _id: false,
    default: {},
  })
  specifications: {
    models: string[],
    storageOptions: string[],
    ramOptions: string[],
    colors: string[],
  };  

  @Prop({ default: 0 })
  reviewsCount: number;  // Số lượng đánh giá

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;  // Đánh giá trung bình (0 đến 5 sao)

  @Prop({
    type: Map, // Map của màu sắc và cấu hình, mỗi cấu hình chứa số lượng tồn kho
    of: {
      type: Map,
      of: Number, 
    },
    default: new Map(),
  })
  stock: Map<string, Map<string, number>>;  

  @Prop({ default: Date.now })
  createdAt: Date;  

  @Prop({ default: Date.now })
  updatedAt: Date; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);
