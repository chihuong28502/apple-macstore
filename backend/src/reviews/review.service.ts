import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/order/schema/order.schema';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { RedisService } from 'src/redis/redis.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateReviewDto } from './dto/create-reviews.dto';
import { UpdateReviewDto } from './dto/update-reviews.dto';
import { ReviewsGateway } from './reviews.gateway';
import { Review, ReviewDocument } from './schema/review.schema';

interface ResponseDto<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export class ReviewsService {
  private readonly CACHE_TTL = 3600; // Thời gian sống của cache (1 giờ)

  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly redisService: RedisService,
    private readonly reviewsGateway: ReviewsGateway,
  ) { }

  async createReview(createReviewDto: CreateReviewDto): Promise<ResponseDto<Review>> {
    try {
      const newReview = new this.reviewModel({
        ...createReviewDto,
        product_id: new Types.ObjectId(createReviewDto.product_id),
        user_id: new Types.ObjectId(createReviewDto.user_id)
      });
      console.log("🚀 ~ ReviewsService ~ newReview:", newReview)
      const savedReview = await newReview.save();

      // Gửi đánh giá mới đến tất cả client
      this.reviewsGateway.sendReview(savedReview);

      // Xóa cache liên quan
      await this.redisService.clearAllCacheReviews();
      // await this.redisService.clearCache('reviews_all');
      // await this.redisService.clearCache(`reviews_user_${createReviewDto.user_id}`);
      // await this.redisService.clearCache(`reviews_product_${createReviewDto.product_id}`);

      return {
        success: true,
        message: 'Review created successfully',
        data: savedReview,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create review: ' + error.message,
        data: null,
      };
    }
  }

  async findAll(): Promise<ResponseDto<Review[]>> {
    const cacheKey = 'reviews_all';

    // Kiểm tra cache trước
    const cachedReviews = await this.redisService.getCache<Review[]>(cacheKey);
    if (cachedReviews) {
      return {
        success: true,
        message: 'Reviews retrieved from cache',
        data: cachedReviews,
      };
    }

    try {
      const reviews = await this.reviewModel.find().lean().exec();

      // Lưu vào cache
      await this.redisService.setCache(cacheKey, reviews, this.CACHE_TTL);

      return {
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve reviews: ' + error.message,
        data: null,
      };
    }
  }

  async findReviewById(id: string): Promise<ResponseDto<Review>> {
    const cacheKey = `review_${id}`;

    // Kiểm tra cache trước
    const cachedReview = await this.redisService.getCache<Review>(cacheKey);
    if (cachedReview) {
      return {
        success: true,
        message: 'Review retrieved from cache',
        data: cachedReview,
      };
    }

    try {
      const review = await this.reviewModel.findById(id).lean().exec();

      if (review) {
        // Lưu vào cache
        await this.redisService.setCache(cacheKey, review, this.CACHE_TTL);

        return {
          success: true,
          message: 'Review retrieved successfully',
          data: review,
        };
      } else {
        return {
          success: false,
          message: 'Review not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve review: ' + error.message,
        data: null,
      };
    }
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<ResponseDto<Review>> {
    try {
      const updatedReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).lean().exec();

      if (updatedReview) {
        // Xóa cache liên quan
        await this.redisService.clearAllCacheReviews()

        await this.redisService.clearCache(`review_${id}`);
        // await this.redisService.clearCache('reviews_all');
        // await this.redisService.clearCache(`reviews_user_${updateReviewDto.user_id}`);
        // await this.redisService.clearCache(`reviews_product_${updateReviewDto.product_id}`);

        return {
          success: true,
          message: 'Review updated successfully',
          data: updatedReview,
        };
      } else {
        return {
          success: false,
          message: 'Review not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update review: ' + error.message,
        data: null,
      };
    }
  }

  async deleteReview(id: string): Promise<ResponseDto<Review>> {
    try {
      const deletedReview = await this.reviewModel.findByIdAndDelete(id).lean().exec();

      if (deletedReview) {
        // Xóa cache liên quan

        await this.redisService.clearAllCacheReviews()
        await this.redisService.clearCache(`review_${id}`);
        // await this.redisService.clearCache('reviews_all');
        // await this.redisService.clearCache(`reviews_user_${deletedReview.user_id}`);
        // await this.redisService.clearCache(`reviews_product_${deletedReview.product_id}`);

        return {
          success: true,
          message: 'Review deleted successfully',
          data: deletedReview,
        };
      } else {
        return {
          success: false,
          message: 'Review not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete review: ' + error.message,
        data: null,
      };
    }
  }

  async getReviewsByProduct(productId: string): Promise<ResponseDto<Review[]>> {
    const cacheKey = `reviews_product_${productId}`;
    // Kiểm tra cache trước
    const cachedReviews = await this.redisService.getCache<Review[]>(cacheKey);
    if (cachedReviews) {
      return {
        success: true,
        message: 'Product reviews retrieved from cache',
        data: cachedReviews,
      };
    }
    try {
      const reviews = await this.reviewModel.find({ product_id: new Types.ObjectId(productId) }).lean().exec();
      await this.redisService.setCache(cacheKey, reviews, this.CACHE_TTL);
      return {
        success: true,
        message: 'Get Product reviews By Product successfully',
        data: reviews,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve product reviews: ' + error.message,
        data: null,
      };
    }
  }
}