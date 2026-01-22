import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/ui/HeroSection';
import BlogsClient from './BlogsClient';

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getBlogs(locale: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/blogs`);
    url.searchParams.set('locale', locale);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('sort', '-publishedDate');

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogsPage' });

  return {
    title: `${t('hero_title')} - ${t('hero_highlight')}`,
    description: t('hero_description'),
  };
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('BlogsPage');
  const blogs = await getBlogs(locale);

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />
      <BlogsClient initialBlogs={blogs} />
    </div>
  );
}
