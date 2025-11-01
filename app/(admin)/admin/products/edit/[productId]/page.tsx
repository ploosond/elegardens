'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
  useFetchProduct,
  useUpdateProduct,
  useAddImagesToExistingProduct,
  useDeleteProductImage,
} from '@/hooks/useProducts';
import {
  updateProductSchema,
  UpdateProductSchema,
} from '@/lib/schemas/productSchema';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.productId as string, 10);

  const [existingImages, setExistingImages] = useState<
    Array<{ url: string; public_id: string; altText: string }>
  >([]);
  const [originalImages, setOriginalImages] = useState<
    Array<{ url: string; public_id: string; altText: string }>
  >([]);
  const [originalImagesInitialized, setOriginalImagesInitialized] =
    useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [maxImagesError, setMaxImagesError] = useState<string>('');
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(
    null
  );

  const { data: productData, isLoading, error } = useFetchProduct(productId);
  const updateProduct = useUpdateProduct();
  const addImages = useAddImagesToExistingProduct();
  const deleteProductImageMutation = useDeleteProductImage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (productData?.data?.product) {
      const product = productData.data.product;
      const productImages = product.images || [];

      reset({
        common_name: product.common_name,
        description: product.description,
        height: product.height,
        diameter: product.diameter,
        hardiness: product.hardiness,
        light: product.light,
        color: product.color,
      });

      if (!originalImagesInitialized) {
        setOriginalImages(productImages);
        setOriginalImagesInitialized(true);
      }

      setExistingImages(productImages);
    }
  }, [productData, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Only images are allowed');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB');
        e.target.value = '';
        return;
      }
    }

    const totalImages = existingImages.length + files.length;
    if (totalImages > 6) {
      setMaxImagesError(
        `You can upload maximum 6 images. You already have ${existingImages.length} images.`
      );
      e.target.value = '';
      return;
    }

    setMaxImagesError('');

    setUploadingFiles(fileArray);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }

      await addImages.mutateAsync({ productId, formData });
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploadingFiles([]);
    }
    e.target.value = '';
  };

  const handleCancel = async () => {
    if (!originalImagesInitialized || originalImages.length === 0) {
      if (existingImages.length > 0) {
        const indicesToDelete = Array.from(
          { length: existingImages.length },
          (_, i) => i
        ).sort((a, b) => b - a);

        for (const imageIndex of indicesToDelete) {
          try {
            await deleteProductImageMutation.mutateAsync({
              productId,
              imageIndex,
            });
          } catch (error) {
            console.error(
              `Failed to cleanup uploaded image at index ${imageIndex}:`,
              error
            );
          }
        }
      }
    } else {
      const originalPublicIds = new Set(
        originalImages.map((img) => img.public_id)
      );

      const indicesToDelete: number[] = [];
      existingImages.forEach((img, index) => {
        if (!originalPublicIds.has(img.public_id)) {
          indicesToDelete.push(index);
        }
      });

      if (indicesToDelete.length > 0) {
        indicesToDelete.sort((a, b) => b - a);

        for (const imageIndex of indicesToDelete) {
          try {
            await deleteProductImageMutation.mutateAsync({
              productId,
              imageIndex,
            });
          } catch (error) {
            console.error(
              `Failed to cleanup uploaded image at index ${imageIndex}:`,
              error
            );
          }
        }
      }
    }
    router.push('/admin/products');
  };

  const handleImageDelete = async (imageIndex: number) => {
    const imageToDelete = existingImages[imageIndex];

    setDeletingImageIndex(imageIndex);

    try {
      await deleteProductImageMutation.mutateAsync({
        productId,
        imageIndex,
      });
      setExistingImages((prev) =>
        prev.filter((_, index) => index !== imageIndex)
      );
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setDeletingImageIndex(null);
    }
  };

  const onSubmit = async (data: UpdateProductSchema) => {
    setHasAttemptedSubmit(true);

    if (existingImages.length === 0) {
      return;
    }

    try {
      await updateProduct.mutateAsync({ productId, updateProductDto: data });
      toast.success('Product updated successfully');
      setHasAttemptedSubmit(false);
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading product...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load product</p>
          <Button onClick={() => router.push('/admin/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Edit Product Form */}
      <div className='mb-6'>
        <div className='bg-white shadow p-6'>
          <h2 className='text-lg font-semibold mb-3'>Edit Product</h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Section 1: Basic Info */}
            <div className='border-b border-gray-200 pb-6'>
              {/* Common Name Fields */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Common Name (EN) *
                  </label>
                  <input
                    {...register('common_name.en')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='e.g. Ficus lyrata'
                  />
                  {errors.common_name?.en && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.common_name.en.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Common Name (DE) *
                  </label>
                  <input
                    {...register('common_name.de')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='z.B. Ficus lyrata'
                  />
                  {errors.common_name?.de && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.common_name.de.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Description (EN) *
                  </label>
                  <textarea
                    {...register('description.en')}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Short description in English'
                    rows={3}
                  />
                  {errors.description?.en && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.description.en.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Description (DE) *
                  </label>
                  <textarea
                    {...register('description.de')}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Kurze Beschreibung auf Deutsch'
                    rows={3}
                  />
                  {errors.description?.de && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.description.de.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Physical Properties */}
            <div className='border-b border-gray-200 pb-6'>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Height (cm) *
                  </label>
                  <input
                    {...register('height')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='e.g. 10-20'
                  />
                  {errors.height && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.height.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Diameter (cm) *
                  </label>
                  <input
                    {...register('diameter')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='e.g. 5-10'
                  />
                  {errors.diameter && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.diameter.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Hardiness (°C) *
                  </label>
                  <input
                    {...register('hardiness')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='e.g. 3-5'
                  />
                  {errors.hardiness && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.hardiness.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Visual Properties */}
            <div>
              <div className='grid grid-cols-3 gap-4'>
                {/* Images */}
                <div>
                  <label className='block font-medium text-gray-700 mb-2'>
                    Product Images *
                  </label>
                  <div className='relative w-full'>
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleImageUpload}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    <div className='px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer text-center text-sm text-gray-600'>
                      Choose Files
                    </div>
                  </div>
                  {(existingImages.length > 0 ||
                    uploadingFiles.length > 0 ||
                    deletingImageIndex !== null) && (
                    <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50'>
                      <div className='flex flex-wrap gap-2'>
                        {/* Show all images from existingImages (includes newly uploaded ones after refetch) */}
                        {existingImages.map((image, index) => {
                          // Show loading placeholder for the image being deleted
                          if (
                            deletingImageIndex === index &&
                            deleteProductImageMutation.isPending
                          ) {
                            return (
                              <div
                                key={`image-${image.public_id}-${index}`}
                                className='relative flex-shrink-0'
                              >
                                <div className='h-20 w-20 bg-gray-200 rounded-lg border-2 border-white shadow-md flex items-center justify-center'>
                                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                                </div>
                              </div>
                            );
                          }

                          // Show normal image
                          return (
                            <div
                              key={`image-${image.public_id}-${index}`}
                              className='relative flex-shrink-0'
                            >
                              <img
                                src={image.url}
                                alt={image.altText}
                                className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                              />
                              <button
                                type='button'
                                onClick={() => handleImageDelete(index)}
                                className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold'
                                title='Remove image'
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                        {/* Show individual loading placeholders for each file being uploaded */}
                        {uploadingFiles.map((file, index) => (
                          <div
                            key={`uploading-${index}`}
                            className='relative flex-shrink-0'
                          >
                            <div className='h-20 w-20 bg-gray-200 rounded-lg border-2 border-white shadow-md flex items-center justify-center'>
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasAttemptedSubmit && existingImages.length === 0 && (
                    <p className='text-red-500 text-sm mt-1'>
                      At least one image is required
                    </p>
                  )}
                  {maxImagesError && (
                    <p className='text-red-500 text-sm mt-1'>
                      {maxImagesError}
                    </p>
                  )}
                </div>

                {/* Light */}
                <div>
                  <label className='block font-medium text-gray-700 mb-2'>
                    Light *
                  </label>
                  <Controller
                    name='light.en'
                    control={control}
                    render={({ field }) => (
                      <div className='space-y-2'>
                        <div className='flex gap-4'>
                          <label className='flex items-center'>
                            <input
                              {...field}
                              type='radio'
                              value='sun'
                              checked={field.value === 'sun'}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setValue('light.de', 'sonne');
                              }}
                              className='mr-2 text-primary focus:ring-primary'
                            />
                            <span className='text-sm'>Sun (Sonne)</span>
                          </label>
                        </div>
                        <div className='flex gap-4'>
                          <label className='flex items-center'>
                            <input
                              {...field}
                              type='radio'
                              value='half-shadow'
                              checked={field.value === 'half-shadow'}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setValue('light.de', 'halb-schatten');
                              }}
                              className='mr-2 text-primary focus:ring-primary'
                            />
                            <span className='text-sm'>
                              Half-Shadow (Halb-Schatten)
                            </span>
                          </label>
                        </div>
                        <div className='flex gap-4'>
                          <label className='flex items-center'>
                            <input
                              {...field}
                              type='radio'
                              value='shadow'
                              checked={field.value === 'shadow'}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setValue('light.de', 'schatten');
                              }}
                              className='mr-2 text-primary focus:ring-primary'
                            />
                            <span className='text-sm'>Shadow (Schatten)</span>
                          </label>
                        </div>
                      </div>
                    )}
                  />
                  {errors.light?.en && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.light.en.message}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className='block font-medium text-gray-700 mb-2'>
                    Color *
                  </label>
                  <div className='flex items-center gap-3'>
                    <input
                      {...register('color')}
                      type='color'
                      onChange={(e) => setValue('color', e.target.value)}
                      className='w-10 h-10 border border-gray-300 rounded cursor-pointer'
                    />
                    <input
                      {...register('color')}
                      type='text'
                      className='w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm'
                      placeholder='#6a844a'
                    />
                  </div>
                  {errors.color && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.color.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-3 '>
              <Button
                type='button'
                variant='secondary'
                className='w-32'
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!isValid || uploadingFiles.length > 0}
                className='w-40'
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
