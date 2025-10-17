import { adminApiClient } from '@/lib/axios';
import { LoginRequestDto, LoginResponseDto } from '@/types/dto';

export const adminLogin = async (
  loginRequestDto: LoginRequestDto
): Promise<LoginResponseDto> => {
  try {
    const response = await adminApiClient.post('/auth/login', loginRequestDto);
    return response.data;
  } catch (error) {
    console.error('Failed to login', error);
    throw error;
  }
};

export const adminRegister = async (registerData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await adminApiClient.post('/auth/register', registerData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to register', error?.response.data || error.message);
    throw error;
  }
};
