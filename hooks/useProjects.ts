import {
  createProject,
  deletePendingProjectImage,
  deleteProject,
  deleteProjectImage,
  fetchProject,
  fetchProjects,
  updateProject,
  updateProjectImage,
  uploadImageForNewProject,
} from '@/services/projectServices';
import { UpdateProjectDto } from '@/types/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchProjects = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => fetchProjects(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProject = (projectId: number) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUploadImageForNewProject = () => {
  return useMutation({
    mutationFn: uploadImageForNewProject,
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      updateProjectDto,
    }: {
      projectId: number;
      updateProjectDto: UpdateProjectDto;
    }) => updateProject(projectId, updateProjectDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProjectImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId: number;
      formData: FormData;
    }) => updateProjectImage(projectId, formData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeletePendingProjectImage = () => {
  return useMutation({
    mutationFn: (publicId: string) => deletePendingProjectImage(publicId),
  });
};

export const useDeleteProjectImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => deleteProjectImage(projectId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', variables],
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

