import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';
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
    private readonly cloudinaryService: CloudinaryService,
    private readonly redisService: RedisService
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
      const validUploads = await this.handleImageUpload(createProductDto.images);

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
      const cachedData: any = await this.redisService.getCache(cacheKey);
      if (cachedData)
        return cachedData;

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

        await this.redisService.setCache(cacheKey, response, 3600); // Cache kết quả
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
      await this.redisService.setCache(cacheKey, response, 3600); // Cache kết quả
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
      const cachedProduct = await this.redisService.getCache(id);
      if (cachedProduct) {
        return {
          success: true,
          message: 'Product retrieved successfully',
          data: cachedProduct
        };
      }

      const product = await this.productModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) }  // Tìm sản phẩm theo ID
        },
        {
          $lookup: {
            from: "variants",  // Tên của collection Variant
            localField: "_id",  // Trường của Product mà bạn muốn nối
            foreignField: "productId",  // Trường trong Variant mà bạn muốn nối
            as: "variants"  // Kết quả sẽ được lưu trong trường variants
          }
        }
      ]);

      if (product.length === 0) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      await this.redisService.setCache(id, product[0], 3600,);
      return {
        success: true,
        message: 'Product Get One successfully',
        data: product[0]
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
      await this.redisService.clearCache(id);
      await this.redisService.clearProductsPageCache()
      // Lưu lại sản phẩm mới vào cache
      await this.redisService.setCache(id, updatedProduct, 3600);

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
      await this.redisService.clearProductsPageCache()
      // Xóa cache của sản phẩm khỏi Redis
      await this.redisService.clearCache(id);

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

  async getAllVariants(productId?: string): Promise<ResponseDto<any>> {
    try {
      const cacheKey = `variants_${productId || 'all'}`;

      // Kiểm tra cache trước
      const cachedVariants = await this.redisService.getCache(cacheKey);
      if (cachedVariants) {
        return {
          success: true,
          message: 'Variants retrieved from cache',
          data: { variants: cachedVariants },
        };
      }

      // Nếu không có cache, truy vấn từ DB
      const variants = await this.variantModel.find({ productId: productId });

      // Lưu vào cache với thời gian hết hạn (ví dụ: 1 giờ)
      await this.redisService.setCache(cacheKey, variants, 3600);

      return {
        success: true,
        message: 'Variants retrieved successfully from database',
        data: { variants },
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
      const cacheKey = `variants_${productId || 'all'}`;
      await this.redisService.clearCache(cacheKey);

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
      // Xóa cache liên quan
      const cacheKey = `variants_${updatedVariant.productId || 'all'}`;
      await this.redisService.clearCache(cacheKey); // Xóa cache cũ
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
      const variantToDelete = await this.variantModel.findById(id).exec();
      if (!variantToDelete) {
        return {
          success: false,
          message: 'Variant not found',
          data: null,
        };
      }
      await this.variantModel.findByIdAndDelete(id).exec();
      const cacheKey = `variants_${variantToDelete.productId || 'all'}`;
      await this.redisService.clearCache(cacheKey);
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

  // handle
  private async handleImageUpload(images: string[]): Promise<{ image: string; publicId: string }[]> {
    const uploadedImages = await Promise.all(
      images.map(async (base64: string) => {
        const base64Str = base64.split(',')[1];
        const buffer = Buffer.from(base64Str, 'base64');
        const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
        return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
      })
    );
    return uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];
  }

}
