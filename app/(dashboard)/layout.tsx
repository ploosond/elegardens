'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavigationLink from '@/components/ui/NavigationLink';
import LogoutButton from '@/components/ui/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Navigation - Always visible when authenticated */}
      {isAuthenticated && (
        <div className='bg-white shadow-sm border-b border-gray-200 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-4'>
              <NavigationLink
                href='/admin/products'
                isActive={pathname === '/admin/products'}
              >
                Products
              </NavigationLink>
              <NavigationLink
                href='/admin/employees'
                isActive={pathname === '/admin/employees'}
              >
                Employees
              </NavigationLink>
            </div>
            <LogoutButton onClick={handleLogout} />
          </div>
        </div>
      )}

      {/* Content Area - Child routes render here */}
      <div className='flex-1'>{children}</div>
    </div>
  );
}
