import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import HeroSection from '@/components/ui/HeroSection';
import ProjectCard from '@/components/cards/ProjectCard';
import projects from '@/data/projects';

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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ProjectsPage');

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Project Grid */}
      <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <Link key={project._id} href={`/${locale}/projects/${project._id}`}>
              <ProjectCard project={project} locale={locale} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
