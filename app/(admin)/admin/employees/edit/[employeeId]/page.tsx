'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
  useFetchEmployee,
  useUpdateEmployee,
  useUploadProfilePictureForExistingEmployee,
  useDeleteProfilePictureForExistingEmployee,
  useDeletePendingProfilePicture,
} from '@/hooks/useEmployees';
import {
  updateEmployeeSchema,
  UpdateEmployeeSchema,
} from '@/lib/schemas/employeeSchema';
import toast from 'react-hot-toast';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = parseInt(params.employeeId as string, 10);

  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<{
    url: string;
    public_id: string;
    altText: string;
  } | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<{
    url: string;
    public_id: string;
    altText: string;
  } | null>(null);

  const { data: employeeData, isLoading, error } = useFetchEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const uploadProfilePicture = useUploadProfilePictureForExistingEmployee();
  const deleteProfilePicture = useDeleteProfilePictureForExistingEmployee();
  const deletePendingProfilePicture = useDeletePendingProfilePicture();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<UpdateEmployeeSchema>({
    resolver: zodResolver(updateEmployeeSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (employeeData?.data?.employee) {
      const employee = employeeData.data.employee;
      reset({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email || '',
        role: employee.role,
        department: employee.department,
        telephone: employee.telephone || '',
        profilePicture: undefined,
      });

      if (employee.profilePicture) {
        setExistingProfilePicture(employee.profilePicture);
      } else {
        setExistingProfilePicture(null);
      }
    }
  }, [employeeData, reset]);

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    const previousImage = uploadedProfilePicture;

    setUploadedProfilePicture(null);
    setValue('profilePicture', undefined);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const result = await uploadProfilePicture.mutateAsync({
        employeeId,
        formData,
      });
      const newImage = result.data.profilePicture;

      setUploadedProfilePicture(newImage);
      setValue('profilePicture', newImage);
      toast.success('Profile picture uploaded successfully');

      if (previousImage) {
        try {
          await deletePendingProfilePicture.mutateAsync(
            previousImage.public_id
          );
        } catch (error) {
          console.error('Failed to delete previous image:', error);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture. Please try again.');

      if (previousImage) {
        setUploadedProfilePicture(previousImage);
        setValue('profilePicture', previousImage);
      }
    } finally {
      e.target.value = '';
    }
  };

  const handleProfilePictureDelete = async () => {
    if (!uploadedProfilePicture || deletePendingProfilePicture.isPending) {
      return;
    }

    const imageToDelete = uploadedProfilePicture;

    setUploadedProfilePicture(null);
    setValue('profilePicture', undefined);

    try {
      await deletePendingProfilePicture.mutateAsync(imageToDelete.public_id);
      toast.success('Profile picture removed');
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      toast.error('Failed to remove image. Please try again.');
      setUploadedProfilePicture(imageToDelete);
      setValue('profilePicture', imageToDelete);
    }
  };

  const handleRemoveExistingProfilePicture = async () => {
    if (!existingProfilePicture || deleteProfilePicture.isPending) {
      return;
    }

    try {
      await deleteProfilePicture.mutateAsync(employeeId);
      setExistingProfilePicture(null);
      toast.success('Profile picture removed successfully');
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      toast.error('Failed to remove profile picture. Please try again.');
    }
  };

  const handleCancel = async () => {
    if (uploadedProfilePicture) {
      try {
        await deletePendingProfilePicture.mutateAsync(
          uploadedProfilePicture.public_id
        );
      } catch (error) {
        console.error('Failed to cleanup uploaded image:', error);
      }
    }
    router.push('/admin/employees');
  };

  const onSubmit = async (data: UpdateEmployeeSchema) => {
    try {
      const updateData: UpdateEmployeeSchema = {
        ...data,
        profilePicture: uploadedProfilePicture || undefined,
      };

      await updateEmployee.mutateAsync({
        employeeId,
        updateEmployeeDto: updateData,
      });
      toast.success('Employee updated successfully');
      router.push('/admin/employees');
    } catch (error) {
      console.error('Failed to update employee:', error);
      toast.error('Failed to update employee. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading employee...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load employee</p>
          <Button onClick={() => router.push('/admin/employees')}>
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Edit Employee Form */}
      <div className='mb-6'>
        <div className='bg-white shadow p-6'>
          <h2 className='text-lg font-semibold mb-3'>Edit Employee</h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Section 1: Basic Info */}
            <div className='border-b border-gray-200 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    First Name *
                  </label>
                  <input
                    {...register('first_name')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='John'
                  />
                  {errors.first_name && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Last Name *
                  </label>
                  <input
                    {...register('last_name')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Doe'
                  />
                  {errors.last_name && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type='email'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='john.doe@example.com'
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Telephone
                  </label>
                  <input
                    {...register('telephone')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='+1 234 567 8900'
                  />
                  {errors.telephone && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.telephone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Role */}
            <div className='border-b border-gray-200 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Role (EN) *
                  </label>
                  <input
                    {...register('role.en')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Manager'
                  />
                  {errors.role?.en && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.role.en.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Role (DE) *
                  </label>
                  <input
                    {...register('role.de')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Manager'
                  />
                  {errors.role?.de && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.role.de.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Department */}
            <div className='border-b border-gray-200 pb-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Department (EN) *
                  </label>
                  <input
                    {...register('department.en')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Sales'
                  />
                  {errors.department?.en && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.department.en.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block font-medium text-gray-700 mb-1'>
                    Department (DE) *
                  </label>
                  <input
                    {...register('department.de')}
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                    placeholder='Vertrieb'
                  />
                  {errors.department?.de && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.department.de.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Profile Picture */}
            <div>
              <label className='block font-medium text-gray-700 mb-2'>
                Profile Picture
              </label>
              <div className='relative w-full max-w-md mb-2'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleProfilePictureUpload}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                />
                <div className='px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer text-center text-sm text-gray-600'>
                  Choose File
                </div>
              </div>

              {/* Show existing profile picture or newly uploaded one */}
              {((existingProfilePicture && !deleteProfilePicture.isPending) ||
                (uploadedProfilePicture &&
                  !deletePendingProfilePicture.isPending) ||
                uploadProfilePicture.isPending ||
                deletePendingProfilePicture.isPending ||
                (deleteProfilePicture.isPending && existingProfilePicture)) && (
                <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 inline-block'>
                  <div className='flex flex-wrap gap-2'>
                    {/* Show existing profile picture (if no new upload) */}
                    {existingProfilePicture &&
                      !uploadedProfilePicture &&
                      !uploadProfilePicture.isPending &&
                      !deleteProfilePicture.isPending && (
                        <div className='relative flex-shrink-0'>
                          <img
                            src={existingProfilePicture.url}
                            alt={existingProfilePicture.altText}
                            className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                          />
                          <button
                            type='button'
                            onClick={handleRemoveExistingProfilePicture}
                            disabled={deleteProfilePicture.isPending}
                            className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Remove profile picture'
                          >
                            ×
                          </button>
                        </div>
                      )}

                    {/* Show uploaded new image */}
                    {uploadedProfilePicture &&
                      !deletePendingProfilePicture.isPending && (
                        <div className='relative flex-shrink-0'>
                          <img
                            src={uploadedProfilePicture.url}
                            alt={uploadedProfilePicture.altText}
                            className='h-20 w-20 object-cover rounded-lg border-2 border-white shadow-md'
                          />
                          <button
                            type='button'
                            onClick={handleProfilePictureDelete}
                            disabled={deletePendingProfilePicture.isPending}
                            className='absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Remove image'
                          >
                            ×
                          </button>
                        </div>
                      )}

                    {/* Show loading placeholder while uploading or deleting */}
                    {(uploadProfilePicture.isPending ||
                      deletePendingProfilePicture.isPending ||
                      (deleteProfilePicture.isPending &&
                        existingProfilePicture)) && (
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
                disabled={!isValid || uploadProfilePicture.isPending}
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
