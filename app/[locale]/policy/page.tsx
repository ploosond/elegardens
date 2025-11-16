import HeroSection from '@/components/ui/HeroSection';
import { useTranslations } from 'next-intl';

export default function PolicyPage() {
  const t = useTranslations('PolicyPage');

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Policy Content */}
      <section className='py-8 sm:py-12'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6'>
          <div className='space-y-8 text-justify'>
            {/* Section 1 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section1_title')}
              </h2>
              <p className='text-base text-text'>{t('section1_content')}</p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section2_title')}
              </h2>
              <div className='space-y-4'>
                <p className='text-base text-text'>
                  <strong className='text-text'>
                    {t('section2_question1')}
                  </strong>
                  <br />
                  {t('section2_answer1')}
                </p>
                <p className='text-base text-text'>
                  <strong className='text-text'>
                    {t('section2_question2')}
                  </strong>
                  <br />
                  {t('section2_answer2')}
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section3_title')}
              </h2>
              <p className='text-base text-text'>{t('section3_content')}</p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section4_title')}
              </h2>
              <div className='space-y-4'>
                <p className='text-base text-text'>
                  <strong className='text-text'>
                    {t('section4_subtitle')}
                  </strong>
                  <br />
                  {t('section4_content')}
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section5_title')}
              </h2>
              <p className='text-base text-text'>{t('section5_content')}</p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className='mb-4 text-xl font-semibold text-secondary md:text-2xl'>
                {t('section6_title')}
              </h2>
              <p className='text-base text-text'>{t('section6_content')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
