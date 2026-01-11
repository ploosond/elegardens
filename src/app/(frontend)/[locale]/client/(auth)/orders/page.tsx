import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { getAuthenticatedClient } from '@/lib/auth-client'
import OrdersClient from './OrdersClient'
import type { Order } from '@/payload-types'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getClientOrders(clientId: number): Promise<Order[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/orders`)
    // Filter orders by client ID
    url.searchParams.set('where[client][equals]', clientId.toString())
    url.searchParams.set('sort', '-createdAt')
    url.searchParams.set('limit', '100')
    url.searchParams.set('depth', '2')

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        // Include credentials for authenticated requests
      },
    })

    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClientOrders' })

  return {
    title: t('title'),
  }
}

export default async function ClientOrdersPage({
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

  const orders = await getClientOrders(client.id)

  return <OrdersClient orders={orders} locale={locale} />
}
