import adminToken from '@/lib/adminToken';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { deleteFromCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { updateEmployeeSchema } from '@/lib/schemas/employeeSchema';
import { NextRequest } from 'next/server';

export async function GET(
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

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return errorResponse('Employee not found', 404);
    }

    return successResponse('Employee fetched successfully', { employee });
  } catch (error) {
    console.error('Get employee error: ', error);
    return errorResponse('Failed to fetch employee', 500);
  }
}

export async function PUT(
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

    const body = await request.json();
    const result = updateEmployeeSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const updateData = result.data;
    const oldProfilePicture = existingEmployee.profilePicture
      ? (existingEmployee.profilePicture as {
          url: string;
          public_id: string;
          altText: string;
        })
      : null;
    const newProfilePicture = updateData.profilePicture;

    const shouldDeleteOldProfilePicture =
      oldProfilePicture &&
      newProfilePicture &&
      oldProfilePicture.public_id !== newProfilePicture.public_id;

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
    });

    if (shouldDeleteOldProfilePicture && oldProfilePicture) {
      try {
        await deleteFromCloudinary(oldProfilePicture.public_id);
      } catch (error) {
        console.error('Failed to delete old profile picture: ', error);
      }
    }

    return successResponse('Employee updated successfully', { employee });
  } catch (error) {
    console.error('Update employee error: ', error);
    return errorResponse('Failed to update employee', 500);
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

    const profilePicture = existingEmployee.profilePicture
      ? (existingEmployee.profilePicture as {
          public_id: string;
        })
      : null;

    const employee = await prisma.employee.delete({
      where: { id: employeeId },
    });

    if (profilePicture) {
      try {
        await deleteFromCloudinary(profilePicture.public_id);
      } catch (error) {
        console.error(
          'Failed to delete profile picture from Cloudinary:',
          error
        );
      }
    }

    return successResponse('Employee deleted successfully', { employee });
  } catch (error) {
    console.error('Delete employee error: ', error);
    return errorResponse('Failed to delete employee', 500);
  }
}
