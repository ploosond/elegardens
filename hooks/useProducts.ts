import {
  addImagesToExistingProduct,
  createProduct,
  deletePendingProductImage,
  deleteProduct,
  deleteProductImage,
  fetchProduct,
  fetchProducts,
  updateProduct,
  uploadImagesForNewProduct,
} from '@/services/productServices';
import { UpdateProductDto } from '@/types/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchProducts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => fetchProducts(page, limit),
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

export const useDeletePendingProductImage = () => {
  return useMutation({
    mutationFn: (publicId: string) => deletePendingProductImage(publicId),
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
