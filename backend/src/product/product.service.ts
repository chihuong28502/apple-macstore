import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateMultipleProductsDto } from './dto/create-multi.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<ResponseDto<Product>> {
    try {
      const createdProduct = new this.productModel(createProductDto);
      const savedProduct = await createdProduct.save();
      return {
        success: true,
        message: 'Product created successfully',
        data: savedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product',
        data: null,
      };
    }
  }

  async createMultiple(createMultipleProductsDto: CreateMultipleProductsDto): Promise<ResponseDto<Product[]>> {
    try {
      const createdProducts = await this.productModel.insertMany(createMultipleProductsDto.products);
      return {
        success: true,
        message: 'Products created successfully',
        data: createdProducts,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create products',
        data: null,
      };
    }
  }

  async getAll(
    page: number,
    categoryId: string,
    limit: number,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<ResponseDto<{ products: Product[]; total: number }>> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};

      if (categoryId) {
        filter.categoryId = categoryId;
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice !== undefined) {
        filter.price = { $gte: minPrice };
      } else if (maxPrice !== undefined) {
        filter.price = { $lte: maxPrice };
      }

      const total = await this.productModel.countDocuments(filter).exec();
      const products = await this.productModel
        .find(filter)
        .populate('categoryId', 'name description')
        .limit(limit)
        .skip(skip)
        .exec();


      return {
        success: true,
        message: 'Products retrieved successfully',
        data: { products: products, total },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve products',
        data: { products: [], total: 0 },
      };
    }
  }

  async findOne(id: string): Promise<ResponseDto<Product>> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve product: ${error.message}`,
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseDto<Product>> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update product: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<ResponseDto<Product>> {
    try {
      const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
      if (!deletedProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete product: ${error.message}`,
        data: null,
      };
    }
  }
}
