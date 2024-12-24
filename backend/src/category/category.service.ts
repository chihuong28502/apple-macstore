import { RedisService } from './../redis/redis.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  private readonly CACHE_TTL = 3600;
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly redisService: RedisService,
  ) { }

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseDto<Category>> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      await createdCategory.save();
      await this.redisService.clearCache('categories_all');
      return {
        success: true,
        message: 'Tạo danh mục thành công',
        data: createdCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Tạo danh mục thất bại',
        data: null,
      };
    }
  }

  // Find all categories
  async findAll(): Promise<ResponseDto<Category[]>> {
    try {
      const cacheKey = 'categories_all';

      // Check cache first
      const cachedCategories = await this.redisService.getCache<Category[]>(cacheKey);
      if (cachedCategories) {
        return {
          success: true,
          message: 'Lấy danh sách danh mục từ cache thành công',
          data: cachedCategories,
        };
      }
      const categories = await this.categoryModel.find().select('-__v -createdAt -updatedAt').exec();
      await this.redisService.setCache(cacheKey, categories, this.CACHE_TTL);
      return {
        success: true,
        message: 'Lấy danh sách danh mục thành công',
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy danh sách danh mục thất bại',
        data: [],
      };
    }
  }

  // Find one category by ID
  async findOne(id: string): Promise<ResponseDto<Category>> {
    try {
      const cacheKey = `category_${id}`;
      const cachedCategory = await this.redisService.getCache<Category>(cacheKey);
      if (cachedCategory) {
        return {
          success: true,
          message: 'Lấy thông tin danh mục từ cache thành công',
          data: cachedCategory,
        };
      }
      const category = await this.categoryModel.findById(id).select('-__v -createdAt -updatedAt').exec();
      if (!category) {
        return {
          success: false,
          message: `Không tìm thấy danh mục với ID "${id}"`,
          data: null,
        };
      }
      await this.redisService.setCache(cacheKey, category, this.CACHE_TTL);
      return {
        success: true,
        message: 'Lấy thông tin danh mục thành công',
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy thông tin danh mục thất bại',
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDto<Category>> {
    try {
      const cacheKeyById = `category_${id}`;
      const cacheKeyAllCate = `categories_all}`;
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .select('-__v -createdAt -updatedAt')
        .exec();
      if (!updatedCategory) {
        return {
          success: false,
          message: `Không tìm thấy danh mục với ID "${id}"`,
          data: null,
        };
      }
      await this.redisService.clearCache(cacheKeyById);
      await this.redisService.clearCache(cacheKeyAllCate);
      return {
        success: true,
        message: 'Cập nhật danh mục thành công',
        data: updatedCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cập nhật danh mục thất bại',
        data: null,
      };
    }
  }

  async remove(id: string): Promise<ResponseDto<Category>> {
    try {
      const cacheKeyById = `category_${id}`;
      const cacheKeyAllCate = `categories_all}`;
      // Lấy tất cả các category con của category này
      const allCategories = await this.getAllChildCategories(id);
      // Thêm cả category chính vào danh sách cần xóa
      const categoriesToDelete = [...allCategories, { _id: id }];
      // Xóa tất cả các category con và category chính
      await this.categoryModel.deleteMany({
        _id: { $in: categoriesToDelete.map((category) => category._id) },
      }).exec();

      // Trả về phản hồi thành công
      await this.redisService.clearCache(cacheKeyById);
      await this.redisService.clearCache(cacheKeyAllCate);
      return {
        success: true,
        message: 'Xóa danh mục thành công',
        data: [],
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        message: 'Xóa danh mục thất bại',
        data: null,
      };
    }
  }

  private async getAllChildCategories(parentId: string): Promise<CategoryDocument[]> {
    const children = await this.categoryModel.find({ parentCategoryId: parentId }).exec();
    let allChildren: CategoryDocument[] = [...children]; // Đảm bảo allChildren là mảng CategoryDocument

    // Đệ quy tìm category con của các category con
    for (let child of children) {
      const childCategories = await this.getAllChildCategories(child._id.toString());
      allChildren = [...allChildren, ...childCategories];
    }

    return allChildren;
  }

}
