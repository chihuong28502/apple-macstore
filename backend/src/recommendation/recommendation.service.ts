import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recommendation, RecommendationDocument } from './schema/recommendation.schema';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';

@Injectable()
export class RecommendationService {
  constructor(@InjectModel(Recommendation.name) private recommendationModel: Model<RecommendationDocument>) {}

  async create(createRecommendationDto: CreateRecommendationDto): Promise<Recommendation> {
    const createdRecommendation = new this.recommendationModel(createRecommendationDto);
    return createdRecommendation.save();
  }

  async findAll(): Promise<Recommendation[]> {
    return this.recommendationModel.find().exec();
  }

  async findOne(id: string): Promise<Recommendation> {
    const recommendation = await this.recommendationModel.findById(id).exec();
    if (!recommendation) {
      throw new NotFoundException(`Recommendation with ID "${id}" not found`);
    }
    return recommendation;
  }

  async update(id: string, updateRecommendationDto: UpdateRecommendationDto): Promise<Recommendation> {
    const updatedRecommendation = await this.recommendationModel.findByIdAndUpdate(id, updateRecommendationDto, { new: true }).exec();
    if (!updatedRecommendation) {
      throw new NotFoundException(`Recommendation with ID "${id}" not found`);
    }
    return updatedRecommendation;
  }

  async remove(id: string): Promise<Recommendation> {
    const deletedRecommendation = await this.recommendationModel.findByIdAndDelete(id).exec();
    if (!deletedRecommendation) {
      throw new NotFoundException(`Recommendation with ID "${id}" not found`);
    }
    return deletedRecommendation;
  }
}
