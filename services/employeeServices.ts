import { adminApiClient } from '@/lib/axios';
import {
  CreateEmployeeDto,
  DeleteProfilePictureResponseDto,
  DeleteProfilePictureWithDataResponseDto,
  EmployeeResponseDto,
  EmployeesResponseDto,
  ProfilePictureResponseDto,
  UpdateEmployeeDto,
} from '@/types/dto/employee.dto';

// Fetch all employees
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

// Fetch single employee by ID
export const fetchEmployee = async (
  employeeId: number
): Promise<EmployeeResponseDto> => {
  try {
    const response = await adminApiClient.get(`/employees/${employeeId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch employee',
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

export const deletePendingProfilePicture = async (
  publicId: string
): Promise<DeleteProfilePictureResponseDto> => {
  try {
    const response = await adminApiClient.delete('/employees/profile-picture', {
      data: { public_id: publicId },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete pending profile picture',
      error?.response.data || error.message
    );
    throw error;
  }
};

// Create new employee (step 2: after uploading profile picture in step 1)
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

// Update employee (step 2: after uploading new profile picture in step 1)
// API automatically deletes old profile picture if replaced
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

export const deleteProfilePictureForExistingEmployee = async (
  employeeId: number
): Promise<DeleteProfilePictureWithDataResponseDto> => {
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

// Delete employee permanently (API handles profile picture cleanup)
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
