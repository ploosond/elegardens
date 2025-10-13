import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; imageIndex: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const productId = parseInt(params.productId, 10);
    const imageIndex = parseInt(params.imageIndex, 10);

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    const existingImages = existingProduct.images as {
      url: string;
      altText: string;
    }[];

    if (imageIndex < 0 || imageIndex >= existingImages.length) {
      return errorResponse(
        `Invalid image index. Product has ${
          existingImages.length
        } images (indices 0-${existingImages.length - 1})`,
        400
      );
    }

    const updatedImages = existingImages.filter(
      (_, index) => index !== imageIndex
    );

    if (updatedImages.length === 0) {
      return errorResponse(
        'Cannot delete all images. Product must have at least one image.',
        400
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: updatedImages,
      },
    });

    return successResponse('Image deleted successfully', {
      product: updatedProduct,
      deletedImage: existingImages[imageIndex],
      remainingImages: updatedImages,
    });
  } catch (error) {
    console.error('Delete image error: ', error);
    return errorResponse('Failed to delete image', 500);
  }
}
