import Image from 'next/image';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  return (
    <article className='group flex h-full transform cursor-pointer flex-col overflow-hidden rounded-sm border border-muted/10 bg-white/5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-muted/20 hover:shadow-lg focus:outline-none focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:ring-4 focus-visible:ring-primary/20'>
      {/* Cover image */}
      <div className='relative h-56 w-full overflow-hidden rounded bg-surface sm:h-64 md:h-56 lg:h-64'>
        <Image
          src={project.image}
          alt={project.title[locale as 'en' | 'de']}
          fill
          sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          priority={false}
        />
        {/* subtle gradient overlay for legibility */}
        <div
          className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'
          aria-hidden='true'
        />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-4 p-5'>
        <div className='flex items-start justify-between'>
          <div className='min-w-0'>
            <p className='mb-1 text-xs uppercase tracking-widest text-secondary'>
              {project.client}
            </p>

            <h3 className='line-clamp-2 text-lg font-semibold leading-tight text-primary'>
              {project.title[locale as 'en' | 'de']}
            </h3>
          </div>
        </div>
        <p className='line-clamp-3 text-sm text-text'>
          {project.tagline[locale as 'en' | 'de']}
        </p>
      </div>
    </article>
  );
}
