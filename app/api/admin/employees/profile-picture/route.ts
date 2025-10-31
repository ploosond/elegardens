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
    const file = formData.get('profilePicture') as File;

    if (!file) {
      return errorResponse('No profile picture provided', 400);
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('Invalid file type. Only images are allowed', 400);
    }

    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File is too large. Maximum size is 10MB', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudinaryResult = await uploadToCloudinary(buffer, 'employees');

    const profilePicture = {
      url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      altText: file.name.replace(/\.[^/.]+$/, ''),
    };

    return successResponse('Profile picture uploaded successfully', {
      profilePicture,
    });
  } catch (error) {
    console.error('Upload profile picture error: ', error);
    return errorResponse('Failed to upload profile picture', 500);
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

    return successResponse('Profile picture deleted successfully');
  } catch (error) {
    console.error('Delete profile picture error: ', error);
    return errorResponse('Failed to delete profile picture', 500);
  }
}
