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

    const body = await request.json();
    const result = updateEmployeeSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const updateData = result.data;
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        email: updateData.email,
        role: updateData.role,
        department: updateData.department,
        telephone: updateData.telephone,
        profilePicture: updateData.profilePicture,
      },
    });

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

    if (existingEmployee.profilePicture) {
      const profilePicture = existingEmployee.profilePicture as {
        public_id: string;
      };
      await deleteFromCloudinary(profilePicture.public_id);
    }

    const employee = await prisma.employee.delete({
      where: { id: employeeId },
    });

    return successResponse('Employee deleted successfully', { employee });
  } catch (error) {
    console.error('Delete employee error: ', error);
    return errorResponse('Failed to delete employee', 500);
  }
}
