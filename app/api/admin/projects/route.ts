import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { createProjectSchema } from '@/lib/schemas/projectSchema';
import adminToken from '@/lib/adminToken';

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const totalProjects = await prisma.project.count();
    const totalPages = Math.ceil(totalProjects / limit);

    const projects = await prisma.project.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        displayRank: 'asc',
      },
    });

    return successResponse('Projects fetched successfully', {
      projects,
      pagination: {
        currentPage: page,
        totalProjects,
        projectsPerPage: limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get projects error: ', error);
    return errorResponse('Failed to fetch projects');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = adminToken(request);

    if (authError) {
      return authError;
    }

    const body = await request.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const projectData = result.data;
    const project = await prisma.project.create({
      data: {
        client: projectData.client,
        title: projectData.title,
        category: projectData.category,
        tagline: projectData.tagline,
        image: projectData.image,
        sections: projectData.sections,
        displayRank: projectData.displayRank,
      },
    });

    return successResponse('Project created successfully', { project }, 201);
  } catch (error) {
    console.error('Create project error: ', error);
    return errorResponse('Failed to create project', 500);
  }
}

