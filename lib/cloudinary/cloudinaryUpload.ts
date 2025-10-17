import { UploadApiResponse } from 'cloudinary';
import cloudinaryConfig from './cloudinaryConfig';

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinaryConfig.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinaryConfig.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}
