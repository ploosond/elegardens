import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BackButton from '@/components/ui/BackButton';

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getBlog(slug: string, locale: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/blogs`);
    url.searchParams.set('where[slug][equals]', slug);
    url.searchParams.set('locale', locale);
    url.searchParams.set('depth', '2');

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const blog = await getBlog(id, locale);
  if (!blog) return {};

  const metaTitle =
    locale === 'de'
      ? blog.metaTitle_de || blog.title_de || blog.title_en
      : blog.metaTitle_en || blog.title_en || blog.title_de;

  const metaDescription =
    locale === 'de'
      ? blog.metaDescription_de || blog.summary_de || blog.summary_en
      : blog.metaDescription_en || blog.summary_en || blog.summary_de;

  return {
    title: metaTitle || 'Blog Post',
    description: metaDescription || '',
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  const t = await getTranslations('BlogPage');
  const blog = await getBlog(slug, locale);

  if (!blog) {
    notFound();
  }

  // Helper to get localized field
  const getLocalized = (obj: Record<string, unknown>, base: string) =>
    (obj?.[`${base}_${locale}`] as string) ||
    (obj?.[`${base}_en`] as string) ||
    '';

  const sections = Array.isArray(blog.sections) ? blog.sections : [];

  return (
    <article
      aria-labelledby='blog-title'
      className='mx-auto px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8'
    >
      {/* Back Button */}
      <BackButton
        href={`/${locale}/blogs`}
        label={t('back_to_blogs')}
        className='mb-6'
      />

      {/* Title and summary */}
      <header className='mb-6'>
        <h1
          id='blog-title'
          className='text-3xl text-center font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl'
        >
          {getLocalized(blog, 'title')}
        </h1>
        {getLocalized(blog, 'summary') && (
          <p className='mt-2 text-center text-lg text-gray-600'>
            {getLocalized(blog, 'summary')}
          </p>
        )}
        <div className='mt-2 flex flex-col items-center gap-2 text-sm text-gray-500'>
          {blog.publishedDate && (
            <span>
              {t('published')}:{' '}
              {new Date(blog.publishedDate).toLocaleDateString(locale)}
            </span>
          )}
          {blog.author && (
            <span>
              {t('author')}: {blog.author}
            </span>
          )}
        </div>
      </header>

      {/* Cover image */}
      {blog.coverImage?.url && (
        <div className='mx-auto mb-10 flex max-w-4xl justify-center'>
          <div className='relative w-full overflow-hidden rounded border border-gray-200 bg-white shadow-lg'>
            <div className='relative h-72 w-full sm:h-80 lg:h-96'>
              <Image
                src={blog.coverImage.url}
                alt={getLocalized(blog, 'title')}
                fill
                sizes='(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw'
                className='object-cover object-center'
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid: main/aside */}
      <div className='grid grid-cols-1 grid-rows-[auto_1fr] gap-6 lg:grid-cols-3 lg:gap-8'>
        {/* Main content (starts at col 1, row 2) */}
        <main className='prose prose-base dark:prose-invert max-w-none lg:col-span-2'>
          {sections.length === 0 && (
            <div className='text-gray-500'>{t('no_sections')}</div>
          )}
          {sections.map((section: Record<string, unknown>, index: number) => {
            const sectionKey = `section-${index}-${section.blockType || index}`;

            if (section.blockType === 'text-block') {
              return (
                <section
                  key={sectionKey}
                  className={index < sections.length - 1 ? 'mb-8' : ''}
                >
                  {getLocalized(section, 'subtitle') && (
                    <h2 className='mb-4 text-lg font-bold text-secondary sm:mb-6 sm:text-xl'>
                      {getLocalized(section, 'subtitle')}
                    </h2>
                  )}
                  <div className='space-y-2'>
                    {Array.isArray(section.paragraphs) &&
                      section.paragraphs.map(
                        (para: Record<string, unknown>, textIndex: number) => {
                          const paraKey = `para-${index}-${textIndex}-${getLocalized(para, 'text')?.slice(0, 20) || textIndex}`;
                          return (
                            <p
                              key={paraKey}
                              className='mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base'
                            >
                              {getLocalized(para, 'text')}
                            </p>
                          );
                        },
                      )}
                  </div>
                </section>
              );
            }
            if (section.blockType === 'image-block') {
              // Type guard for Media - check if it's an object with url property
              const imageUrl =
                section.image &&
                typeof section.image === 'object' &&
                'url' in section.image
                  ? (section.image as { url?: string }).url
                  : null;

              return (
                <section
                  key={sectionKey}
                  className={index < sections.length - 1 ? 'mb-8' : ''}
                >
                  {imageUrl && (
                    <div className='mb-4 flex justify-center'>
                      <div className='relative w-full max-w-xl h-64'>
                        <Image
                          src={imageUrl}
                          alt={
                            getLocalized(section, 'caption') ||
                            getLocalized(blog, 'title') ||
                            ''
                          }
                          fill
                          sizes='(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw'
                          className='object-cover object-center rounded shadow'
                        />
                      </div>
                    </div>
                  )}
                  {getLocalized(section, 'caption') && (
                    <p className='text-center text-gray-500 italic'>
                      {getLocalized(section, 'caption')}
                    </p>
                  )}
                </section>
              );
            }
            return null;
          })}
        </main>

        {/* Aside / meta (starts at col 3, row 2) */}
        <aside className='lg:sticky lg:top-20'>
          <div className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
            <dl className='space-y-3 text-sm text-gray-600'>
              {blog.author && (
                <div>
                  <dt className='font-medium text-text'>{t('author')}</dt>
                  <dd>{blog.author}</dd>
                </div>
              )}
              {blog.publishedDate && (
                <div>
                  <dt className='font-medium text-text'>{t('published')}</dt>
                  <dd>
                    {new Date(blog.publishedDate).toLocaleDateString(locale)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
