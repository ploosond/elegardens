'use client'

import { Link } from '@/i18n/navigation'
import { ArrowRight, Package, ShieldCheck, TreeDeciduous, TrendingUp } from 'lucide-react'
import TeamMemberCard from '@/components/cards/TeamMemberCard'
import ProductCard from '@/components/cards/ProductCard'
import HomeVideo from './HomeVideo'
import AnnouncementBanner from '@/components/ui/AnnouncementBanner'
import type { Employee, Product } from '@/payload-types'
import { useTranslations } from 'next-intl'

interface BannerData {
  announcements: string[]
  backgroundColor: string
  textColor: string
  fontWeight: 'semibold' | 'bold' | 'extrabold'
  showOnDesktop: boolean
  showOnMobile: boolean
  speed: 'slow' | 'medium' | 'fast'
}

interface HomeClientProps {
  products: Product[]
  employees: Employee[]
  videoUrl: string
  videoTitle: string
  posterUrl?: string
  bannerData: BannerData | null
}

export default function HomeClient({
  products,
  employees,
  videoUrl,
  videoTitle,
  posterUrl,
  bannerData,
}: HomeClientProps) {
  const t = useTranslations('HomePage')

  return (
    <div>
      {/* Hero Section with Video */}
      <section className="relative h-[50vh] w-full overflow-hidden md:h-[calc(100vh-4rem)]">
        {bannerData && bannerData.announcements && bannerData.announcements.length > 0 && (
          <AnnouncementBanner
            announcements={bannerData.announcements}
            backgroundColor={bannerData.backgroundColor}
            textColor={bannerData.textColor}
            fontWeight={bannerData.fontWeight}
            showOnDesktop={bannerData.showOnDesktop}
            showOnMobile={bannerData.showOnMobile}
            speed={bannerData.speed}
          />
        )}
        <HomeVideo videoUrl={videoUrl} videoTitle={videoTitle} posterUrl={posterUrl} />

        <div className="relative z-10 flex h-full items-center pt-12 md:pt-20">
          <div className="mx-auto w-full px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-3xl font-bold text-on-dark sm:text-4xl md:text-5xl lg:text-6xl">
              {t('heroTitle1')}
              <span className="text-accent">{t('heroTitle2')}</span>
            </h1>
            <p className="mx-auto mb-6 max-w-lg text-base text-on-dark/80 sm:text-lg">
              {t('heroSubtitle')}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4 sm:px-0">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-surface px-6 py-3 font-semibold text-text shadow transition-colors hover:bg-muted sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
              >
                {t('exploreProducts')}
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-dark shadow transition-colors hover:bg-primary-dark sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
              >
                {t('contactTeam')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-bg py-8 sm:py-12">
        <div className="mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck strokeWidth={1} className="mb-2 h-8 w-8 text-primary" />
              <div className="mt-2 text-xl font-extrabold text-secondary">{t('feature1Title')}</div>
              <div className="mt-1 text-base text-text">{t('feature1Desc')}</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <TreeDeciduous strokeWidth={1} className="mb-2 h-8 w-8 text-primary" />
              <div className="mt-2 text-xl font-extrabold text-secondary">{t('feature2Title')}</div>
              <div className="mt-1 text-base text-text">{t('feature2Desc')}</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <Package strokeWidth={1} className="mb-2 h-8 w-8 text-primary" />
              <div className="mt-2 text-xl font-extrabold text-secondary">{t('feature3Title')}</div>
              <div className="mt-1 text-base text-text">{t('feature3Desc')}</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <TrendingUp strokeWidth={1} className="mb-2 h-8 w-8 text-primary" />
              <div className="mt-2 text-xl font-extrabold text-secondary">{t('feature4Title')}</div>
              <div className="mt-1 text-base text-text">{t('feature4Desc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-bg py-8 sm:py-12">
        <div className="mx-auto px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary md:text-4xl">
                {t('featuredProducts')}
              </h2>
              <p className="mt-2 text-lg text-text">{t('discoverPremiumPlants')}</p>
            </div>
            <Link
              href="/products"
              className="hidden items-center rounded px-2 py-1 text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
            >
              {t('viewAllProducts')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {products.slice(0, 6).map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center rounded px-3 py-2 text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('viewAllProducts')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto px-4 sm:px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-0">
            <div>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                {t('meetOurTeam')}
              </h2>
              <p className="mt-2 text-base text-text sm:text-lg">{t('teamExperts')}</p>
            </div>
            <Link
              href="/teams"
              className="hidden items-center rounded px-2 py-1 text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
            >
              {t('viewFullTeam')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-6">
            {employees.slice(0, 6).map((member: Employee) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/teams"
              className="inline-flex items-center rounded px-3 py-2 text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('viewFullTeam')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary/10 py-6 md:py-8">
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl text-primary">
            {t('readyTransform')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-text">{t('ctaDescription')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-dark transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              {t('contactTeam')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

