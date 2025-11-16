'use client';

import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User, Lock, LogIn } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useAdminLogin } from '@/hooks/useAuth';

export default function AdminLogin() {
  const router = useRouter();
  const adminLogin = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await adminLogin.mutateAsync(data);

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-start justify-center bg-white pt-20'>
      <div className='max-w-sm w-full'>
        <div className='p-6'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='mb-6'>
              <img
                src='/assets/logo.png'
                alt='EleGardens Logo'
                className='mx-auto h-16 w-auto'
              />
            </div>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('username')}
              type='text'
              id='username'
              icon={<User className='h-5 w-5 text-gray-400' />}
              placeholder='Enter your username'
              error={errors.username?.message}
            />

            <Input
              {...register('password')}
              type='password'
              id='password'
              icon={<Lock className='h-5 w-5 text-gray-400' />}
              placeholder='Enter your password'
              error={errors.password?.message}
            />

            <Button
              type='submit'
              loading={adminLogin.isPending}
              icon={<LogIn className='w-5 h-5' />}
              className='w-full'
            >
              {adminLogin.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
