import { Prisma } from '@/app/generated/prisma';
import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { employeeId: employeeIdParam } = await params;
    const employeeId = parseInt(employeeIdParam, 10);

    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      return errorResponse('Employee not found', 404);
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

    // Delete existing profile picture if it exists
    if (existingEmployee.profilePicture) {
      const existingPicture = existingEmployee.profilePicture as {
        public_id: string;
      };
      await deleteFromCloudinary(existingPicture.public_id);
    }

    // Upload new profile picture
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { employeeId: employeeIdParam } = await params;
    const employeeId = parseInt(employeeIdParam, 10);

    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      return errorResponse('Employee not found', 404);
    }

    if (!existingEmployee.profilePicture) {
      return errorResponse('No profile picture found', 400);
    }

    const profilePicture = existingEmployee.profilePicture as {
      public_id: string;
    };

    await deleteFromCloudinary(profilePicture.public_id);

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { profilePicture: Prisma.JsonNull },
    });

    return successResponse('Profile picture deleted successfully', {
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('Delete profile picture error: ', error);
    return errorResponse('Failed to delete profile picture', 500);
  }
}
