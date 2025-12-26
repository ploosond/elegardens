import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeClient from './HomeClient'
import type { Employee, Product } from '@/payload-types'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getProducts(locale: string): Promise<Product[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('limit', '10')
    url.searchParams.set('sort', 'common_name_en')

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function getEmployees(locale: string): Promise<Employee[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/employees`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('limit', '10')
    url.searchParams.set('sort', 'createdAt')

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching employees:', error)
    return []
  }
}

async function getVideoGlobal() {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/upload-home-page-video`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return { videoUrl: '', videoTitle: '' }
    const data = await res.json()

    const videoUrl =
      data['feature-video'] &&
      typeof data['feature-video'] === 'object' &&
      data['feature-video'].url
        ? data['feature-video'].url
        : ''

    return {
      videoUrl,
      videoTitle: data.title || '',
    }
  } catch (error) {
    console.error('Error fetching video global:', error)
    return { videoUrl: '', videoTitle: '' }
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    title: `${t('heroTitle1')} ${t('heroTitle2')} - Elegardens`,
    description: t('heroSubtitle'),
  }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params

  // Fetch all data in parallel
  const [products, employees, videoData] = await Promise.all([
    getProducts(locale),
    getEmployees(locale),
    getVideoGlobal(),
  ])

  return (
    <HomeClient
      products={products}
      employees={employees}
      videoUrl={videoData.videoUrl}
      videoTitle={videoData.videoTitle}
    />
  )
}
