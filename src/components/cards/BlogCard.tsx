import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { Blog } from '@/payload-types'

export default function BlogCard({ blog }: { blog: Blog }) {
  const locale = useLocale()
  const title = locale === 'de' ? blog.title_de : blog.title_en
  const summary = locale === 'de' ? blog.summary_de : blog.summary_en
  const imageUrl =
    blog.coverImage &&
    typeof blog.coverImage === 'object' &&
    'url' in blog.coverImage &&
    blog.coverImage.url
      ? blog.coverImage.url
      : 'https://placehold.co/600x400?text=Blog'
  const author = blog.author || ''
  const publishedDate = blog.publishedDate
    ? new Date(blog.publishedDate).toLocaleDateString(locale)
    : ''

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-muted/10 bg-white/5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-muted/20 hover:shadow-lg">
      <div className="relative h-56 w-full overflow-hidden bg-surface sm:h-64 md:h-56 lg:h-64">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-primary">{title}</h3>
        <p className="line-clamp-3 text-sm text-text">{summary}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-secondary">
          <span>{author}</span>
          <span>{publishedDate}</span>
        </div>
      </div>
    </article>
  )
}
