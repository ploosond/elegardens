'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useFetchProducts,
  useCreateProduct,
  useDeleteProduct,
  useUploadImageForNewProduct,
  useDeletePendingProductImage,
} from '@/hooks/useProducts';
import {
  createProductSchema,
  CreateProductSchema,
} from '@/lib/schemas/productSchema';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; public_id: string; altText: string }>
  >([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [hasAttemptedUpload, setHasAttemptedUpload] = useState(false);
  const [maxImagesError, setMaxImagesError] = useState<string>('');
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useFetchProducts(currentPage, limit);
  const createProduct = useCreateProduct();
  const uploadImages = useUploadImageForNewProduct();
  const deleteProduct = useDeleteProduct();
  const deletePendingImage = useDeletePendingProductImage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (showAddForm) {
      setHasAttemptedUpload(false);
    }
  }, [showAddForm]);

  useEffect(() => {
    setValue('images', uploadedImages);
  }, [uploadedImages, setValue]);

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;

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

    if (uploadedImages.length + files.length > 6) {
      setMaxImagesError(
        `You can upload maximum 6 images. You already have ${uploadedImages.length} images.`
      );
      e.target.value = '';
      return;
    }

    setMaxImagesError('');

    const previousImages = uploadedImages;

    setUploadingFiles(fileArray);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }

      const result = await uploadImages.mutateAsync(formData);
      setUploadedImages((prev) => [...prev, ...result.data.images]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
      setUploadedImages(previousImages);
      setValue('images', previousImages);
    } finally {
      setUploadingFiles([]);
    }
    e.target.value = '';
  };

  const handleCancel = async () => {
    if (uploadedImages.length > 0) {
      for (const image of uploadedImages) {
        if (image.public_id) {
          try {
            await deletePendingImage.mutateAsync(image.public_id);
          } catch (error) {
            console.error('Failed to cleanup image:', error);
          }
        }
      }
    }

    reset();
    setUploadedImages([]);
    setUploadingFiles([]);
    setMaxImagesError('');
    setShowAddForm(false);
  };

  const handleImageDelete = async (imageIndex: number) => {
    const imageToDelete = uploadedImages[imageIndex];

    setDeletingImageIndex(imageIndex);

    if (imageToDelete.public_id) {
      try {
        await deletePendingImage.mutateAsync(imageToDelete.public_id);
        setUploadedImages((prev) =>
          prev.filter((_, index) => index !== imageIndex)
        );
        toast.success('Image removed');
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        toast.error(
          'Failed to delete image from storage. It may still appear in the final product.'
        );
      } finally {
        setDeletingImageIndex(null);
      }
    } else {
      setDeletingImageIndex(null);
    }
  };

  const onSubmit = async (data: CreateProductSchema) => {
    if (uploadedImages.length === 0) {
      return;
    }

    try {
      const productDataWithImages = {
        ...data,
        images: uploadedImages,
      };

      await createProduct.mutateAsync(productDataWithImages);
      toast.success('Product created successfully');
      reset();
      setUploadedImages([]);
      setUploadingFiles([]);
      setHasAttemptedUpload(false);
      setMaxImagesError('');
      setShowAddForm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(productId);
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setDeletingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='p-4 md:p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 md:p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load products</p>
          <Button
            onClick={() => window.location.reload()}
            className='w-full sm:w-auto'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-6'>
      {/* Header with Add Button */}
      {!showAddForm && (
        <div className='mb-4 flex flex-row-reverse items-center justify-between'>
          <Button
            onClick={() => setShowAddForm(true)}
            className='w-full md:w-32'
          >
            Add
          </Button>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className='mb-6'>
          <div className='bg-white shadow p-4 md:p-6'>
            <h2 className='text-lg font-semibold mb-3'>Add New Product</h2>

            <form
              onSubmit={(e) => {
                setHasAttemptedUpload(true);
                handleSubmit(onSubmit)(e);
              }}
              className='space-y-6'
            >
              {/* Section 1: Basic Info */}
              <div className='border-b border-gray-200 pb-6'>
                {/* Common Name Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                      placeholder='e.g. 10'
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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                    {(uploadedImages.length > 0 ||
                      uploadingFiles.length > 0 ||
                      deletingImageIndex !== null) && (
                      <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50'>
                        <div className='flex flex-wrap gap-2'>
                          {/* Show uploaded images */}
                          {uploadedImages.map((image, index) => {
                            // Show loading placeholder for the image being deleted
                            if (
                              deletingImageIndex === index &&
                              deletePendingImage.isPending
                            ) {
                              return (
                                <div
                                  key={index}
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
                                key={index}
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
                    {hasAttemptedUpload && uploadedImages.length === 0 && (
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
                        defaultValue='#6a844a'
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
              <div className='flex flex-col sm:flex-row justify-end gap-3'>
                <Button
                  type='button'
                  variant='secondary'
                  className='w-full sm:w-32'
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={uploadingFiles.length > 0}
                  className='w-full sm:w-40'
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Display */}
      <div className='bg-white shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table
            className='w-full border-collapse'
            style={{ tableLayout: 'fixed' }}
          >
            <colgroup>
              <col style={{ width: '3%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '19.5%' }} />
              <col style={{ width: '19.5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className='bg-gray-200 text-gray-700'>
                <th className='border p-1 text-center font-normal text-sm'>
                  #
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Common Name (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Common Name (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Description (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Description (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Height (cm)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Diameter (cm)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Hardiness (°C)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Light (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Light (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Images
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={12} className='p-6 text-center text-gray-500'>
                    <div className='flex flex-col items-center'>
                      <p className='text-lg font-normal'>No products found</p>
                      <p className='text-sm font-normal'>
                        Get started by adding your first product
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                [...products]
                  .sort((a, b) =>
                    (a.common_name?.en || '').localeCompare(
                      b.common_name?.en || ''
                    )
                  )
                  .map((product, index) => (
                    <tr key={product.id} className='hover:bg-gray-100'>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {index + 1}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.common_name.en}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.common_name.de}
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto  text-justify'>
                          {product.description.en}
                        </div>
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto  text-justify'>
                          {product.description.de}
                        </div>
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.height}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.diameter}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.hardiness}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.light.en}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {product.light.de}
                      </td>
                      <td className='border p-1'>
                        <div className='flex flex-col gap-1 items-center justify-center'>
                          {product.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={image.altText}
                              className='h-16 w-16 object-cover rounded'
                            />
                          ))}
                          {product.images.length > 3 && (
                            <div className='h-16 w-16 bg-gray-200 flex items-center justify-center text-xs text-gray-600 rounded'>
                              +{product.images.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='border p-1'>
                        <div className='flex flex-col gap-1 items-center justify-center'>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              router.push(`/admin/products/edit/${product.id}`)
                            }
                            className='p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200'
                            title='Edit product'
                          >
                            <Pencil className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              handleDelete(product.id, product.common_name.en)
                            }
                            disabled={deletingProductId === product.id}
                            className='p-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Delete product'
                          >
                            {deletingProductId === product.id ? (
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-500'></div>
                            ) : (
                              <X className='w-4 h-4' />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between gap-4 p-4 border-t border-gray-200'>
            <div className='flex items-center gap-2'>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className='px-2 py-1 border border-gray-300 rounded text-sm'
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span className='text-sm text-gray-600'>per page</span>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='secondary'
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={pagination.currentPage === 1}
                className='px-2 py-1 text-sm disabled:opacity-50'
              >
                Prev
              </Button>
              <span className='text-sm text-gray-600'>
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <Button
                variant='secondary'
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pagination.totalPages, prev + 1)
                  )
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className='px-2 py-1 text-sm disabled:opacity-50'
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
