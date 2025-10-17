import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { deleteFromCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return errorResponse('public_id is required', 400);
    }

    await deleteFromCloudinary(public_id);

    return successResponse('Image deleted successfully');
  } catch (error) {
    console.error('Delete image error: ', error);
    return errorResponse('Failed to delete image', 500);
  }
}
