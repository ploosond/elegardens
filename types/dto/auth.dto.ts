export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RegisterRequestDto {
  username: string;
  password: string;
  email: string;
}

export interface AdminUserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AdminUserDto;
  };
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  data: {
    user: AdminUserDto;
  };
}
