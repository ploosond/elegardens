import { adminApiClient } from '@/lib/axios';
import {
  CreateEmployeeDto,
  DeleteProfilePictureResponseDto,
  EmployeeResponseDto,
  EmployeesResponseDto,
  ProfilePictureResponseDto,
  UpdateEmployeeDto,
} from '@/types/dto/employee.dto';

export const fetchEmployees = async (): Promise<EmployeesResponseDto> => {
  try {
    const response = await adminApiClient.get('/employees');
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch employees',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const uploadProfilePictureForNewEmployee = async (
  formData: FormData
): Promise<ProfilePictureResponseDto> => {
  try {
    const response = await adminApiClient.post(
      '/employees/profile-picture',
      formData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to upload profile picture',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const createEmployee = async (
  createEmployeeDto: CreateEmployeeDto
): Promise<EmployeeResponseDto> => {
  try {
    const response = await adminApiClient.post('/employees', createEmployeeDto);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to create employee',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const updateEmployee = async (
  employeeId: number,
  updateEmployeeDto: UpdateEmployeeDto
): Promise<EmployeeResponseDto> => {
  try {
    const response = await adminApiClient.put(
      `/employees/${employeeId}`,
      updateEmployeeDto
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update employee',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const uploadProfilePictureForExistingEmployee = async (
  employeeId: number,
  formData: FormData
): Promise<ProfilePictureResponseDto> => {
  try {
    const response = await adminApiClient.post(
      `/employees/${employeeId}/profile-picture`,
      formData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update profile picture',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteProfilePictureForExistingEmployee = async (
  employeeId: number
): Promise<DeleteProfilePictureResponseDto> => {
  try {
    const response = await adminApiClient.delete(
      `/employees/${employeeId}/profile-picture`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete profile picture',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteEmployee = async (
  employeeId: number
): Promise<EmployeeResponseDto> => {
  try {
    const response = await adminApiClient.delete(`/employees/${employeeId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete employee',
      error?.response.data || error.message
    );
    throw error;
  }
};
