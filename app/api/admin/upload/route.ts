import { errorResponse, successResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    console.log('Files received:', files);
    console.log('Files length:', files.length);
    console.log('Files type:', typeof files[0]);

    if (files.length === 0) {
      return errorResponse('At least one image is required', 400);
    }

    if (files.length > 3) {
      return errorResponse('Maximum 3 images allowed', 400);
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return errorResponse('Only image files are allowed', 400);
      }

      if (file.size > 4 * 1024 * 1024) {
        return errorResponse('Image size must be less than 4MB', 400);
      }
    }

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = (await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: 'products',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      })) as any;

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
        name: file.name,
        size: file.size,
      });
    }

    return successResponse('Images uploaded successfully', {
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Upload error: ', error);
    return errorResponse('Failed to upload images', 500);
  }
}
