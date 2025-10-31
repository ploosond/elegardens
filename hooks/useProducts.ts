import {
  addImagesToExistingProduct,
  createProduct,
  deleteProduct,
  deleteProductImage,
  fetchProduct,
  fetchProductImages,
  fetchProducts,
  updateProduct,
  uploadImagesForNewProduct,
} from '@/services/productServices';
import { deleteImageByPublicId } from '@/services/imageServices';
import { UpdateProductDto } from '@/types/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProduct = (productId: number) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });
};

export const useFetchProductImages = (productId: number) => {
  return useQuery({
    queryKey: ['products', productId, 'images'],
    queryFn: () => fetchProductImages(productId),
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadImageForNewProduct = () => {
  return useMutation({
    mutationFn: uploadImagesForNewProduct,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      updateProductDto,
    }: {
      productId: number;
      updateProductDto: UpdateProductDto;
    }) => updateProduct(productId, updateProductDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useAddImagesToExistingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      formData,
    }: {
      productId: number;
      formData: FormData;
    }) => addImagesToExistingProduct(productId, formData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['products', variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImageByPublicId,
    onSuccess: () => {
      // Invalidate products queries to reflect any changes
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageIndex,
    }: {
      productId: number;
      imageIndex: number;
    }) => deleteProductImage(productId, imageIndex),
    onSuccess: (data, variables) => {
      // Invalidate specific product and all products
      queryClient.invalidateQueries({
        queryKey: ['products', variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
