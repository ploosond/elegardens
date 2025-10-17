import adminToken from '@/lib/adminToken';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';
import prisma from '@/lib/prisma';
import { updateProductSchema } from '@/lib/schemas/productSchema';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId: productIdParam } = await params;
    const productId = parseInt(productIdParam, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse('Product fetched successfully', { product });
  } catch (error) {
    console.error('Get product error: ', error);
    return errorResponse('Failed to fetch product', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { productId: productIdParam } = await params;
    const productId = parseInt(productIdParam, 10);

    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    // Don't handle images in PUT - they are managed separately via add/delete endpoints
    // Remove images from update data to avoid conflicts
    delete result.data.images;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: result.data,
    });

    return successResponse('Product updated successfully', {
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error: ', error);
    return errorResponse('Failed to update product', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }
    const { productId: productIdParam } = await params;
    const productId = parseInt(productIdParam, 10);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    return successResponse('Product deleted successfully', {
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Delete product error: ', error);
    return errorResponse('Failed to delete product', 500);
  }
}
