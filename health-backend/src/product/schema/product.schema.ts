import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;  // Tên sản phẩm

  @Prop({ required: true })
  description: string;  // Mô tả sản phẩm

  @Prop({ required: true, min: 0 })
  basePrice: number;  // Giá nhập sản phẩm (giá gốc)

  @Prop({ required: true, min: 0 })
  price: number;  // Giá bán sản phẩm

  @Prop({ type: String, required: true, ref: 'Category' }) 
  categoryId: string;  // ID danh mục sản phẩm

  @Prop([String])
  images: string[];  // URL hình ảnh sản phẩm

  @Prop([String])
  tags: string[];  // Thẻ tìm kiếm cho sản phẩm

  @Prop({
    type: {
      colors: { type: [String], default: [] },  // Màu sắc sản phẩm
      sizes: { type: [Number], default: [] },  // Kích cỡ sản phẩm
      materials: { type: [String], default: [] },  // Chất liệu sản phẩm
      personalizationOptions: {
        addName: { type: Boolean, default: false },  // Tùy chọn thêm tên cá nhân
        addLogo: { type: Boolean, default: false }  // Tùy chọn thêm logo cá nhân
      }
    },
    default: {},
  })
  customizations: Record<string, any>;  // Tùy chọn cá nhân hóa

  @Prop({ default: 0 })
  reviewsCount: number;  // Số lượng đánh giá

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;  // Đánh giá trung bình (0 đến 5 sao)

  @Prop({
    type: Map, // Sử dụng Map để quản lý tồn kho theo biến thể
    of: Number,  // Giá trị là số lượng tồn kho
    default: {},
  })
  stock: Record<string, number>;  // Quản lý tồn kho theo biến thể

  @Prop({ default: Date.now })
  createdAt: Date;  // Ngày tạo sản phẩm

  @Prop({ default: Date.now })
  updatedAt: Date;  // Ngày cập nhật sản phẩm
}

export const ProductSchema = SchemaFactory.createForClass(Product);
