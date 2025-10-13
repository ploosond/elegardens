'use client';

import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, LogIn } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await axios.post('/api/admin/login', data);

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem(
          'adminUser',
          JSON.stringify(response.data.data.user)
        );

        router.push('/admin');
      } else {
        setLoginError(response.data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('An unknown error occurred');
      }
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

            {loginError && <ErrorMessage message={loginError} type='form' />}

            <Button
              type='submit'
              disabled={!isValid}
              loading={isLoading}
              icon={<LogIn className='w-5 h-5' />}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
