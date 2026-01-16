import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginClient from './LoginClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClientLogin' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ClientLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClientLogin' })

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-muted bg-bg p-8 shadow-lg">
          <div className="mb-8 text-center">
            {/* <h1 className="text-3xl font-bold text-text">{t("title")}</h1> */}
            <p className="mt-2 text-sm text-text/70">{t('description')}</p>
          </div>
          <LoginClient locale={locale} />
        </div>
      </div>
    </div>
  )
}
