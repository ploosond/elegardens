export interface ImageDto {
  url: string;
  public_id: string;
  altText: string;
}

export interface CommonNameDto {
  en: string;
  de: string;
}

export interface DescriptionDto {
  en: string;
  de: string;
}

export interface LightDto {
  en: 'sun' | 'half-shadow' | 'shadow';
  de: 'sonne' | 'halb-schatten' | 'schatten';
}

export interface ProductDto {
  id: number;
  common_name: CommonNameDto;
  description: DescriptionDto;
  height: string;
  diameter: string;
  hardiness: string;
  light: LightDto;
  images: ImageDto[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  common_name: CommonNameDto;
  description: DescriptionDto;
  height: string;
  diameter: string;
  hardiness: string;
  light: LightDto;
  images: ImageDto[];
  color: string;
}

export interface UpdateProductDto {
  common_name?: CommonNameDto;
  description?: DescriptionDto;
  height?: string;
  diameter?: string;
  hardiness?: string;
  light?: LightDto;
  images?: ImageDto[];
  color?: string;
}

export interface ProductResponseDto {
  success: boolean;
  message: string;
  data: {
    product: ProductDto;
  };
}

export interface ProductsResponseDto {
  success: boolean;
  message: string;
  data: {
    products: ProductDto[];
    pagination: {
      currentPage: number;
      totalProducts: number;
      productsPerPage: number;
      totalPages: number;
    };
  };
}

export interface ProductImagesResponseDto {
  success: boolean;
  message: string;
  data: {
    images: ImageDto[];
    totalImages: number;
  };
}

export interface AdditionalImagesResponseDto {
  success: boolean;
  message: string;
  data: {
    product: ProductDto;
    newImages: ImageDto[];
    totalImages: number;
  };
}
