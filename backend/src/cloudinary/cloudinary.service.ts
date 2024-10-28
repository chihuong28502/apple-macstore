import cloudinary from '../../cloudinary.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadMedia(
    fileBuffer: Buffer,
    folder: string,
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  ) {
    try {
      if (!Buffer.isBuffer(fileBuffer)) {
        throw new Error('Invalid file buffer');
      }

      const stream = streamifier.createReadStream(fileBuffer);
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: folder,
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        stream.pipe(uploadStream);
      });
      console.log("result", result);

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType,
        },
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      return {
        success: false,
        data: error.message || 'An error occurred during upload.',
      };
    }
  }

  async deleteMedia(publicId: string, resourceType: 'auto' | 'image' | 'video' | 'raw') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return { success: result.result === 'ok' }; // Kiểm tra xem kết quả có phải là 'ok' không
    } catch (error) {
      console.error(`Error deleting media: ${error.message}`); // Thêm câu lệnh log lỗi
      return {
        success: false,
        message: error.message,
      };
    }
  }


  async getMedia(folder: string, resourceType: 'auto' | 'image' | 'video' | 'raw', maxResults: number = 500) {
    try {
      const resources = await cloudinary.api.resources({
        type: "upload",
        prefix: folder,
        resource_type: resourceType,
        max_results: maxResults,
      });
      return { success: true, resources: resources.resources };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

}
