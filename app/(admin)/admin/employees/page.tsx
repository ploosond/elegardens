'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useFetchEmployees,
  useCreateEmployee,
  useUploadProfilePictureForNewEmployee,
  useDeletePendingProfilePicture,
  useDeleteEmployee,
} from '@/hooks/useEmployees';
import {
  createEmployeeSchema,
  CreateEmployeeSchema,
} from '@/lib/schemas/employeeSchema';
import toast from 'react-hot-toast';

export default function EmployeesPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<{
    url: string;
    public_id: string;
    altText: string;
  } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useFetchEmployees();
  const createEmployee = useCreateEmployee();
  const uploadProfilePicture = useUploadProfilePictureForNewEmployee();
  const deletePendingProfilePicture = useDeletePendingProfilePicture();
  const deleteEmployee = useDeleteEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
    mode: 'onTouched',
  });

  const employees = data?.data?.employees || [];

  // Upload profile picture (step 1: before creating employee)
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

    // Clear old image immediately for better UX
    setUploadedProfilePicture(null);
    setValue('profilePicture', undefined);
    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      // 1. Upload new image first
      const result = await uploadProfilePicture.mutateAsync(formData);
      const newImage = result.data.profilePicture;

      // 2. Set new image in state and form
      setUploadedProfilePicture(newImage);
      setValue('profilePicture', newImage);
      toast.success('Profile picture uploaded successfully');

      // 3. Delete old image after successful upload (non-blocking)
      if (previousImage) {
        try {
          await deletePendingProfilePicture.mutateAsync(
            previousImage.public_id
          );
        } catch (error) {
          console.error('Failed to delete previous image:', error);
          // Non-blocking - continue with new image
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture. Please try again.');

      // Restore previous image if upload fails
      if (previousImage) {
        setUploadedProfilePicture(previousImage);
        setValue('profilePicture', previousImage);
      }
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  // Delete uploaded profile picture (before employee creation)
  const handleProfilePictureDelete = async () => {
    if (!uploadedProfilePicture || deletePendingProfilePicture.isPending) {
      return;
    }

    const imageToDelete = uploadedProfilePicture;

    // Optimistic update
    setUploadedProfilePicture(null);
    setValue('profilePicture', undefined);

    try {
      await deletePendingProfilePicture.mutateAsync(imageToDelete.public_id);
      toast.success('Profile picture removed');
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      toast.error('Failed to remove image. Please try again.');
      // Restore on failure
      setUploadedProfilePicture(imageToDelete);
      setValue('profilePicture', imageToDelete);
    }
  };

  // Clean up uploaded image on form cancel/close
  const handleCancel = async () => {
    if (uploadedProfilePicture) {
      try {
        await deletePendingProfilePicture.mutateAsync(
          uploadedProfilePicture.public_id
        );
      } catch (error) {
        console.error('Failed to cleanup image:', error);
      }
    }

    reset();
    setUploadedProfilePicture(null);
    setShowAddForm(false);
  };

  // Delete employee (with confirmation dialog)
  const handleDeleteEmployee = async (employeeId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this employee? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeletingEmployeeId(employeeId);
    try {
      await deleteEmployee.mutateAsync(employeeId);
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee. Please try again.');
    } finally {
      setDeletingEmployeeId(null);
    }
  };

  // Create employee (step 2: after uploading profile picture in step 1)
  const onSubmit = async (data: CreateEmployeeSchema) => {
    try {
      await createEmployee.mutateAsync(data);
      toast.success('Employee created successfully');
      reset();
      setUploadedProfilePicture(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create employee:', error);
      toast.error('Failed to create employee. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className='p-4 md:p-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2 text-gray-600'>Loading employees...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 md:p-6'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-2'>Failed to load employees</p>
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

      {/* Add Employee Form */}
      {showAddForm && (
        <div className='mb-6'>
          <div className='bg-white shadow p-4 md:p-6'>
            <h2 className='text-lg font-semibold mb-3'>Add New Employee</h2>

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
                <div className='relative w-full max-w-md'>
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
                {(uploadedProfilePicture ||
                  uploadingFile ||
                  deletePendingProfilePicture.isPending) && (
                  <div className='mt-3 px-2 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 inline-block'>
                    <div className='flex flex-wrap gap-2'>
                      {/* Show uploaded image */}
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
                      {(uploadingFile ||
                        deletePendingProfilePicture.isPending) && (
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
                  disabled={uploadingFile}
                  className='w-full sm:w-40'
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Display */}
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
              <col style={{ width: '15%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr className='bg-gray-200 text-gray-700'>
                <th className='border p-1 text-center font-normal text-sm'>
                  #
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  First Name
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Last Name
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Email
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Telephone
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Role (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Role (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Department (EN)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Department (DE)
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Profile Picture
                </th>
                <th className='border p-1 text-center font-normal text-sm'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={11} className='p-6 text-center text-gray-500'>
                    <div className='flex flex-col items-center'>
                      <p className='text-lg font-normal'>No employees found</p>
                      <p className='text-sm font-normal'>
                        Get started by adding your first employee
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((employee, index) => (
                  <tr key={employee.id} className='hover:bg-gray-100'>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {index + 1}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.first_name}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.last_name}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.email || '-'}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.telephone || '-'}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.role.en}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.role.de}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.department.en}
                    </td>
                    <td className='border p-1 text-center font-normal text-sm'>
                      {employee.department.de}
                    </td>
                    <td className='border p-1'>
                      {employee.profilePicture && (
                        <div className='flex justify-center items-center'>
                          <img
                            src={employee.profilePicture.url}
                            alt={employee.profilePicture.altText}
                            className='h-16 w-16 object-cover rounded'
                          />
                        </div>
                      )}
                    </td>
                    <td className='border p-1'>
                      <div className='flex flex-col gap-1 items-center justify-center'>
                        <Button
                          variant='secondary'
                          onClick={() =>
                            router.push(`/admin/employees/edit/${employee.id}`)
                          }
                          className='p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200'
                          title='Edit employee'
                        >
                          <Pencil className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='secondary'
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={deletingEmployeeId === employee.id}
                          className='p-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          title='Delete employee'
                        >
                          {deletingEmployeeId === employee.id ? (
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
      </div>
    </div>
  );
}
