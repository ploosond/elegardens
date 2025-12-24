import HeroSection from '@/components/ui/HeroSection';
import { Link } from '@/i18n/navigation';
import { BookOpen, PersonStanding, Scale } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CareerPage() {
  const t = useTranslations('CareerPage');

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Our Roots & Philosophy (intro) */}
      <section className='py-8 sm:py-10 md:py-12'>
        <div className='mx-auto max-w-5xl px-4 text-center sm:px-6'>
          <h2 className='mb-4 text-3xl font-bold text-primary md:text-4xl'>
            {t('roots_title')}
          </h2>
          <p className='mb-8 text-base text-text sm:text-lg md:text-xl'>
            {t('roots_intro')}
          </p>
          <p className='text-end text-xs italic text-text opacity-70 sm:text-sm'>
            {t('roots_signature')}
          </p>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className='bg-surface py-6'>
        <div className='mx-auto px-4 sm:px-6'>
          <h2 className='mb-6 text-center text-3xl font-bold text-primary'>
            {t('why_work_title')}
          </h2>

          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3'>
            {/* Growth & Learning */}
            <div className='flex flex-col items-center text-center'>
              <BookOpen strokeWidth={1} className='mb-2 h-8 w-8 text-primary' />
              <div className='mt-2 text-xl font-extrabold text-secondary'>
                {t('growth_title')}
              </div>
              <div className='mt-1 text-base text-text'>{t('growth_desc')}</div>
            </div>

            {/* Passionate Team */}
            <div className='flex flex-col items-center text-center'>
              <PersonStanding
                strokeWidth={1}
                className='mb-2 h-8 w-8 text-primary'
              />
              <div className='mt-2 text-xl font-extrabold text-secondary'>
                {t('team_title')}
              </div>
              <div className='mt-1 text-base text-text'>{t('team_desc')}</div>
            </div>

            {/* Work-Life Balance */}
            <div className='flex flex-col items-center text-center'>
              <Scale strokeWidth={1} className='mb-2 h-8 w-8 text-primary' />
              <div className='mt-2 text-xl font-extrabold text-secondary'>
                {t('balance_title')}
              </div>
              <div className='mt-1 text-base text-text'>
                {t('balance_desc')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className='py-12'>
        <div className='mx-auto px-4 sm:px-6'>
          <h2 className='mb-6 text-center text-3xl font-bold text-primary'>
            {t('no_positions_title')}
          </h2>
          <p className='mb-6 text-center text-text/70'>
            {t('no_positions_desc1')}
          </p>
          <p className='mb-6 text-center text-text/70'>
            {t('no_positions_desc2')}
          </p>
          <div className='flex justify-center'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-dark transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer'
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
