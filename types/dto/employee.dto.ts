export interface RoleDto {
  en: string;
  de: string;
}
export interface DepartmentDto {
  en: string;
  de: string;
}

export interface ProfilePictureDto {
  url: string;
  public_id: string;
  altText: string;
}

export interface EmployeeDto {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  role: RoleDto;
  department: DepartmentDto;
  telephone?: string;
  profilePicture?: ProfilePictureDto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  first_name: string;
  last_name: string;
  email?: string;
  role: RoleDto;
  department: DepartmentDto;
  telephone?: string;
  profilePicture?: ProfilePictureDto;
}

export interface UpdateEmployeeDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: RoleDto;
  department?: DepartmentDto;
  telephone?: string;
  profilePicture?: ProfilePictureDto;
}

export interface EmployeeResponseDto {
  success: boolean;
  message: string;
  data: {
    employee: EmployeeDto;
  };
}

export interface EmployeesResponseDto {
  success: boolean;
  message: string;
  data: {
    employees: EmployeeDto[];
  };
}

export interface ProfilePictureResponseDto {
  success: boolean;
  message: string;
  data: {
    profilePicture: ProfilePictureDto;
    oldProfilePicture?: ProfilePictureDto | null;
  };
}

export interface DeleteProfilePictureResponseDto {
  success: boolean;
  message: string;
}

export interface DeleteProfilePictureWithDataResponseDto {
  success: boolean;
  message: string;
  data: {
    employee: EmployeeDto;
  };
}
