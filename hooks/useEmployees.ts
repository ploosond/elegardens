import {
  createEmployee,
  deleteEmployee,
  deletePendingProfilePicture,
  deleteProfilePictureForExistingEmployee,
  fetchEmployee,
  fetchEmployees,
  updateEmployee,
  uploadProfilePictureForExistingEmployee,
  uploadProfilePictureForNewEmployee,
} from '@/services/employeeServices';
import { UpdateEmployeeDto } from '@/types/dto/employee.dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook to fetch all employees
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

export const useDeletePendingProfilePicture = () => {
  return useMutation({
    mutationFn: (publicId: string) => deletePendingProfilePicture(publicId),
  });
};

// Hook to create employee (invalidates employees list on success)
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// Hook to fetch single employee by ID
export const useFetchEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: ['employees', employeeId],
    queryFn: () => fetchEmployee(employeeId),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadProfilePictureForExistingEmployee = () => {
  return useMutation({
    mutationFn: ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: FormData;
    }) => uploadProfilePictureForExistingEmployee(employeeId, formData),
  });
};

// Hook to update employee (invalidates both list and specific employee on success)
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({
        queryKey: ['employees', variables.employeeId],
      });
    },
  });
};

export const useDeleteProfilePictureForExistingEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) =>
      deleteProfilePictureForExistingEmployee(employeeId),
    onSuccess: (data, employeeId) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', employeeId] });
    },
  });
};

// Hook to delete employee (invalidates employees list on success)
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
