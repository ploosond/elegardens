import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import BackButton from '@/components/ui/BackButton';
import projects from '@/data/projects';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project._id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const project = projects.find((p) => p._id.toString() === id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title[locale as 'en' | 'de'],
    description: project.tagline[locale as 'en' | 'de'],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('ProjectPage');

  const project = projects.find((p) => p._id.toString() === id);

  if (!project) {
    notFound();
  }

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
          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
              {t('about')}
            </h2>
            <p className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'>
              {project.about[locale as 'en' | 'de']}
            </p>
          </section>
          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
              {t('challenge')}
            </h2>
            <p className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'>
              {project.challenge[locale as 'en' | 'de']}
            </p>
          </section>
          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
              {t('solution')}
            </h2>
            <p className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'>
              {project.solution[locale as 'en' | 'de']}
            </p>
          </section>
          <section>
            <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
              {t('result')}
            </h2>
            <div className=' mt-2 rounded-lg'>
              <p className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'>
                {project.result[locale as 'en' | 'de']}
              </p>
            </div>
          </section>
        </main>

        {/* Aside / meta (starts at col 3, row 2) */}
        <aside className='lg:sticky lg:top-20'>
          <div className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='mb-4'>
              <span className='bg-accent/10 text-md inline-block rounded-full py-1 font-semibold uppercase tracking-wide text-secondary'>
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
