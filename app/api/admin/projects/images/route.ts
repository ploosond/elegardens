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
    const file = formData.get('image') as File;

    if (!file) {
      return errorResponse('No image provided', 400);
    }

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

    const cloudinaryResult = await uploadToCloudinary(buffer, 'projects');

    return successResponse('Image uploaded successfully', {
      image: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        altText: file.name.replace(/\.[^/.]+$/, ''),
      },
    });
  } catch (error) {
    console.error('Upload image error: ', error);
    return errorResponse('Failed to upload image', 500);
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

