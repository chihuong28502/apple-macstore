import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({  })
  name: string;  // Tên sản phẩm

  @Prop({  })
  description: string;  // Mô tả sản phẩm

  @Prop({  min: 0 })
  basePrice: number;  // Giá nhập sản phẩm (giá gốc)

  @Prop({  min: 0 })
  price: number;  // Giá bán sản phẩm

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category',  }) 
  categoryId: string;  // ID danh mục sản phẩm

  @Prop([String])
  images: string[];  // URL hình ảnh sản phẩm

  @Prop([String])
  tags: string[];  // Thẻ tìm kiếm cho sản phẩm

  @Prop({
    type: {
      colors: { type: [String], default: [] },  // Màu sắc sản phẩm
      sizes: { type: [String], default: [] },  // Kích cỡ sản phẩm
      materials: { type: [String], default: [] },  // Chất liệu sản phẩm
      personalizationOptions: {
        addName: { type: Boolean, default: false },  // Tùy chọn thêm tên cá nhân
        addLogo: { type: Boolean, default: false },  // Tùy chọn thêm logo cá nhân
      },
    },
    _id: false,  // Loại bỏ _id cho tùy chỉnh
    default: {},
  })
  customizations: {
    colors: string[],
    sizes: string[],
    materials: string[],
    personalizationOptions: {
      addName: boolean,
      addLogo: boolean,
    }
  };  // Tùy chọn cá nhân hóa

  @Prop({ default: 0 })
  reviewsCount: number;  // Số lượng đánh giá

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;  // Đánh giá trung bình (0 đến 5 sao)

  @Prop({
    type: Map, // Map của màu sắc, mỗi màu lại chứa một Map khác của kích cỡ và tồn kho
    of: {
      type: Map,
      of: Number,  // Mỗi kích cỡ có một số lượng tồn kho
    },
    default: new Map(),
  })
  stock: Map<string, Map<number, number>>;  // Quản lý tồn kho theo màu và kích cỡ

  @Prop({ default: Date.now })
  createdAt: Date;  // Ngày tạo sản phẩm

  @Prop({ default: Date.now })
  updatedAt: Date;  // Ngày cập nhật sản phẩm
}

export const ProductSchema = SchemaFactory.createForClass(Product);
