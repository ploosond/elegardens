'use client';

import Link from 'next/link';
import HeroSection from '@/components/ui/HeroSection';
import ProjectCard from '@/components/cards/ProjectCard';
import { useFetchProjects } from '@/hooks/useProjects';
import { useLocale, useTranslations } from 'next-intl';
import type { ProjectDto } from '@/types/dto';

export default function ProjectsPage() {
  const t = useTranslations('ProjectsPage');
  const locale = useLocale();
  const limit = 1000; // Fetch all projects at once

  // Fetch all projects
  const {
    isPending: isPendingProjects,
    isError: isErrorProjects,
    data: projectsData,
    error: errorProjects,
  } = useFetchProjects(1, limit);

  const allProjects: ProjectDto[] =
    projectsData?.data?.projects?.sort(
      (a, b) => a.displayRank - b.displayRank
    ) ?? [];

  // Loading state
  if (isPendingProjects) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-text'>{t('loading')}</h2>
      </div>
    );
  }

  // Error state
  if (isErrorProjects) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-danger'>
          {t('error')}: {errorProjects?.message}
        </h2>
      </div>
    );
  }

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Project Grid */}
      <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12'>
        {allProjects.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-lg font-semibold text-gray-900'>
              {t('no_projects_title')}
            </p>
            <p className='mt-2 text-gray-500'>{t('no_projects_desc')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
            {allProjects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/projects/${project.id}`}
              >
                <ProjectCard project={project} locale={locale} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
