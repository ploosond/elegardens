import { adminApiClient } from '@/lib/axios';
import {
  AdditionalImagesResponseDto,
  CreateProductDto,
  ProductImagesResponseDto,
  ProductResponseDto,
  ProductsResponseDto,
  UpdateProductDto,
} from '@/types/dto';

// GET - List all products
export const fetchProducts = async (): Promise<ProductsResponseDto> => {
  try {
    const response = await adminApiClient.get('/products?limit=1000');
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch products',
      error?.response.data || error.message
    );
    throw error;
  }
};

// GET - Fetch single product
export const fetchProduct = async (
  productId: number
): Promise<ProductResponseDto> => {
  try {
    const response = await adminApiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to fetch product',
      error?.response.data || error.message
    );
    throw error;
  }
};

// GET - Fetch product images
export const fetchProductImages = async (
  productId: number
): Promise<ProductImagesResponseDto> => {
  try {
    const response = await adminApiClient.get(`/products/${productId}/images`);
    return response.data;
  } catch (error: any) {
    console.log(
      'Failed to fetch product images',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const createProduct = async (
  createProductDto: CreateProductDto
): Promise<ProductResponseDto> => {
  try {
    const response = await adminApiClient.post('/products', createProductDto);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to create product',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const uploadImagesForNewProduct = async (
  formData: FormData
): Promise<ProductImagesResponseDto> => {
  try {
    const response = await adminApiClient.post('/products/images', formData);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to upload images',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const updateProduct = async (
  productId: number,
  updateProductDto: UpdateProductDto
): Promise<ProductResponseDto> => {
  try {
    const response = await adminApiClient.put(
      `/products/${productId}`,
      updateProductDto
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update product',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const addImagesToExistingProduct = async (
  productId: number,
  formData: FormData
): Promise<AdditionalImagesResponseDto> => {
  try {
    const response = await adminApiClient.post(
      `/products/${productId}/images`,
      formData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to update images',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteProduct = async (
  productId: number
): Promise<ProductResponseDto> => {
  try {
    const response = await adminApiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete product',
      error?.response.data || error.message
    );
    throw error;
  }
};

export const deleteProductImage = async (
  productId: number,
  imageIndex: number
): Promise<ProductResponseDto> => {
  try {
    const response = await adminApiClient.delete(
      `/products/${productId}/images/${imageIndex}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Failed to delete product image',
      error?.response.data || error.message
    );
    throw error;
  }
};
