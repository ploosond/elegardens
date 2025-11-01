import adminToken from '@/lib/adminToken';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import prisma from '@/lib/prisma';
import { createEmployeeSchema } from '@/lib/schemas/employeeSchema';
import { NextRequest } from 'next/server';

// GET /api/admin/employees - Fetch all employees
export async function GET(request: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return successResponse('Employees fetched successfully', { employees });
  } catch (error) {
    console.error('Get employees error: ', error);
    return errorResponse('Failed to fetch employees');
  }
}

// POST /api/admin/employees - Create new employee (step 2 of 2-step process)
// Step 1: Upload profile picture via POST /employees/profile-picture
// Step 2: Create employee with profilePicture data
export async function POST(request: NextRequest) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const result = createEmployeeSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const employeeData = result.data;
    const employee = await prisma.employee.create({
      data: {
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        role: employeeData.role,
        department: employeeData.department,
        telephone: employeeData.telephone,
        profilePicture: employeeData.profilePicture,
      },
    });

    return successResponse('Employee created successfully', { employee }, 201);
  } catch (error) {
    console.error('Create employee error: ', error);
    return errorResponse('Failed to create employee', 500);
  }
}
