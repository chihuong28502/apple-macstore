import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model, Types } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { extractPublicId } from 'src/utils/func/getPublicId';
import { CreateMultipleProductsDto } from './dto/create-multi.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { Variant, VariantDocument } from './schema/variants.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly cloudinaryService: CloudinaryService,
    // private readonly redisService: RedisService
  ) { }

  async create(createProductDto: any): Promise<ResponseDto<Product>> {
    try {
      const uploadedImages = await Promise.all(
        createProductDto.images.map(async (base64: any) => {
          const base64Str = base64.split(',')[1];
          const buffer = Buffer.from(base64Str, 'base64');
          const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
          return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
        })
      );

      // Lọc những kết quả hợp lệ (không phải null)
      const validUploads = uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];

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

  async getAllProducts(
    page: number,
    categoryId?: string,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<ResponseDto<{ products: Product[]; total: number }>> {
    try {

      const cacheKey = `products_page_${page}_${categoryId || 'all'}_${minPrice || 'min'}_${maxPrice || 'max'}`;
      const skip = (page - 1) * limit;
      const filter: any = {};
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Returning products from cache');
        return JSON.parse(cachedData); // Trả về dữ liệu cache
      }

      // Nếu không có dữ liệu trong cache, truy vấn database
      console.log('Fetching products from database');
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

        // Lưu vào Redis cache (TTL = 300 giây)
        const response = {
          success: true,
          message: 'Products retrieved successfully',
          data: { products, total },
        };

        await this.redisClient.setex(cacheKey, 300, JSON.stringify(response)); // Cache kết quả
        return response;
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

      const response = {
        success: true,
        message: 'Products retrieved successfully',
        data: { products, total },
      };

      // Lưu vào Redis cache (TTL = 300 giây)
      await this.redisClient.setex(cacheKey, 300, JSON.stringify(response)); // Cache kết quả
      return response;
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
      // Kiểm tra xem sản phẩm có trong cache không
      const cachedProduct = await this.redisClient.get(id);
      if (cachedProduct) {
        console.log('Returning product from cache');
        return {
          success: true,
          message: 'Product fetched from cache',
          data: JSON.parse(cachedProduct),
        };
      }

      // Nếu không có trong cache, truy vấn từ database
      const product = await this.productModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'variants',
            localField: '_id',
            foreignField: 'productId',
            as: 'variants',
          },
        },
      ]);

      if (product.length === 0) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }

      // Lưu vào cache Redis với TTL = 3600 giây (1 giờ)
      await this.redisClient.setex(id, 3600, JSON.stringify(product[0]));

      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product[0],
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
      // Lấy sản phẩm hiện tại từ DB
      const existingProduct = await this.productModel.findById(id).exec();
      if (!existingProduct) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID "${id}"`);
      }

      // Kiểm tra và upload các ảnh mới (nếu cần)
      const uploadedImages = await Promise.all(
        updateProductDto.images.map(async (image: any) => {
          if (!image.image.startsWith('https://res.cloudinary.com/')) {
            // Tách base64 phần cần thiết
            const base64Str = image.image.split(',')[1];
            const buffer = Buffer.from(base64Str, 'base64');
            const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
            return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
          }
          return image; // Nếu ảnh đã có trên Cloudinary, giữ nguyên
        })
      );

      // Lọc những ảnh hợp lệ (không phải null)
      const validUploads = uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];

      // Cập nhật sản phẩm với thông tin mới
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, { ...updateProductDto, images: validUploads }, { new: true })
        .exec();

      // Xóa cache cũ sau khi cập nhật
      await this.redisClient.del(id);

      // Lưu lại sản phẩm mới vào cache
      await this.redisClient.setex(id, 3600, JSON.stringify(updatedProduct));

      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: `Product update failed: ${error.message}`,
        data: null,
      };
    }
  }

  // async clearCacheForAllProducts() {
  //   const redisClient = this.redisService.getClient();

  //   let cursor = '0';  // Bắt đầu từ cursor '0' để quét tất cả keys
  //   const pattern = 'products_page_*';  // Pattern cần tìm kiếm

  //   // Sử dụng SCAN để tìm tất cả các key matching với pattern
  //   do {
  //     const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
  //     cursor = result[0];  // Lấy cursor mới để tiếp tục quét nếu có thêm keys

  //     // result[1] chứa danh sách keys matching pattern
  //     const keysToDelete = result[1];

  //     // Nếu có keys cần xóa, thực hiện xóa chúng
  //     if (keysToDelete.length > 0) {
  //       await redisClient.del(...keysToDelete);  // Xóa tất cả các keys trong danh sách
  //     }
  //   } while (cursor !== '0');  // Tiếp tục quét cho đến khi cursor = '0'
  // }

  async remove(id: string): Promise<ResponseDto<Product>> {
    try {
      const productToDelete = await this.productModel.findById(id).exec();
      if (!productToDelete) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID "${id}"`);
      }
  
      // Lọc ra các publicId hợp lệ hoặc lấy từ URL nếu cần
      const validImagePublicIds = productToDelete.images.map(image => {
        return image.publicId || extractPublicId(image.image);
      });
  
      // Gọi deleteMedia cho từng publicId hợp lệ
      const deleteMediaPromises = validImagePublicIds.map(async publicId => {
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
  
      // Xóa cache của sản phẩm khỏi Redis
      await this.redisClient.del(id);
  
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Product deletion failed: ${error.message}`,
      };
    }
  }
  

  // VARIANT

  async getAllVariants(
    productId?: string,
  ): Promise<ResponseDto<any>> {
    try {
      const variants = await this.variantModel.find({ productId: productId })
      return {
        success: true,
        message: 'variants retrieved successfully',
        data: { variants: variants },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve variants',
        data: { variants: [] },
      };
    }
  }

  async createVariant(createVariant: any): Promise<ResponseDto<any>> {
    try {
      const { productId } = createVariant;
      const variantData = new this.variantModel(
        {
          ...createVariant,
          availableStock: createVariant.stock,
          productId
        })
      // Lưu sản phẩm vào database
      await variantData.save();

      return {
        success: true,
        message: 'variantData created successfully',
        data: variantData,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product: ' + error.message,
        data: null,
      };
    }
  }

  async updateVariant(
    id: string,
    updateVariant: any,
  ): Promise<ResponseDto<any>> {
    try {
      const updatedVariant = await this.variantModel
        .findByIdAndUpdate(id, { ...updateVariant }, { new: true })
        .exec();

      return {
        success: true,
        message: 'Cập nhật variant thành công',
        data: updatedVariant,
      };
    } catch (error) {
      return {
        success: false,
        message: `Cập nhật variant thất bại: ${error.message}`,
        data: null,
      };
    }
  }

  async removeVariant(id: string): Promise<ResponseDto<any>> {
    try {
      await this.variantModel.findByIdAndDelete(id).exec();
      return {
        success: true,
        message: 'Xóa variant thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: `Xóa variant thất bại: ${error.message}`,
      };
    }
  }
}
