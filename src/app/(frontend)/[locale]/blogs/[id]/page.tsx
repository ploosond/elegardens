'use client'

import { useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/ui/BackButton'
import { useEffect, useState } from 'react'

export default function BlogDetailPage() {
  const params = useParams()
  const t = useTranslations('BlogPage')
  const locale = useLocale()
  const slug = params.id

  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(false)
    fetch(`/api/blogs?where[slug][equals]=${slug}&depth=2`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        if (data?.docs?.length > 0) {
          setBlog(data.docs[0])
        } else {
          setBlog(null)
        }
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  // Helper to get localized field
  const getLocalized = (obj: any, base: string) =>
    obj?.[`${base}_${locale}`] || obj?.[base + '_en'] || ''

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold text-text">{t('loading')}</h2>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text">{t('blog_not_found')}</h2>
          <p className="mt-4 text-text/70">{t('blog_not_found_desc')}</p>
          <Link
            href={`/${locale}/blogs`}
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-on-dark hover:bg-primary-dark"
          >
            {t('back_to_blogs')}
          </Link>
        </div>
      </div>
    )
  }

  const sections = Array.isArray(blog.sections) ? blog.sections : []

  return (
    <article aria-labelledby="blog-title" className="mx-auto px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      {/* Back Button */}
      <BackButton href={`/${locale}/blogs`} label={t('back_to_blogs')} className="mb-6" />

      {/* Title and summary */}
      <header className="mb-6">
        <h1
          id="blog-title"
          className="text-3xl text-center font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl"
        >
          {getLocalized(blog, 'title')}
        </h1>
        {getLocalized(blog, 'summary') && (
          <p className="mt-2 text-center text-lg text-gray-600">{getLocalized(blog, 'summary')}</p>
        )}
        <div className="mt-2 flex flex-col items-center gap-2 text-sm text-gray-500">
          {blog.publishedDate && (
            <span>
              {t('published')}: {new Date(blog.publishedDate).toLocaleDateString(locale)}
            </span>
          )}
          {blog.author && (
            <span>
              {t('author')}: {blog.author}
            </span>
          )}
        </div>
      </header>

      {/* Cover image */}
      {blog.coverImage && blog.coverImage.url && (
        <div className="mx-auto mb-10 flex max-w-4xl justify-center">
          <div className="relative w-full overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
            <div className="relative h-72 w-full sm:h-80 lg:h-96">
              <Image
                src={blog.coverImage.url}
                alt={getLocalized(blog, 'title')}
                fill
                sizes="(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw"
                className="object-cover object-center"
                priority={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid: main/aside */}
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main content (starts at col 1, row 2) */}
        <main className="prose prose-base dark:prose-invert max-w-none lg:col-span-2">
          {sections.length === 0 && <div className="text-gray-500">{t('no_sections')}</div>}
          {sections.map((section: any, index: number) => {
            if (section.blockType === 'text-block') {
              return (
                <section
                  key={`section-text-${index}`}
                  className={index < sections.length - 1 ? 'mb-8' : ''}
                >
                  {getLocalized(section, 'subtitle') && (
                    <h2 className="mb-4 text-lg font-bold text-secondary sm:mb-6 sm:text-xl">
                      {getLocalized(section, 'subtitle')}
                    </h2>
                  )}
                  <div className="space-y-2">
                    {Array.isArray(section.paragraphs) &&
                      section.paragraphs.map((para: any, textIndex: number) => (
                        <p
                          key={`text-${index}-${textIndex}`}
                          className="mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base"
                        >
                          {getLocalized(para, 'text')}
                        </p>
                      ))}
                  </div>
                </section>
              )
            }
            if (section.blockType === 'image-block') {
              return (
                <section
                  key={`section-image-${index}`}
                  className={index < sections.length - 1 ? 'mb-8' : ''}
                >
                  {section.image && section.image.url && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-full max-w-xl h-64">
                        <Image
                          src={section.image.url}
                          alt={getLocalized(section, 'caption') || getLocalized(blog, 'title')}
                          fill
                          sizes="(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw"
                          className="object-cover object-center rounded shadow"
                        />
                      </div>
                    </div>
                  )}
                  {getLocalized(section, 'caption') && (
                    <p className="text-center text-gray-500 italic">
                      {getLocalized(section, 'caption')}
                    </p>
                  )}
                </section>
              )
            }
            return null
          })}
        </main>

        {/* Aside / meta (starts at col 3, row 2) */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <dl className="space-y-3 text-sm text-gray-600">
              {blog.author && (
                <div>
                  <dt className="font-medium text-text">{t('author')}</dt>
                  <dd>{blog.author}</dd>
                </div>
              )}
              {blog.publishedDate && (
                <div>
                  <dt className="font-medium text-text">{t('published')}</dt>
                  <dd>{new Date(blog.publishedDate).toLocaleDateString(locale)}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  )
}
