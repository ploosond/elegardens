import {
  createEmployee,
  deleteEmployee,
  deleteProfilePicture,
  fetchEmployees,
  updateEmployee,
  uploadProfilePictureForExistingEmployee,
  uploadProfilePictureForNewEmployee,
} from '@/services/employeeServices';
import { UpdateEmployeeDto } from '@/types/dto/employee.dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadProfilePictureForNewEmployee = () => {
  return useMutation({
    mutationFn: uploadProfilePictureForNewEmployee,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUploadProfilePictureForExistingEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: FormData;
    }) => uploadProfilePictureForExistingEmployee(employeeId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      updateEmployeeDto,
    }: {
      employeeId: number;
      updateEmployeeDto: UpdateEmployeeDto;
    }) => updateEmployee(employeeId, updateEmployeeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => deleteProfilePicture(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
