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

  // Create a new introduction
  async create(createIntroductionDto: CreateIntroductionDto): Promise<ResponseDto<Introduction>> {
    try {
      const createdIntroduction = new this.introductionModel(createIntroductionDto);
      await createdIntroduction.save();
      await this.redisService.clearCache('introductions_all');
      return {
        success: true,
        message: 'Introduction created successfully',
        data: createdIntroduction,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create introduction',
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
    try {
      const updatedIntroduction = await this.introductionModel
        .findById(id)
        .exec();
      const uploadedImages = await Promise.all(
        updatedIntroduction.images.map(async (image: any) => {
          if (!image.image.startsWith('https://res.cloudinary.com/')) {
            // Tách base64 phần cần thiết
            const base64Str = image.image.split(',')[1];
            const buffer = Buffer.from(base64Str, 'base64');
            const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
            return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
          }
          return image; // Nếu ảnh đã có trên Cloudinary, giữ nguyên
        })
      );

      // Lọc những ảnh hợp lệ (không phải null)
      const validUploads = uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];

      // Cập nhật sản phẩm với thông tin mới
      const updatedProduct = await this.introductionModel
        .findByIdAndUpdate(id, { ...updateIntroductionDto, images: validUploads }, { new: true })
        .exec();

      // Xóa cache cũ sau khi cập nhật
      await this.redisService.clearCache(cacheKey);
      await this.redisService.clearProductsPageCache()
      // Lưu lại sản phẩm mới vào cache
      await this.redisService.setCache(cacheKey, updatedProduct, this.CACHE_TTL);
      if (!updatedIntroduction) {
        return {
          success: false,
          message: 'Introduction not found',
          data: null,
        };
      }
      await this.redisService.clearCache('introductions_all');
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
    try {
      const deletedIntroduction = await this.introductionModel.findById(id);
      // Lọc ra các publicId hợp lệ hoặc lấy từ URL nếu cần
      const validImagePublicIds = deletedIntroduction.images.map(image => {
        return image.publicId || extractPublicId(image.image);
      });

      // Gọi deleteMedia cho từng publicId hợp lệ
      const deleteMediaPromises = validImagePublicIds.map(async publicId => {
        return this.cloudinaryService.deleteMedia(publicId, 'image');
      });

      // Chờ cho tất cả các promise được hoàn thành
      const deleteMediaResults = await Promise.all(deleteMediaPromises);

      // Kiểm tra xem tất cả các ảnh đã được xóa thành công
      const allDeleted = deleteMediaResults.every(result => result.success);
      if (!allDeleted) {
        throw new Error('Some media files failed to delete');
      }
      if (!deletedIntroduction) {
        return {
          success: false,
          message: 'Introduction not found',
          data: null,
        };
      }
      await this.introductionModel.findByIdAndDelete(id).exec();
      await this.redisService.clearCache('introductions_all');
      await this.redisService.clearCache(cacheKey);
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
  private async handleImageUpload(images: string[]): Promise<{ image: string; publicId: string }[]> {
    const uploadedImages = await Promise.all(
      images.map(async (base64: string) => {
        const base64Str = base64.split(',')[1];
        const buffer = Buffer.from(base64Str, 'base64');
        const uploadResult = await this.cloudinaryService.uploadMedia(buffer, 'APPLE_STORE', 'image');
        return uploadResult.success ? { image: uploadResult.data.url, publicId: uploadResult.data.publicId } : null;
      })
    );
    return uploadedImages.filter(upload => upload !== null) as { image: string; publicId: string }[];
  }
}
