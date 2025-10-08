import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import {
  createProductSchema,
  updateProductSchema,
} from '@/lib/schemas/productSchema';

export async function GET(request: NextRequest) {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return successResponse('Products fetched successfully', products);
  } catch (error) {
    console.error('Get products error: ', error);
    return errorResponse('Failed to fetch products');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }
    // Create a product
    const productData = result.data;
    const product = await prisma.product.create({
      data: {
        common_name: productData.common_name,
        description: productData.description,
        images: productData.images,
        height: productData.height,
        diameter: productData.diameter,
        hardiness: productData.hardiness,
        light: productData.light,
        color: productData.color,
      },
    });

    return successResponse('Product created successfully', { product }, 201);
  } catch (error) {
    console.error('Create product error: ', error);
    return errorResponse('Failed to create product', 500);
  }
}
