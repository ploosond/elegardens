// Common Apis Response
export interface ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination Dto
export interface PaginationDto {
  currentPage: number;
  totalProducts: number;
  productsPerPage: number;
  totalPages: number;
}

// Error Apis Response
export interface ErrorDto {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}
