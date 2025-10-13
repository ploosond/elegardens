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
    const productId = parseInt(params.productId, 10);

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

    const productId = parseInt(params.productId, 10);

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

    const existingImages = existingProduct.images as {
      url: string;
      altText: string;
    }[];
    if (result.data.images) {
      const newImages = result.data.images;
      const combinedImages = [...existingImages, ...newImages];

      if (combinedImages.length > 6) {
        return errorResponse(
          `Cannot add ${newImages.length} images. Product already has ${existingImages.length} images. Maximum 6 total allowed.`,
          400
        );
      }

      result.data.images = combinedImages;
    }

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

    const productId = parseInt(params.productId, 10);

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
