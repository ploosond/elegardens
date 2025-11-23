import { adminApiClient } from '@/lib/axios';
import {
  CreateProjectDto,
  ProjectImagesResponseDto,
  ProjectResponseDto,
  ProjectsResponseDto,
  UpdateProjectDto,
} from '@/types/dto';

export const fetchProjects = async (
  page: number = 1,
  limit: number = 10
): Promise<ProjectsResponseDto> => {
  try {
    const response = await adminApiClient.get(
      `/projects?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch projects',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const fetchProject = async (
  projectId: number
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch project',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const createProject = async (
  createProjectDto: CreateProjectDto
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.post('/projects', createProjectDto);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to create project',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const uploadImageForNewProject = async (
  formData: FormData
): Promise<ProjectImagesResponseDto> => {
  try {
    const response = await adminApiClient.post('/projects/images', formData);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to upload image',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deletePendingProjectImage = async (
  publicId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await adminApiClient.delete('/projects/images', {
      data: { public_id: publicId },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete pending image',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  updateProjectDto: UpdateProjectDto
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.put(
      `/projects/${projectId}`,
      updateProjectDto
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update project',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const updateProjectImage = async (
  projectId: number,
  formData: FormData
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.post(
      `/projects/${projectId}/image`,
      formData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update project image',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteProjectImage = async (
  projectId: number
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.delete(`/projects/${projectId}/image`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete project image',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteProject = async (
  projectId: number
): Promise<ProjectResponseDto> => {
  try {
    const response = await adminApiClient.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete project',
      error?.response.data || error.message
    );
    throw error;
  }
};
