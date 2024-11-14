import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    private readonly cloudinaryService: CloudinaryService,
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

      // Xóa những ảnh bị loại bỏ khỏi Cloudinary
      const updatedImagePublicIds = validUploads.map(img => img.publicId);
      const imagesToDelete = existingProduct.images.filter(img => !updatedImagePublicIds.includes(img.publicId));

      // Gọi deleteMedia cho từng publicId hợp lệ
      const deleteMediaPromises = imagesToDelete.map(async image => {
        // Kiểm tra nếu ảnh không có `publicId`, lấy từ URL
        const publicId = image.publicId || extractPublicId(image.image);
        return this.cloudinaryService.deleteMedia(publicId, 'image');
      });
      await Promise.all(deleteMediaPromises);

      // Cập nhật sản phẩm với thông tin mới
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, { ...updateProductDto, images: validUploads }, { new: true })
        .exec();

      return {
        success: true,
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: `Cập nhật sản phẩm thất bại: ${error.message}`,
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
        // Nếu không có publicId, trích xuất từ URL
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
      return {
        success: true,
        message: 'Xóa sản phẩm thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: `Xóa sản phẩm thất bại: ${error.message}`,
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
