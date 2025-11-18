import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { deleteFromCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; imageId: string }> }
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

    const imageToDelete = existingImages[imageId];
    const updatedImages = existingImages.filter(
      (_, index) => index !== imageId
    );

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: updatedImages,
      },
    });

    try {
      await deleteFromCloudinary(imageToDelete.public_id);
    } catch (error) {
      console.error(
        `Failed to delete image from Cloudinary (public_id: ${imageToDelete.public_id}), but DB updated:`,
        error
      );
    }

    return successResponse('Image deleted successfully', {
      product: updatedProduct,
      deletedImage: imageToDelete,
      remainingImages: updatedImages,
    });
  } catch (error) {
    console.error('Delete image error: ', error);
    return errorResponse('Failed to delete image', 500);
  }
}
