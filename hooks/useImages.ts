import { deleteImageByPublicId } from '@/services/imageServices';
import { useMutation } from '@tanstack/react-query';

export const useDeleteImageByPublicId = () => {
  return useMutation({
    mutationFn: (publicId: string) => deleteImageByPublicId(publicId),
  });
};
