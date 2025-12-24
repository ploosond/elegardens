'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import { useFetchProject } from '@/hooks/useProjects';

export default function ProjectDetailPage() {
  const params = useParams();
  const t = useTranslations('ProjectPage');
  const locale = useLocale();
  const projectId = Number(params.id);

  // Fetch current project
  const {
    data: projectData,
    isPending: isLoadingProject,
    isError: isErrorProject,
  } = useFetchProject(projectId);

  if (isLoadingProject) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-text'>{t('loading')}</h2>
      </div>
    );
  }

  if (isErrorProject || !projectData?.data?.project) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-text'>
            {t('project_not_found')}
          </h2>
          <p className='mt-4 text-text/70'>{t('project_not_found_desc')}</p>
          <Link
            href={`/${locale}/projects`}
            className='mt-6 inline-block rounded-md bg-primary px-6 py-3 text-on-dark hover:bg-primary-dark'
          >
            {t('back_to_projects')}
          </Link>
        </div>
      </div>
    );
  }

  const project = projectData.data.project;
  const sections = project.sections[locale as 'en' | 'de'] || [];

  return (
    <article
      aria-labelledby='project-title'
      className='mx-auto px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8'
    >
      {/* Back Button */}
      <BackButton
        href={`/${locale}/projects`}
        label={t('back_to_projects')}
        className='mb-6'
      />

      {/* Title above image for visibility */}
      <header className='mb-6'>
        <h1
          id='project-title'
          className='text-3xl text-center font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl'
        >
          {project.title[locale as 'en' | 'de']}
        </h1>
      </header>

      {/* Larger hero image */}
      <div className='mx-auto mb-10 flex max-w-4xl justify-center'>
        <div className='relative w-full overflow-hidden rounded border border-gray-200 bg-white shadow-lg'>
          <div className='relative h-72 w-full sm:h-80 lg:h-96'>
            <Image
              src={project.image}
              alt={project.title[locale as 'en' | 'de']}
              fill
              sizes='(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw'
              className='object-cover object-center'
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Grid: main/aside */}
      <div className='grid grid-cols-1 grid-rows-[auto_1fr] gap-6 lg:grid-cols-3 lg:gap-8'>
        {/* Main content (starts at col 1, row 2) */}
        <main className='prose prose-base dark:prose-invert max-w-none lg:col-span-2'>
          {sections.map((section, index) => (
            <section
              key={`section-${index}-${section.title}`}
              className={index < sections.length - 1 ? 'mb-8' : ''}
            >
              <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
                {section.title}
              </h2>
              <div className='space-y-2'>
                {section.texts.map((text, textIndex) => (
                  <p
                    key={`text-${index}-${textIndex}-${text.slice(0, 20)}`}
                    className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'
                  >
                    {text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* Aside / meta (starts at col 3, row 2) */}
        <aside className='lg:sticky lg:top-20'>
          <div className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='mb-4'>
              <span className='inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary'>
                {project.category[locale as 'en' | 'de']}
              </span>
            </div>
            <dl className='space-y-3 text-sm text-gray-600'>
              {project.client && (
                <div>
                  <dt className='font-medium text-text'>{t('client')}</dt>
                  <dd>{project.client}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
