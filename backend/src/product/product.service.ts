import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateMultipleProductsDto } from './dto/create-multi.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<ResponseDto<Product>> {
    try {
      // Tải lên tất cả ảnh từ danh sách base64
      const uploadedImages = await Promise.all(
        createProductDto.images.map(async (base64: string) => {
          const base64Str = base64.split(',')[1]; // Lấy phần dữ liệu base64 (bỏ qua phần prefix)
          const buffer = Buffer.from(base64Str, 'base64'); // Chuyển đổi base64 thành Buffer
          const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
          
          // Trả về đối tượng với URL và publicId nếu thành công, ngược lại trả về null
          return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null; 
        })
      );
  
      // Lọc những kết quả hợp lệ (không phải null)
      const validUploads = uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];
  
      // Tạo sản phẩm với danh sách ảnh đã upload
      const createdProduct = new this.productModel({
        ...createProductDto,
        images: validUploads, 
      });
  
      // Lưu sản phẩm vào database
      await createdProduct.save();
  
      return {
        success: true,
        message: 'Product created successfully',
        data: createdProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product: ' + error.message,
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
    categoryId?: string,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<ResponseDto<{ products: Product[]; total: number }>> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};

      // Nếu categoryId không được truyền vào, trả về tất cả sản phẩm
      if (!categoryId) {
        // Thêm bộ lọc giá nếu có
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
          // .select('_id name price images reviewsCount') // Chọn các trường cần thiết
          .limit(limit)
          .skip(skip)
          .exec();

        return {
          success: true,
          message: 'Products retrieved successfully',
          data: { products: products, total },
        };
      }

      // Tiếp tục xử lý nếu có categoryId
      const currentCategory = await this.categoryModel.findById(categoryId).exec();
      if (!currentCategory) {
        return {
          success: false,
          message: 'Category not found',
          data: { products: [], total: 0 },
        };
      }

      // Hàm để tìm tất cả các danh mục con (đệ quy)
      const findAllChildCategories = async (parentId: string): Promise<string[]> => {
        const categoryIds: string[] = [];
        const childCategories = await this.categoryModel.find({ parentCategoryId: parentId }).exec();

        for (const child of childCategories) {
          categoryIds.push(child._id.toString()); // Lưu ID của danh mục con
          const grandChildIds = await findAllChildCategories(child._id.toString());
          categoryIds.push(...grandChildIds); // Thêm các danh mục con vào mảng
        }

        return categoryIds; // Trả về danh sách tất cả các danh mục con
      };

      // Lấy danh sách các danh mục con
      let categoryIds: string[] = [];
      if (currentCategory.parentCategoryId === null) {
        // Cấp 1: lấy tất cả cấp 2 và cấp 3
        const childCategories = await findAllChildCategories(categoryId);
        categoryIds = [categoryId, ...childCategories];
      } else {
        const parentCategory = await this.categoryModel.findById(currentCategory.parentCategoryId).exec();
        if (parentCategory) {
          if (parentCategory.parentCategoryId === null) {
            const childCategories = await findAllChildCategories(categoryId);
            categoryIds = [categoryId, ...childCategories];
          } else {
            categoryIds = [categoryId];
          }
        }
      }

      // Thêm danh sách danh mục vào filter
      if (categoryIds.length > 0) {
        filter.categoryId = { $in: categoryIds }; // Lọc sản phẩm theo các danh mục
      }

      // Thêm bộ lọc giá
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
        // .select('_id name price images reviewsCount')
        .populate('categoryId', 'name')
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
      const productToDelete = await this.productModel.findById(id).exec();
      if (!productToDelete) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
  
      // Lọc ra các publicId hợp lệ (sử dụng _id trong trường hợp này)
      const validImagePublicIds = productToDelete.images
        .map(image => image.publicId) // Lấy _id từ từng image
        .filter(publicId => publicId); // Lọc những publicId không hợp lệ (undefined hoặc null)
  
      // Gọi deleteMedia cho từng publicId hợp lệ
      const deleteMediaPromises = validImagePublicIds.map(async (publicId) => {
        return this.cloudinaryService.deleteMedia(publicId, 'image');
      });
  
      // Chờ cho tất cả các promise được hoàn thành
      const deleteMediaResults = await Promise.all(deleteMediaPromises);
  
      // Kiểm tra xem tất cả các ảnh đã được xóa thành công
      const allDeleted = deleteMediaResults.every(result => result.success);
      if (!allDeleted) {
        throw new Error('Some media files failed to delete');
      }
  
      // Xóa sản phẩm
      await this.productModel.findByIdAndDelete(id).exec();
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete product: ${error.message}`,
      };
    }
  }
  
}
