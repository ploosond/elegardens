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

  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; public_id: string; altText: string }>
  >([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [maxImagesError, setMaxImagesError] = useState<string>('');

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

  // Load product data into form when data is available
  useEffect(() => {
    if (productData?.data?.product) {
      const product = productData.data.product;
      reset({
        common_name: product.common_name,
        description: product.description,
        height: product.height,
        diameter: product.diameter,
        hardiness: product.hardiness,
        light: product.light,
        color: product.color,
      });
      setUploadedImages(product.images || []);
    }
  }, [productData, reset]);

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 6) {
      setMaxImagesError(
        `You can upload maximum 6 images. You already have ${uploadedImages.length} images.`
      );
      e.target.value = '';
      return;
    }

    // Clear any previous max images error
    setMaxImagesError('');

    // Add files to uploading state to show individual placeholders
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }

      const result = await addImages.mutateAsync({ productId, formData });
      setUploadedImages((prev) => [...prev, ...result.data.newImages]);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingFiles([]); // Clear uploading files
    }
    e.target.value = '';
  };

  // Image delete handler
  const handleImageDelete = async (imageIndex: number) => {
    const imageToDelete = uploadedImages[imageIndex];

    // Remove from UI immediately (optimistic update)
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== imageIndex)
    );

    // Delete from database and Cloudinary via the proper endpoint
    try {
      await deleteProductImageMutation.mutateAsync({ productId, imageIndex });
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image. Please try again.');
      // Revert UI change if deletion failed
      setUploadedImages((prev) => {
        const reverted = [...prev];
        reverted.splice(imageIndex, 0, imageToDelete);
        return reverted;
      });
    }
  };

  // Form submission handler
  const onSubmit = async (data: UpdateProductSchema) => {
    setHasAttemptedSubmit(true);

    // Check if no images (same validation as add form)
    if (uploadedImages.length === 0) {
      return; // Don't submit, just show validation error
    }

    try {
      // Images are managed separately via add/delete API calls immediately
      await updateProduct.mutateAsync({ productId, updateProductDto: data });
      toast.success('Product updated successfully');
      // Success - navigate back
      setHasAttemptedSubmit(false); // Reset on success
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
                  {(uploadedImages.length > 0 || uploadingFiles.length > 0) && (
                    <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50'>
                      <div className='flex flex-wrap gap-2'>
                        {/* Show uploaded images */}
                        {uploadedImages.map((image, index) => (
                          <div key={index} className='relative flex-shrink-0'>
                            <img
                              src={image.url}
                              alt={image.altText}
                              className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                            />
                            <button
                              type='button'
                              onClick={() => handleImageDelete(index)}
                              disabled={deleteProductImageMutation.isPending}
                              className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Remove image'
                            >
                              {deleteProductImageMutation.isPending ? (
                                <div className='animate-spin rounded-full h-3 w-3 border-b border-red-500'></div>
                              ) : (
                                '×'
                              )}
                            </button>
                          </div>
                        ))}
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
                  {hasAttemptedSubmit && uploadedImages.length === 0 && (
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
                onClick={() => {
                  setMaxImagesError(''); // Clear any error messages
                  router.push('/admin/products');
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!isValid}
                loading={updateProduct.isPending}
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
