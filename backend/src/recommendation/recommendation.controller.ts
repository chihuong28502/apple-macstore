import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Recommendation } from './schema/recommendation.schema';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async create(@Body() createRecommendationDto: CreateRecommendationDto): Promise<Recommendation> {
    return this.recommendationService.create(createRecommendationDto);
  }

  @Get()
  async findAll(): Promise<Recommendation[]> {
    return this.recommendationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recommendation> {
    return this.recommendationService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto): Promise<Recommendation> {
    return this.recommendationService.update(id, updateRecommendationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Recommendation> {
    return this.recommendationService.remove(id);
  }
}
