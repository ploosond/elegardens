import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { deleteFromCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const authError = adminToken(request);
    if (authError) {
      return authError;
    }

    const { productId: productIdParam, imageId: imageIdParam } = await params;
    const productId = parseInt(productIdParam, 10);
    const imageId = parseInt(imageIdParam, 10);

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
      public_id: string;
      altText: string;
    }[];

    if (imageId < 0 || imageId >= existingImages.length) {
      return errorResponse(
        `Invalid image index. Product has ${
          existingImages.length
        } images (indices 0-${existingImages.length - 1})`,
        400
      );
    }

    await deleteFromCloudinary(existingImages[imageId].public_id);

    const updatedImages = existingImages.filter(
      (_, index) => index !== imageId
    );

    // Allow deleting all images - frontend validation will handle the business rule

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
      deletedImage: existingImages[imageId],
      remainingImages: updatedImages,
    });
  } catch (error) {
    console.error('Delete image error: ', error);
    return errorResponse('Failed to delete image', 500);
  }
}
