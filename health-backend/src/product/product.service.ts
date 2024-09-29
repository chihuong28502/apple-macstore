import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }


async getAll(
  page: number,
  categoryId: string,
  limit: number,
): Promise<{ data: Product[]; total: number; success: boolean }> {
  const skip = (page - 1) * limit; 

  // Tạo điều kiện lọc nếu có categoryId
  const filter = categoryId ? { categoryId } : {};

  // Lấy tổng số sản phẩm để tính tổng số trang, dựa trên filter
  const total = await this.productModel.countDocuments(filter).exec();

  // Lấy danh sách sản phẩm với phân trang
  const products = await this.productModel
    .find(filter) // Lọc theo categoryId nếu có, ngược lại lấy tất cả
    .populate('categoryId', 'name description') // Liên kết với collection Category
    .limit(limit) // Giới hạn số lượng sản phẩm trả về
    .skip(skip) // Bỏ qua sản phẩm đã lấy ở trang trước đó
    .exec();

  return { data: products, total, success: true };
}


  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return deletedProduct;
  }
}
