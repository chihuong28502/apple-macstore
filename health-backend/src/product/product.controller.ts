import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RulesGuard) // Sử dụng RulesGuard để kiểm tra vai trò
  @Roles('admin', 'support')
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Public()
  @Get()
  async getAllProducts(
    @Query('categoryId') categoryId: string,
    @Query('page') page: number = 1, // Mặc định là trang 1
    @Query('limit') limit: number = 10, // Mặc định mỗi trang 10 sản phẩm
  ): Promise<{ data: Product[]; total: number; success: boolean }> {
    return await this.productService.getAll(
      page,
      categoryId,
      limit,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
