import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

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

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    const existingImages = existingProduct.images as {
      url: string;
      altText: string;
    }[];

    const totalAfterUpload = existingImages.length + files.length;

    if (totalAfterUpload > 6) {
      return errorResponse(
        `Cannot upload ${files.length} images. Product already has ${existingImages.length} images. Maximum 6 total allowed.`,
        400
      );
    }

    if (!files || files.length === 0) {
      return errorResponse('No images provided', 400);
    }

    if (files.length > 6) {
      return errorResponse('Maximum 6 images are allowed', 400);
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return errorResponse(
          `Invalid file type: ${file.type}. Only images are allowed`,
          400
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return errorResponse(
          `File ${file.name} is too large. Maximum size is 10MB`,
          400
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cloudinaryResult = await uploadToCloudinary(buffer, 'products');

      uploadedImages.push({
        url: cloudinaryResult.secure_url,
        altText: file.name.replace(/\.[^/.]+$/, ''),
      });
    }

    return successResponse('Images uploaded successfully', {
      images: uploadedImages,
      totalImages: uploadedImages.length,
    });
  } catch (error) {
    console.error('Upload images error: ', error);
    return errorResponse('Failed to upload images', 500);
  }
}
