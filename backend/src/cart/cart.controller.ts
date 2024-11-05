// src/cart/cart.controller.ts
import { Controller, Post, Get, Put, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CartService } from './cart.service'; // Đảm bảo bạn đã import service cart
import { ResponseDto } from 'src/utils/dto/response.dto';
import { Cart } from './schema/cart.schema';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  async create(@Body('userId') userId: string, @Body('items') items: Array<{ productId: string; quantity: number }>, @Res() res: Response) {
    const result: ResponseDto<Cart> = await this.cartService.create(userId, items);
    const statusCode = result.success ? 201 : 500; // 201 cho tạo mới thành công
    return res.status(statusCode).json(result);
  }

  @Post('add-item') // Endpoint mới để thêm sản phẩm
  async addItemToCart(@Body('userId') userId: string, @Body('item') item: { id: string; quantity: number, stockId: string }, @Res() res: Response) {
    const result: ResponseDto<Cart> = await this.cartService.addItem(userId, item);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string, @Res() res: Response) {
    const result: ResponseDto<Cart> = await this.cartService.findByUserId(userId);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body('items') items: Array<{ productId: string; quantity: number }>, @Res() res: Response) {
    const result: ResponseDto<Cart> = await this.cartService.update(userId, items);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }
}
