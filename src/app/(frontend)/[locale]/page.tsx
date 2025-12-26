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

async function getAnnouncementBanner(locale: string) {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/announcement-banner?locale=${locale}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null
    const data = await res.json()

    // Check if banner is enabled
    if (!data.enabled) return null

    // Get announcements array (now contains both en and de in each item)
    const announcements = data.announcements || []

    // Return null if no announcements
    if (!announcements || announcements.length === 0) return null

    // Extract text based on locale from each announcement object
    const announcementTexts = announcements
      .map((item: { text_en?: string; text_de?: string }) => {
        if (locale === 'de') {
          return item.text_de || item.text_en || ''
        }
        return item.text_en || item.text_de || ''
      })
      .filter((text: string) => Boolean(text))

    if (announcementTexts.length === 0) return null

    return {
      announcements: announcementTexts,
      backgroundColor: data.backgroundColor || '#0b7a43',
      textColor: data.textColor || '#ffffff',
      fontWeight: (data.fontWeight || 'bold') as 'semibold' | 'bold' | 'extrabold',
      showOnDesktop: data.showOnDesktop !== false,
      showOnMobile: data.showOnMobile !== false,
      speed: (data.speed || 'medium') as 'slow' | 'medium' | 'fast',
    }
  } catch (error) {
    console.error('Error fetching announcement banner:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    title: `${t('heroTitle1')} ${t('heroTitle2')} - Elegardens`,
    description: t('heroSubtitle'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Fetch all data in parallel
  const [products, employees, videoData, bannerData] = await Promise.all([
    getProducts(locale),
    getEmployees(locale),
    getVideoGlobal(),
    getAnnouncementBanner(locale),
  ])

  return (
    <HomeClient
      products={products}
      employees={employees}
      videoUrl={videoData.videoUrl}
      videoTitle={videoData.videoTitle}
      bannerData={bannerData}
    />
  )
}
