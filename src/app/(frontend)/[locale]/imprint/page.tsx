import HeroSection from '@/components/ui/HeroSection';
import RichText from '@/components/ui/RichText';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getImprint(locale: string) {
  try {
    const res = await fetch(
      `${PAYLOAD_API}/api/globals/imprint?locale=${locale}`,
      {
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching imprint:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ImprintPage' });

  return {
    title: `${t('hero_title')} ${t('hero_highlight')} - Elegardens`,
    description: t('hero_description'),
  };
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ImprintPage' });
  const imprint = await getImprint(locale);

  const sections = imprint?.sections || [];

  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      <section className='py-8 sm:py-12'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6'>
          <div className='space-y-8 text-justify'>
            {sections.length === 0 ? (
              <p className='text-center text-text'>{t('empty_state')}</p>
            ) : (
              sections.map((section: any, index: number) => {
                const sectionTitle =
                  section[`title_${locale}`] ||
                  section.title_en ||
                  `Section ${index + 1}`;
                const sectionContent =
                  section[`content_${locale}`] || section.content_en || null;

                return (
                  <div key={index}>
                    <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                      {sectionTitle}
                    </h2>
                    {sectionContent && (
                      <div className='text-base text-text'>
                        <RichText data={sectionContent} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
