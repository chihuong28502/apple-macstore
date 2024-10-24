import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { CreateMultipleProductsDto } from './dto/create-multi.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response
  ) {
    const result = await this.productService.create(createProductDto);
    return res.status(result.success ? 201 : 400).json(result);
  }

  @Post('create-multiple')
  async createMultiple(
    @Body() createMultipleProductsDto: CreateMultipleProductsDto,
    @Res() res: Response
  ) {
    const result = await this.productService.createMultiple(createMultipleProductsDto);
    return res.status(result.success ? 201 : 400).json(result);
  }

  @Public()
  @Get()
  async getAllProducts(
    @Res() res: Response,
    @Query('categoryId') categoryId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number
  ) {
    const result = await this.productService.getAll(page, categoryId, limit, minPrice, maxPrice);
    return res.status(result.success ? 200 : 500).json(result);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const result = await this.productService.findOne(id);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const result = await this.productService.update(id, updateProductDto);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

  @Delete(':id')
  async remove(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const result = await this.productService.remove(id);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }
}