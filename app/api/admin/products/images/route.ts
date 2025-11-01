import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '@/lib/cloudinary/cloudinaryUpload';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return errorResponse('No images provided', 400);
    }
    if (files.length > 6) {
      return errorResponse('Maximum 6 images are allowed', 400);
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return errorResponse(
          `Invalid file type: ${file.type}. Only images are allowed`,
          400
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return errorResponse(
          `File ${file.name} is too large. Maximum size is 10MB`,
          400
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cloudinaryResult = await uploadToCloudinary(buffer, 'products');

      uploadedImages.push({
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        altText: file.name.replace(/\.[^/.]+$/, ''),
      });
    }

    return successResponse('Images uploaded successfully', {
      images: uploadedImages,
      totalImages: uploadedImages.length,
    });
  } catch (error) {
    console.error('Upload images error: ', error);
    return errorResponse('Failed to upload images', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return errorResponse('The public_id is required', 400);
    }

    await deleteFromCloudinary(public_id);

    return successResponse('Image deleted successfully');
  } catch (error) {
    console.error('Delete image error: ', error);
    return errorResponse('Failed to delete image', 500);
  }
}
