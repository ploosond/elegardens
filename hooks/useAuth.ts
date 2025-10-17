import { adminLogin, adminRegister } from '@/services/authServices';
import { useMutation } from '@tanstack/react-query';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useAdminRegister = () => {
  return useMutation({
    mutationFn: adminRegister,
  });
};
