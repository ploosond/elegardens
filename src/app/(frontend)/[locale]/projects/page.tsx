import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HeroSection from '@/components/ui/HeroSection'
import ProjectsClient from './ProjectsClient'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL

async function getProjects(locale: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/projects`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('limit', '1000')
    url.searchParams.set('sort', 'position')

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' })

  return {
    title: `${t('hero_title')} - ${t('hero_highlight')}`,
    description: t('hero_description'),
  }
}

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = await params
  const t = await getTranslations('ProjectsPage')
  const projects = await getProjects(locale)

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />
      <ProjectsClient initialProjects={projects} />
    </div>
  )
}
