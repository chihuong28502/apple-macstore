import cloudinary from '../../cloudinary.config';
import { Injectable } from '@nestjs/common';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadMedia(fileBuffer: Buffer, folder: string, resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto') {
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
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        stream.pipe(uploadStream);
      });

      return {
        success: true,
        data: {
          url: result.secure_url,
          resourceType,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null
      }
    }
  }

  async deleteMedia(publicId: string, resourceType: 'auto' | 'image' | 'video' | 'raw') {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return { success: true };
    } catch (error) {
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
