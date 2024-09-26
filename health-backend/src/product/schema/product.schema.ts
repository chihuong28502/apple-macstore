import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;  // Tên sản phẩm

  @Prop({ required: true })
  description: string;  // Mô tả sản phẩm

  @Prop({ required: true })
  basePrice: number;  // Giá nhập sản phẩm (giá gốc)

  @Prop({ required: true })
  price: number;  // Giá bán sản phẩm

  @Prop({ type: String })
  categoryId: string;  // Tham chiếu đến Category

  @Prop([String])
  images: string[];  // URL hình ảnh sản phẩm

  @Prop([String])
  tags: string[];  // Thẻ tìm kiếm cho sản phẩm

  @Prop({
    type: {
      colors: [String],  // Màu sắc sản phẩm
      sizes: [Number],  // Kích cỡ sản phẩm
      materials: [String],  // Chất liệu sản phẩm
      personalizationOptions: {
        addName: { type: Boolean },  // Tùy chọn thêm tên cá nhân
        addLogo: { type: Boolean }  // Tùy chọn thêm logo cá nhân
      }
    }
  })
  customizations: Record<string, any>;

  @Prop({ default: 0 })
  reviewsCount: number;  // Số lượng đánh giá

  @Prop({ default: 0 })
  averageRating: number;  // Đánh giá trung bình

  @Prop({ type: Object })
  stock: Record<string, number>;  // Quản lý tồn kho theo biến thể

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
