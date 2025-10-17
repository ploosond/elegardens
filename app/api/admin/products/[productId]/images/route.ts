import adminToken from '@/lib/adminToken';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinaryUpload';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId: productIdParam } = await params;
    const productId = parseInt(productIdParam, 10);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        images: true,
      },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    const images = product.images as {
      url: string;
      public_id: string;
      altText: string;
    }[];

    return successResponse('Product images fetched successfully', {
      images,
      totalImages: images.length,
    });
  } catch (error) {
    console.error('Get product images error: ', error);
    return errorResponse('Failed to fetch product images', 500);
  }
}

// POST - Add images to an existing product
export async function POST(
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

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return errorResponse('No images provided', 400);
    }

    const existingImages = existingProduct.images as {
      url: string;
      public_id: string;
      altText: string;
    }[];

    const totalAfterUpload = existingImages.length + files.length;

    if (totalAfterUpload > 6) {
      return errorResponse(
        `Cannot upload ${files.length} images. Product already has ${existingImages.length} images. Maximum 6 total allowed.`,
        400
      );
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
        public_id: cloudinaryResult.public_id,
        altText: file.name.replace(/\.[^/.]+$/, ''),
      });
    }

    // Combine existing images with new uploaded images
    const allImages = [...existingImages, ...uploadedImages];

    // Update the product in database
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { images: allImages },
    });

    return successResponse('Images added to product successfully', {
      product: updatedProduct,
      newImages: uploadedImages,
      totalImages: allImages.length,
    });
  } catch (error) {
    console.error('Add images to product error: ', error);
    return errorResponse('Failed to add images to product', 500);
  }
}
