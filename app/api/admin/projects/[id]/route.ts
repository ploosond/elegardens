import adminToken from '@/lib/adminToken';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import prisma from '@/lib/prisma';
import { updateProjectSchema } from '@/lib/schemas/projectSchema';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const projectId = parseInt(idParam, 10);

    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse('Project fetched successfully', { project });
  } catch (error) {
    console.error('Get project error: ', error);
    return errorResponse('Failed to fetch project', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { id: idParam } = await params;
    const projectId = parseInt(idParam, 10);

    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400);
    }

    const body = await request.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return errorResponse('Project not found', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: result.data,
    });

    return successResponse('Project updated successfully', {
      project: updatedProject,
    });
  } catch (error) {
    console.error('Update project error: ', error);
    return errorResponse('Failed to update project', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { id: idParam } = await params;
    const projectId = parseInt(idParam, 10);

    if (isNaN(projectId)) {
      return errorResponse('Invalid project ID', 400);
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return errorResponse('Project not found', 404);
    }

    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
    });

    return successResponse('Project deleted successfully', {
      project: deletedProject,
    });
  } catch (error) {
    console.error('Delete project error: ', error);
    return errorResponse('Failed to delete project', 500);
  }
}

