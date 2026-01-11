import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { getAuthenticatedClient } from '@/lib/auth-client'
import ProductsClient from './ProductsClient'
import type { Product } from '@/payload-types'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getProducts(locale: string): Promise<Product[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`)
    url.searchParams.set('limit', '1000')
    url.searchParams.set('sort', 'common_name')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data.docs || []
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

export default async function ClientProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Check authentication
  const client = await getAuthenticatedClient()
  if (!client) {
    redirect({ href: '/client/login', locale })
  }

  const products = await getProducts(locale)

  return <ProductsClient initialProducts={products} />
}
