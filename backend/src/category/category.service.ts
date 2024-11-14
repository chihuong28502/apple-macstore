import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseDto<Category>> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      await createdCategory.save();
      return {
        success: true,
        message: 'Category created successfully',
        data: createdCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create category',
        data: null,
      };
    }
  }

  // Find all categories
  async findAll(): Promise<ResponseDto<Category[]>> {
    try {
      const categories = await this.categoryModel.find().select('-__v -createdAt -updatedAt').exec();
      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve categories',
        data: [],
      };
    }
  }

  // Find one category by ID
  async findOne(id: string): Promise<ResponseDto<Category>> {
    try {
      const category = await this.categoryModel.findById(id).select('-__v -createdAt -updatedAt').exec();
      if (!category) {
        return {
          success: false,
          message: `Category with ID "${id}" not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve category',
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDto<Category>> {
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .select('-__v -createdAt -updatedAt')
        .exec();
      if (!updatedCategory) {
        return {
          success: false,
          message: `Category with ID "${id}" not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update category',
        data: null,
      };
    }
  }

  async remove(id: string): Promise<ResponseDto<Category>> {
    try {
      // Lấy tất cả các category con của category này
      const allCategories = await this.getAllChildCategories(id);
      // Thêm cả category chính vào danh sách cần xóa
      const categoriesToDelete = [...allCategories, { _id: id }];
      // Xóa tất cả các category con và category chính
      await this.categoryModel.deleteMany({
        _id: { $in: categoriesToDelete.map((category) => category._id) },
      }).exec();

      // Trả về phản hồi thành công
      return {
        success: true,
        message: 'Category deleted successfully',
        data: [],
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        message: 'Failed to delete category',
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
