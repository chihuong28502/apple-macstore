import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { UpdateIntroductionDto } from './dto/update-introduction.dto';
import { Introduction, IntroductionDocument } from './schema/introduction.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { extractPublicId } from 'src/utils/func/getPublicId';

@Injectable()
export class IntroductionService {
  private readonly CACHE_TTL = 86400;
  constructor(
    @InjectModel(Introduction.name) private readonly introductionModel: Model<IntroductionDocument>,
    private readonly redisService: RedisService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createIntroductionDto: CreateIntroductionDto): Promise<ResponseDto<Introduction>> {
    try {
      const cacheKey = 'introductions_by_user_all';

      let uploadedImage = null;

      // Kiểm tra và xử lý upload hình ảnh nếu có
      if (createIntroductionDto.images && !createIntroductionDto.images.image.startsWith('https://res.cloudinary.com/')) {
        uploadedImage = await this.handleImageUpload(createIntroductionDto.images.image);
        if (!uploadedImage) {
          throw new Error('Failed to upload image');
        }
      }

      // Tạo đối tượng Introduction mới
      const createdIntroduction = new this.introductionModel({
        ...createIntroductionDto,
        images: uploadedImage , // Sử dụng hình ảnh đã upload hoặc giữ nguyên
      });

      // Lưu vào cơ sở dữ liệu
      await createdIntroduction.save();

      // Xóa cache cũ
      await this.redisService.clearCache('introductions_all');
      await this.redisService.clearCache(cacheKey);

      return {
        success: true,
        message: 'Introduction created successfully',
        data: createdIntroduction,
      };
    } catch (error) {
      console.log("🚀 ~ IntroductionService ~ error:", error)
      return {
        success: false,
        message: 'Failed to create introduction',
        data: null,
      };
    }
  }

  async findAllByCustomer(): Promise<ResponseDto<Introduction[]>> {
    try {
      const cacheKey = 'introductions_by_user_all';
      const cachedIntroductions = await this.redisService.getCache<Introduction[]>(cacheKey);
      if (cachedIntroductions) {
        return {
          success: true,
          message: 'Introductions retrieved from cache',
          data: cachedIntroductions,
        };
      }
      const introductions = await this.introductionModel.find({
        isPublic: true,
      }).exec();
      await this.redisService.setCache<Introduction[]>(cacheKey, introductions, this.CACHE_TTL);
      return {
        success: true,
        message: 'Fetched introductions successfully',
        data: introductions,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch introductions',
        data: null,
      };
    }
  }
  // Get all introductions
  async findAll(): Promise<ResponseDto<Introduction[]>> {
    try {
      const cacheKey = 'introductions_all';
      const cachedIntroductions = await this.redisService.getCache<Introduction[]>(cacheKey);
      if (cachedIntroductions) {
        return {
          success: true,
          message: 'Introductions retrieved from cache',
          data: cachedIntroductions,
        };
      }
      const introductions = await this.introductionModel.find().exec();
      await this.redisService.setCache<Introduction[]>(cacheKey, introductions, this.CACHE_TTL);
      return {
        success: true,
        message: 'Fetched introductions successfully',
        data: introductions,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch introductions',
        data: null,
      };
    }
  }

  async findOne(id: string): Promise<ResponseDto<Introduction>> {
    const cacheKey = `introduction_${id}`;
    const cachedIntroductions = await this.redisService.getCache<Introduction[]>(cacheKey);
    if (cachedIntroductions) {
      return {
        success: true,
        message: 'Introductions retrieved from cache',
        data: cachedIntroductions,
      };
    }
    try {
      const introduction = await this.introductionModel.findById(id).exec();
      await this.redisService.setCache<Introduction>(cacheKey, introduction, this.CACHE_TTL);
      if (!introduction) {
        return {
          success: false,
          message: 'Introduction not found',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Fetched introduction successfully',
        data: introduction,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch introduction',
        data: null,
      };
    }
  }

  // Update an introduction
  async update(id: string, updateIntroductionDto: UpdateIntroductionDto): Promise<ResponseDto<Introduction>> {
    const cacheKey = `introduction_${id}`;
    const cacheKeyByUser = 'introductions_by_user_all';
    try {
      // Tìm tài liệu cần cập nhật
      const existingIntroduction = await this.introductionModel.findById(id).exec();

      if (!existingIntroduction) {
        return {
          success: false,
          message: 'Introduction not found',
          data: null,
        };
      }

      let updatedImage = existingIntroduction.images;

      // Kiểm tra và xử lý hình ảnh mới nếu có trong DTO
      if (updateIntroductionDto.images && !updateIntroductionDto.images.image.startsWith('https://res.cloudinary.com/')) {
        // Tách base64 phần cần thiết
        const base64Str = updateIntroductionDto.images.image.split(',')[1];
        const buffer = Buffer.from(base64Str, 'base64');
        const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');

        if (uploadResult.success) {
          updatedImage = { image: uploadResult.data.url, publicId: uploadResult.data.publicId };
        } else {
          throw new Error('Failed to upload new image');
        }
      }

      // Cập nhật tài liệu với dữ liệu mới
      const updatedIntroduction = await this.introductionModel
        .findByIdAndUpdate(
          id,
          { ...updateIntroductionDto, images: updatedImage },
          { new: true },
        )
        .exec();

      // Xóa cache cũ
      await this.redisService.clearCache(cacheKey);
      await this.redisService.clearCache(cacheKeyByUser);
      await this.redisService.clearCache('introductions_all');

      // Lưu cache mới
      await this.redisService.setCache(cacheKey, updatedIntroduction, this.CACHE_TTL);

      return {
        success: true,
        message: 'Introduction updated successfully',
        data: updatedIntroduction,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update introduction',
        data: null,
      };
    }
  }


  // Delete an introduction
  async remove(id: string): Promise<ResponseDto<null>> {
    const cacheKey = `introduction_${id}`;
    const cacheKeyByUser = 'introductions_by_user_all';
    try {
      const deletedIntroduction = await this.introductionModel.findById(id);

      if (!deletedIntroduction) {
        return {
          success: false,
          message: 'Introduction not found',
          data: null,
        };
      }

      // Lấy publicId hợp lệ hoặc trích xuất từ URL nếu cần
      // const validImagePublicId = deletedIntroduction.images.publicId || extractPublicId(deletedIntroduction.images.image);

      // Xóa media nếu có validImagePublicId
      // if (validImagePublicId) {
      //   const deleteMediaResult = await this.cloudinaryService.deleteMedia(validImagePublicId, 'image');
      //   if (!deleteMediaResult.success) {
      //     throw new Error('Failed to delete media file');
      //   }
      // }

      await this.introductionModel.findByIdAndDelete(id).exec();

      // Xóa cache liên quan
      await this.redisService.clearCache('introductions_all');
      await this.redisService.clearCache(cacheKey);
      await this.redisService.clearCache(cacheKeyByUser);

      return {
        success: true,
        message: 'Introduction deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete introduction',
        data: null,
      };
    }
  }

  private async handleImageUpload(base64: string): Promise<{ image: string; publicId: string } | null> {
    const base64Str = base64.split(',')[1];
    const buffer = Buffer.from(base64Str, 'base64');
    const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
    return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
  }
}
