import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import { createProductSchema } from '@/lib/schemas/productSchema';
import adminToken from '@/lib/adminToken';

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await prisma.product.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return successResponse('Products fetched successfully', {
      products,
      pagination: {
        currentPage: page,
        totalProducts,
        productsPerPage: limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get products error: ', error);
    return errorResponse('Failed to fetch products');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = adminToken(request);

    if (authError) {
      return authError;
    }

    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

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
