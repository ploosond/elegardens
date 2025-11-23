'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useFetchProjects,
  useCreateProject,
  useDeleteProject,
  useUploadImageForNewProject,
  useDeletePendingProjectImage,
} from '@/hooks/useProjects';
import {
  createProjectSchema,
  CreateProjectSchema,
} from '@/lib/schemas/projectSchema';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    public_id: string;
    altText: string;
  } | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [hasAttemptedUpload, setHasAttemptedUpload] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useFetchProjects(currentPage, limit);
  const createProject = useCreateProject();
  const uploadImage = useUploadImageForNewProject();
  const deleteProject = useDeleteProject();
  const deletePendingImage = useDeletePendingProjectImage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onTouched',
    defaultValues: {
      client: '',
      title: { en: '', de: '' },
      category: { en: '', de: '' },
      tagline: { en: '', de: '' },
      image: '',
      displayRank: 0,
      sections: {
        de: [{ title: '', texts: [''] }],
        en: [{ title: '', texts: [''] }],
      },
    },
  });

  const {
    fields: sectionsDe,
    append: appendSectionDe,
    remove: removeSectionDe,
  } = useFieldArray({
    control,
    name: 'sections.de',
  });

  const {
    fields: sectionsEn,
    append: appendSectionEn,
    remove: removeSectionEn,
  } = useFieldArray({
    control,
    name: 'sections.en',
  });

  const sectionsDeFields = watch('sections.de');
  const sectionsEnFields = watch('sections.en');

  const projects = data?.data?.projects || [];
  const pagination = data?.data?.pagination;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setUploadingFile(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadImage.mutateAsync(formData);
      setUploadedImage(result.data.image);
      setValue('image', result.data.image.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingFile(null);
    }
    e.target.value = '';
  };

  const handleCancel = async () => {
    if (uploadedImage?.public_id) {
      try {
        await deletePendingImage.mutateAsync(uploadedImage.public_id);
      } catch (error) {
        console.error('Failed to cleanup image:', error);
      }
    }

    reset();
    setUploadedImage(null);
    setUploadingFile(null);
    setShowAddForm(false);
  };

  const handleImageDelete = async () => {
    if (!uploadedImage?.public_id) return;

    setDeletingImage(true);
    try {
      await deletePendingImage.mutateAsync(uploadedImage.public_id);
      setUploadedImage(null);
      setValue('image', '');
      toast.success('Image removed');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image from storage.');
    } finally {
      setDeletingImage(false);
    }
  };

  const onSubmit = async (data: CreateProjectSchema) => {
    if (!uploadedImage) {
      toast.error('Please upload an image');
      return;
    }

    try {
      await createProject.mutateAsync({
        ...data,
        image: uploadedImage.url,
      });
      toast.success('Project created successfully');
      reset();
      setUploadedImage(null);
      setUploadingFile(null);
      setHasAttemptedUpload(false);
      setShowAddForm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project. Please try again.');
    }
  };

  const handleDelete = async (projectId: number, projectTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingProjectId(projectId);
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project. Please try again.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='p-4 md:p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 md:p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load projects</p>
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

      {/* Add Project Form */}
      {showAddForm && (
        <div className='mb-6'>
          <div className='bg-white shadow p-4 md:p-6 rounded-lg'>
            <h2 className='text-lg font-semibold mb-4'>Add New Project</h2>

            <form
              onSubmit={(e) => {
                setHasAttemptedUpload(true);
                handleSubmit(onSubmit)(e);
              }}
              className='space-y-6'
            >
              {/* Section 1: Basic Info */}
              <div className='border-b border-gray-200 pb-6'>
                <h3 className='text-md font-medium mb-4'>Basic Information</h3>

                {/* Client */}
                <div className='mb-4'>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Client *
                  </label>
                  <input
                    {...register('client')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='e.g. OKAPA'
                  />
                  {errors.client && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.client.message}
                    </p>
                  )}
                </div>

                {/* Title Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Title (EN) *
                    </label>
                    <input
                      {...register('title.en')}
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='e.g. An Everyday Object, Designed to the Extreme'
                    />
                    {errors.title?.en && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.title.en.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Title (DE) *
                    </label>
                    <input
                      {...register('title.de')}
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='z.B. Ein Alltagsobjekt, extrem gestaltet'
                    />
                    {errors.title?.de && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.title.de.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Category (EN) *
                    </label>
                    <input
                      {...register('category.en')}
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='e.g. Product Design'
                    />
                    {errors.category?.en && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.category.en.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Category (DE) *
                    </label>
                    <input
                      {...register('category.de')}
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='z.B. Produktdesign'
                    />
                    {errors.category?.de && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.category.de.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tagline Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Tagline (EN) *
                    </label>
                    <textarea
                      {...register('tagline.en')}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='A luxury accessory for health- and trend-conscious Gen Z.'
                      rows={2}
                    />
                    {errors.tagline?.en && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.tagline.en.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block font-medium text-gray-700 mb-1'>
                      Tagline (DE) *
                    </label>
                    <textarea
                      {...register('tagline.de')}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                      placeholder='Ein Luxus-Accessoire für gesundheits- und trendbewusste Gen Z.'
                      rows={2}
                    />
                    {errors.tagline?.de && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.tagline.de.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Display Rank */}
                <div className='mb-4'>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Display Rank
                  </label>
                  <input
                    {...register('displayRank', { valueAsNumber: true })}
                    type='number'
                    min={0}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='0'
                  />
                  {errors.displayRank && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.displayRank.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section 2: Image */}
              <div className='border-b border-gray-200 pb-6'>
                <div>
                  <label className='block font-medium text-gray-700 mb-2'>
                    Project Image *
                  </label>
                  <div className='relative w-full max-w-md'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    <div className='px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer text-center text-sm text-gray-600'>
                      Choose File
                    </div>
                  </div>
                  {(uploadedImage || uploadingFile || deletingImage) && (
                    <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 inline-block'>
                      <div className='flex flex-wrap gap-2'>
                        {/* Show uploaded image */}
                        {uploadedImage && !deletingImage && (
                          <div className='relative flex-shrink-0'>
                            <img
                              src={uploadedImage.url}
                              alt={uploadedImage.altText}
                              className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                            />
                            <button
                              type='button'
                              onClick={handleImageDelete}
                              disabled={deletingImage}
                              className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Remove image'
                            >
                              ×
                            </button>
                          </div>
                        )}
                        {/* Show loading placeholder while uploading or deleting */}
                        {(uploadingFile || deletingImage) && (
                          <div className='relative flex-shrink-0'>
                            <div className='h-20 w-20 bg-gray-200 rounded-lg border-2 border-white shadow-md flex items-center justify-center'>
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {hasAttemptedUpload && !uploadedImage && (
                    <p className='mt-1 text-sm text-red-600'>
                      Please upload an image
                    </p>
                  )}
                </div>
              </div>

              {/* Section 3: Dynamic Sections */}
              <div className='border-b border-gray-200 pb-6'>
                <h3 className='text-md font-medium mb-4'>Project Sections</h3>

                {/* German Sections */}
                <div className='mb-6'>
                  <h4 className='text-sm font-medium mb-3 text-gray-700'>
                    Sections (DE) *
                  </h4>
                  {sectionsDe.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className='mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50'
                    >
                      <div className='flex justify-between items-center mb-3'>
                        <span className='text-sm font-medium text-gray-600'>
                          Section {sectionIndex + 1}
                        </span>
                        {sectionsDe.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeSectionDe(sectionIndex)}
                            className='text-red-600 hover:text-red-800'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        )}
                      </div>

                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Section Title *
                        </label>
                        <input
                          {...register(
                            `sections.de.${sectionIndex}.title` as const
                          )}
                          type='text'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm'
                          placeholder='e.g. About'
                        />
                        {errors.sections?.de?.[sectionIndex]?.title && (
                          <p className='mt-1 text-xs text-red-600'>
                            {errors.sections.de[sectionIndex]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Section Content (Paragraphs) *
                        </label>
                        {sectionsDeFields[sectionIndex]?.texts?.map(
                          (_, textIndex) => (
                            <div key={textIndex} className='mb-2 flex gap-2'>
                              <textarea
                                {...register(
                                  `sections.de.${sectionIndex}.texts.${textIndex}` as const
                                )}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm'
                                placeholder={`Paragraph ${textIndex + 1}`}
                                rows={2}
                              />
                              {sectionsDeFields[sectionIndex]?.texts.length >
                                1 && (
                                <button
                                  type='button'
                                  onClick={() => {
                                    const currentTexts =
                                      sectionsDeFields[sectionIndex]?.texts ||
                                      [];
                                    const newTexts = currentTexts.filter(
                                      (_, i) => i !== textIndex
                                    );
                                    setValue(
                                      `sections.de.${sectionIndex}.texts` as const,
                                      newTexts
                                    );
                                  }}
                                  className='text-red-600 hover:text-red-800 px-2'
                                >
                                  <X className='w-4 h-4' />
                                </button>
                              )}
                            </div>
                          )
                        )}
                        <button
                          type='button'
                          onClick={() => {
                            const currentTexts =
                              sectionsDeFields[sectionIndex]?.texts || [];
                            setValue(
                              `sections.de.${sectionIndex}.texts` as const,
                              [...currentTexts, '']
                            );
                          }}
                          className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                        >
                          <Plus className='w-4 h-4' />
                          Add Paragraph
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={() => appendSectionDe({ title: '', texts: [''] })}
                    className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                  >
                    <Plus className='w-4 h-4' />
                    Add Section (DE)
                  </button>
                </div>

                {/* English Sections */}
                <div>
                  <h4 className='text-sm font-medium mb-3 text-gray-700'>
                    Sections (EN) *
                  </h4>
                  {sectionsEn.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className='mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50'
                    >
                      <div className='flex justify-between items-center mb-3'>
                        <span className='text-sm font-medium text-gray-600'>
                          Section {sectionIndex + 1}
                        </span>
                        {sectionsEn.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeSectionEn(sectionIndex)}
                            className='text-red-600 hover:text-red-800'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        )}
                      </div>

                      <div className='mb-3'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Section Title *
                        </label>
                        <input
                          {...register(
                            `sections.en.${sectionIndex}.title` as const
                          )}
                          type='text'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm'
                          placeholder='e.g. About'
                        />
                        {errors.sections?.en?.[sectionIndex]?.title && (
                          <p className='mt-1 text-xs text-red-600'>
                            {errors.sections.en[sectionIndex]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Section Content (Paragraphs) *
                        </label>
                        {sectionsEnFields[sectionIndex]?.texts?.map(
                          (_, textIndex) => (
                            <div key={textIndex} className='mb-2 flex gap-2'>
                              <textarea
                                {...register(
                                  `sections.en.${sectionIndex}.texts.${textIndex}` as const
                                )}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm'
                                placeholder={`Paragraph ${textIndex + 1}`}
                                rows={2}
                              />
                              {sectionsEnFields[sectionIndex]?.texts.length >
                                1 && (
                                <button
                                  type='button'
                                  onClick={() => {
                                    const currentTexts =
                                      sectionsEnFields[sectionIndex]?.texts ||
                                      [];
                                    const newTexts = currentTexts.filter(
                                      (_, i) => i !== textIndex
                                    );
                                    setValue(
                                      `sections.en.${sectionIndex}.texts` as const,
                                      newTexts
                                    );
                                  }}
                                  className='text-red-600 hover:text-red-800 px-2'
                                >
                                  <X className='w-4 h-4' />
                                </button>
                              )}
                            </div>
                          )
                        )}
                        <button
                          type='button'
                          onClick={() => {
                            const currentTexts =
                              sectionsEnFields[sectionIndex]?.texts || [];
                            setValue(
                              `sections.en.${sectionIndex}.texts` as const,
                              [...currentTexts, '']
                            );
                          }}
                          className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                        >
                          <Plus className='w-4 h-4' />
                          Add Paragraph
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={() => appendSectionEn({ title: '', texts: [''] })}
                    className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                  >
                    <Plus className='w-4 h-4' />
                    Add Section (EN)
                  </button>
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
                  disabled={uploadingFile !== null}
                  className='w-full sm:w-40'
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Display */}
      <div className='bg-white shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table
            className='w-full border-collapse'
            style={{ tableLayout: 'fixed' }}
          >
            <colgroup>
              <col style={{ width: '3%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className='bg-gray-200 text-gray-700'>
                <th className='border p-1 text-center font-normal text-sm'>
                  #
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Client
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Title (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Title (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Category (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Category (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Tagline (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Tagline (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Image
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Rank
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={11} className='p-6 text-center text-gray-500'>
                    <div className='flex flex-col items-center'>
                      <p className='text-lg font-normal'>No projects found</p>
                      <p className='text-sm font-normal'>
                        Get started by adding your first project
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                [...projects]
                  .sort((a, b) => a.displayRank - b.displayRank)
                  .map((project, index) => (
                    <tr key={project.id} className='hover:bg-gray-100'>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {index + 1}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {project.client}
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto text-justify'>
                          {project.title.en}
                        </div>
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto text-justify'>
                          {project.title.de}
                        </div>
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {project.category.en}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {project.category.de}
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto text-justify'>
                          {project.tagline.en}
                        </div>
                      </td>
                      <td className='border p-1 font-normal text-sm'>
                        <div className='max-h-64 overflow-y-auto text-justify'>
                          {project.tagline.de}
                        </div>
                      </td>
                      <td className='border p-1'>
                        {project.image && (
                          <div className='flex justify-center items-center'>
                            <img
                              src={project.image}
                              alt={project.title.en}
                              className='h-16 w-16 object-cover rounded'
                            />
                          </div>
                        )}
                      </td>
                      <td className='border p-1 text-center font-normal text-sm'>
                        {project.displayRank}
                      </td>
                      <td className='border p-1'>
                        <div className='flex flex-col gap-1 items-center justify-center'>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              router.push(`/admin/projects/edit/${project.id}`)
                            }
                            className='p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200'
                            title='Edit project'
                          >
                            <Pencil className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              handleDelete(project.id, project.title.en)
                            }
                            disabled={deletingProjectId === project.id}
                            className='p-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Delete project'
                          >
                            {deletingProjectId === project.id ? (
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
