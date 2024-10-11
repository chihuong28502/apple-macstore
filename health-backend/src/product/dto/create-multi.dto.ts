// src/products/dto/create-multiple-products.dto.ts
import { IsArray, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  price: number;

  @IsString()
  categoryId: string;

  // Các thuộc tính khác như images, tags, stock, v.v.
}

export class CreateMultipleProductsDto {
  @IsArray()
  products: CreateProductDto[];
}
