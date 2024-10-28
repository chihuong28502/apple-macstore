import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadImageTemp(@UploadedFile() file: Express.Multer.File) { 
    return await this.cloudinaryService.uploadMedia(file.buffer, 'APPLE_STORE', 'image');
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadVideoTemp(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadMedia(file.buffer, 'APPLE_STORE', 'video');
  }
}
