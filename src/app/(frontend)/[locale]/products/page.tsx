import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HeroSection from '@/components/ui/HeroSection'
import ProductsClient from './ProductsClient'
import type { Product } from '@/payload-types'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getProducts(locale: string): Promise<Product[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`)
    // Don't filter by locale - products are not locale-specific
    // url.searchParams.set('locale', locale)
    url.searchParams.set('limit', '1000')
    url.searchParams.set('sort', 'common_name')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('Failed to fetch products:', res.status, res.statusText)
      return []
    }
    const data = await res.json()
    const products = data.docs || []
    console.log(`[${locale}] Fetched ${products.length} products`)
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ProductsPage' })

  return {
    title: `${t('hero_title')} - ${t('hero_highlight')}`,
    description: t('hero_description'),
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('ProductsPage')
  const products = await getProducts(locale)

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />
      <ProductsClient initialProducts={products} />
    </div>
  )
}
