import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateReviewDto } from './dto/create-reviews.dto';
import { UpdateReviewDto } from './dto/update-reviews.dto';
import { ReviewsService } from './review.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post('create')
  async create(@Res() res: Response, @Body() createReviewDto: CreateReviewDto) {
    const result = await this.reviewsService.createReview(createReviewDto);
    const statusCode = result.success ? 201 : 500;
    return res.status(statusCode).json(result);
  }

  @Get('getById/:id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.reviewsService.findReviewById(id);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Patch('update/:id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    const result = await this.reviewsService.updateReview(id, updateReviewDto);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Delete('delete/:id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const result = await this.reviewsService.deleteReview(id);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Get(':productId')
  async getReviewsByProduct(@Res() res: Response, @Param('productId') productId: string) {
    const result = await this.reviewsService.getReviewsByProduct(productId);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }
}