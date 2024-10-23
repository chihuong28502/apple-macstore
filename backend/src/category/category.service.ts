import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

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

  // Update a category
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

  // Remove a category
  async remove(id: string): Promise<ResponseDto<Category>> {
    try {
      const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!deletedCategory) {
        return {
          success: false,
          message: `Category with ID "${id}" not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Category deleted successfully',
        data: deletedCategory,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete category',
        data: null,
      };
    }
  }
}
