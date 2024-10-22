import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schema/category.schema';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseDto } from 'src/utils/dto/response.dto';

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseDto<Category>> {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<ResponseDto<Category[]>> {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto<Category>> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<ResponseDto<Category>> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto<Category>> {
    return this.categoryService.remove(id);
  }
}
