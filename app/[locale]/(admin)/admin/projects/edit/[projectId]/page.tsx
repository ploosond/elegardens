'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useDeleteProjectImage,
  useFetchProject,
  useUpdateProject,
  useUpdateProjectImage,
} from '@/hooks/useProjects';
import {
  updateProjectSchema,
  UpdateProjectSchema,
} from '@/lib/schemas/projectSchema';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.projectId as string, 10);

  const [currentImage, setCurrentImage] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: projectData, isLoading, error } = useFetchProject(projectId);
  const updateProject = useUpdateProject();
  const updateImage = useUpdateProjectImage();
  const deleteImage = useDeleteProjectImage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    mode: 'onTouched',
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

  const sectionsDeFields = watch('sections.de') ?? [];
  const sectionsEnFields = watch('sections.en') ?? [];

  useEffect(() => {
    if (projectData?.data?.project) {
      const project = projectData.data.project;
      setCurrentImage(project.image);

      reset({
        client: project.client,
        title: project.title,
        category: project.category,
        tagline: project.tagline,
        image: project.image,
        sections: project.sections,
        displayRank: project.displayRank,
      });
    }
  }, [projectData, reset]);

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
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await updateImage.mutateAsync({ projectId, formData });
      const updatedProject = result.data.project;
      setCurrentImage(updatedProject.image);
      setValue('image', updatedProject.image);
      toast.success('Image updated successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to update image. Please try again.');
    } finally {
      setUploadingFile(null);
      setIsUploading(false);
    }
    e.target.value = '';
  };

  const handleImageDelete = async () => {
    if (!currentImage || deleteImage.isPending) {
      return;
    }

    try {
      await deleteImage.mutateAsync(projectId);
      setCurrentImage('');
      setValue('image', '');
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to remove image. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  const onSubmit = async (data: UpdateProjectSchema) => {
    setHasAttemptedSubmit(true);

    try {
      await updateProject.mutateAsync({
        projectId,
        updateProjectDto: data,
      });
      toast.success('Project updated successfully');
      setHasAttemptedSubmit(false);
      router.push('/admin/projects');
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading project...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load project</p>
          <Button onClick={() => router.push('/admin/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='bg-white shadow p-6 rounded-lg'>
          <h2 className='text-lg font-semibold mb-4'>Edit Project</h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                {(currentImage || isUploading || deleteImage.isPending) && (
                  <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 inline-block'>
                    <div className='flex flex-wrap gap-2'>
                      {/* Show current image */}
                      {currentImage &&
                        !isUploading &&
                        !deleteImage.isPending && (
                          <div className='relative flex-shrink-0'>
                            <img
                              src={currentImage}
                              alt='Current project image'
                              className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                            />
                            <button
                              type='button'
                              onClick={handleImageDelete}
                              disabled={deleteImage.isPending}
                              className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Remove image'
                            >
                              ×
                            </button>
                          </div>
                        )}
                      {/* Show loading placeholder while uploading or deleting */}
                      {(isUploading || deleteImage.isPending) && (
                        <div className='relative flex-shrink-0'>
                          <div className='h-20 w-20 bg-gray-200 rounded-lg border-2 border-white shadow-md flex items-center justify-center'>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                              rows={2}
                            />
                            {sectionsDeFields[sectionIndex]?.texts.length >
                              1 && (
                              <button
                                type='button'
                                onClick={() => {
                                  const currentTexts =
                                    sectionsDeFields[sectionIndex]?.texts || [];
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
                              rows={2}
                            />
                            {sectionsEnFields[sectionIndex]?.texts.length >
                              1 && (
                              <button
                                type='button'
                                onClick={() => {
                                  const currentTexts =
                                    sectionsEnFields[sectionIndex]?.texts || [];
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
                disabled={isUploading || deleteImage.isPending}
                className='w-full sm:w-40'
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
