import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { getAuthenticatedClient } from '@/lib/auth-client'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClientDashboard' })

  return {
    title: t('title'),
  }
}

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Get authenticated client
  const client = await getAuthenticatedClient()

  // Redirect to login if not authenticated
  if (!client) {
    redirect({ href: '/client/login', locale })
  }

  // TypeScript: client is guaranteed to be non-null here due to the check above
  return <DashboardClient client={client!} locale={locale} />
}
