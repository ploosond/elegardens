'use client'

import Link from 'next/link'
import HeroSection from '@/components/ui/HeroSection'
import BlogCard from '@/components/cards/BlogCard'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

export default function BlogsPage() {
  const t = useTranslations('BlogsPage')
  const locale = useLocale()

  // Pagination
  const [page, setPage] = useState(1)

  // Blogs state
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blogs from Payload
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true)
        const url = new URL(`${PAYLOAD_API}/api/blogs`)
        url.searchParams.set('locale', locale)
        url.searchParams.set('limit', '1000')
        url.searchParams.set('sort', '-publishedDate')

        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch blogs')

        const data = await res.json()
        setAllBlogs(data.docs || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [locale])

  // Client-side pagination
  const itemsPerPage = 12
  const totalPages = Math.ceil(allBlogs.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogs = allBlogs.slice(startIndex, endIndex)

  // Calculate visible page numbers (max 3)
  const visiblePages = useMemo(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page === 1) return [1, 2, 3]
    if (page === totalPages) return [totalPages - 2, totalPages - 1, totalPages]
    return [page - 1, page, page + 1]
  }, [page, totalPages])

  // Loading / Error
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold text-text">{t('loading')}</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-semibold text-danger">
          {t('error')}: {error}
        </h2>
      </div>
    )
  }

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Blog Grid */}
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {paginatedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-gray-900">{t('no_blogs_title')}</p>
            <p className="mt-2 text-gray-500">{t('no_blogs_desc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedBlogs.map((blog) => (
              <Link key={blog.id} href={`/${locale}/blogs/${blog.slug}`}>
                <BlogCard blog={blog} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-8">
          {visiblePages.map((p) => (
            <button
              key={p}
              className={`rounded px-3 py-1 text-sm font-semibold transition-colors ${
                p === page
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-primary hover:bg-primary/10'
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
