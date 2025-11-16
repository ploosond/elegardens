'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import HeroSection from '@/components/ui/HeroSection';
import TeamMemberCard from '@/components/cards/TeamMemberCard';
import { Link } from '@/i18n/navigation';
import { useFetchEmployees } from '@/hooks/useEmployees';
import { EmployeeDto } from '@/types/dto/employee.dto';

export default function TeamsPage() {
  const t = useTranslations('TeamsPage');
  const locale = useLocale();
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);

  const {
    isPending,
    isError,
    data: employeesData,
    error,
  } = useFetchEmployees();

  if (isPending) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-text'>{t('loading')}</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-danger'>
          {t('error')}: {error?.message}
        </h2>
      </div>
    );
  }

  const employees = employeesData?.data?.employees || [];

  // Extract unique departments based on current locale
  const departments = [
    ...new Set(employees.map((emp: any) => emp.department[locale])),
  ];

  // Filter team members based on selected department
  const filteredEmployees = activeDepartment
    ? employees.filter(
        (emp: any) => emp.department[locale] === activeDepartment
      )
    : employees;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Team Members Section */}
      <section className='py-12 sm:py-16'>
        <div className='mx-auto px-4 sm:px-6'>
          {/* Department Filter */}
          <div className='mb-10 flex flex-wrap justify-center gap-3'>
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeDepartment === null
                  ? 'bg-primary text-on-dark'
                  : 'bg-surface text-primary hover:bg-muted'
              }`}
              onClick={() => setActiveDepartment(null)}
            >
              {t('all_departments')}
            </button>
            {departments.map((departmentName) => (
              <button
                key={departmentName}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeDepartment === departmentName
                    ? 'bg-primary text-on-dark'
                    : 'bg-surface text-primary hover:bg-muted'
                }`}
                onClick={() => setActiveDepartment(departmentName)}
              >
                {departmentName}
              </button>
            ))}
          </div>

          {/* Display team members */}
          <div className='flex flex-wrap justify-center -mx-3 sm:-mx-4'>
            {filteredEmployees.map((employee: EmployeeDto) => (
              <div
                key={employee.id}
                className='mb-6 w-full px-3 sm:mb-8 sm:w-1/2 sm:px-4 md:w-1/3 lg:w-1/6'
              >
                <TeamMemberCard member={employee} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='bg-primary/10 py-12 text-center'>
        <div className='mx-auto max-w-5xl px-4'>
          <h2 className='text-2xl font-semibold text-primary md:text-3xl'>
            {t('get_in_touch_title')}
          </h2>
          <p className='mx-auto mt-2 max-w-2xl text-text opacity-70'>
            {t('get_in_touch_desc')}
          </p>
          <div className='mt-6'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-dark transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer'
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
