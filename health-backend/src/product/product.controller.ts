import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';

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
    @Query('minPrice') minPrice: number, // Thêm lọc giá tối thiểu
    @Query('maxPrice') maxPrice: number, // Thêm lọc giá tối đa
  ): Promise<{ data: Product[]; total: number; success: boolean }> {
    return await this.productService.getAll(page, categoryId, limit, minPrice, maxPrice);
  }
  

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{data:Product,success:boolean}> {
    return this.productService.findOne(id);
  }

  @Roles('admin', 'support')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Roles('admin', 'support')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
