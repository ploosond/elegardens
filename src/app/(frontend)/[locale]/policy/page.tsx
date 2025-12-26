import HeroSection from '@/components/ui/HeroSection'
import RichText from '@/components/ui/RichText'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getPrivacyPolicy(locale: string) {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/privacy-policy?locale=${locale}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching privacy policy:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'PolicyPage' })

  return {
    title: `${t('hero_title')} ${t('hero_highlight')} - Elegardens`,
    description: t('hero_description'),
  }
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'PolicyPage' })
  const policy = await getPrivacyPolicy(locale)

  // Get sections from Payload CMS, or fallback to empty array
  const sections = policy?.sections || []

  return (
    <div>
      {/* Hero Section - using translations */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Policy Content */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-8 text-justify">
            {sections.length === 0 ? (
              <p className="text-center text-text">No privacy policy content available.</p>
            ) : (
              sections.map((section: any, index: number) => {
                const sectionTitle =
                  section[`title_${locale}`] || section.title_en || `Section ${index + 1}`
                const sectionContent =
                  section[`content_${locale}`] || section.content_en || null

                return (
                  <div key={index}>
                    <h2 className="mb-4 text-xl font-semibold text-secondary md:text-2xl">
                      {sectionTitle}
                    </h2>
                    {sectionContent && (
                      <div className="text-base text-text">
                        <RichText data={sectionContent} />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
