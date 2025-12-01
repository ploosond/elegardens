import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import HeroSection from '@/components/ui/HeroSection';
import ProjectCard from '@/components/cards/ProjectCard';
import type { ProjectDto, ProjectsResponseDto } from '@/types/dto';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });

  return {
    title: t('hero_title') + ' ' + t('hero_highlight'),
    description: t('hero_description'),
  };
}

async function fetchProjects(): Promise<ProjectDto[]> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/admin/projects?page=1&limit=1000`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data: ProjectsResponseDto = await response.json();
    return data.data.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ProjectsPage');
  const projects = await fetchProjects();

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Project Grid */}
      <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12'>
        {projects.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-lg font-semibold text-gray-900'>
              {t('no_projects_title')}
            </p>
            <p className='mt-2 text-gray-500'>{t('no_projects_desc')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
            {projects
              .sort((a, b) => a.displayRank - b.displayRank)
              .map((project) => (
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
