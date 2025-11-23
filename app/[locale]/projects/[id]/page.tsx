import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import BackButton from '@/components/ui/BackButton';
import type {
  ProjectDto,
  ProjectResponseDto,
  ProjectsResponseDto,
} from '@/types/dto';

async function fetchAllProjects(): Promise<ProjectDto[]> {
  try {
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

async function fetchProject(id: number): Promise<ProjectDto | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/admin/projects/${id}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch project');
    }

    const data: ProjectResponseDto = await response.json();
    return data.data.project || null;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

export async function generateStaticParams() {
  const projects = await fetchAllProjects();
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const projectId = parseInt(id, 10);
  const project = await fetchProject(projectId);

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
  const projectId = parseInt(id, 10);

  const project = await fetchProject(projectId);

  if (!project) {
    notFound();
  }

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
              key={index}
              className={index < sections.length - 1 ? 'mb-8' : ''}
            >
              <h2 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
                {section.title}
              </h2>
              <div className='space-y-2'>
                {section.texts.map((text, textIndex) => (
                  <p
                    key={textIndex}
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
