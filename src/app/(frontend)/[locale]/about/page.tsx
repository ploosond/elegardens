import Image from 'next/image';
import { useTranslations } from 'next-intl';
import HeroSection from '@/components/ui/HeroSection';
import NewsletterSignupClient from '@/components/ui/NewsletterSignupClient';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Our Roots & Philosophy */}
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

      {/* Milestones */}
      <section className='bg-white px-2 sm:px-4 md:px-10 lg:px-40'>
        <div className='mx-auto max-w-6xl px-0 sm:px-4'>
          <div className='mx-auto mb-10 max-w-3xl text-center'>
            <h2 className='text-3xl font-extrabold text-primary sm:text-4xl md:text-5xl'>
              {t('milestones_title')}
            </h2>
          </div>

          {/* Milestone 1 */}
          <div className='grid grid-cols-1 md:min-h-[20rem] md:grid-cols-2 md:items-center md:gap-12'>
            <div className='relative h-64 w-full overflow-hidden rounded-md md:h-full'>
              <Image
                src='/assets/about_us_001.jpg'
                alt='Milestone 1'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
                priority
              />
            </div>
            <div className='flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 md:px-0'>
              <h3 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
                {t('milestone1_title')}
              </h3>
              <p className='mb-2 text-justify text-sm text-text sm:mb-4 sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone1_sub1')}
                </span>{' '}
                {t('milestone1_desc1')}
              </p>
              <p className='text-justify text-sm text-text sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone1_sub2')}
                </span>{' '}
                {t('milestone1_desc2')}
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className='mt-8 grid grid-cols-1 md:min-h-[20rem] md:grid-cols-2 md:items-center md:gap-12'>
            <div className='order-1 flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 md:order-1 md:px-0'>
              <h3 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
                {t('milestone2_title')}
              </h3>
              <p className='mb-2 text-justify text-sm text-text sm:mb-4 sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone2_sub1')}
                </span>{' '}
                {t('milestone2_desc1')}
              </p>
              <p className='text-justify text-sm text-text sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone2_sub2')}
                </span>{' '}
                {t('milestone2_desc2')}
              </p>
            </div>
            <div className='relative order-2 h-64 w-full overflow-hidden rounded-md md:order-2 md:h-full'>
              <Image
                src='/assets/about_us_002.jpg'
                alt='Milestone 2'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
              />
            </div>
          </div>

          {/* Milestone 3 */}
          <div className='mt-8 grid grid-cols-1 md:min-h-[20rem] md:grid-cols-2 md:items-center md:gap-12'>
            <div className='relative h-64 w-full overflow-hidden rounded-md md:h-full'>
              <Image
                src='/assets/about_us_003.jpg'
                alt='Milestone 3'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
              />
            </div>
            <div className='flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 md:px-0'>
              <h3 className='mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl'>
                {t('milestone3_title')}
              </h3>
              <p className='mb-2 text-justify text-sm text-text sm:mb-4 sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone3_sub1')}
                </span>{' '}
                {t('milestone3_desc1')}
              </p>
              <p className='text-justify text-sm text-text sm:text-base'>
                <span className='font-bold text-text'>
                  {t('milestone3_sub2')}
                </span>{' '}
                {t('milestone3_desc2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO + Mission/Values */}
      <section className='py-10 sm:py-12'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6'>
          <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
            {/* Story / Mission / Vision / Values */}
            <div className='order-2 flex items-center px-2 sm:px-4 md:order-1 md:min-h-[20rem] md:px-0 lg:min-h-[24rem]'>
              <div className='w-full px-4 py-4 sm:px-8 sm:py-6 md:px-0'>
                <h2 className='mb-4 text-3xl font-extrabold text-secondary'>
                  {t('our_story_title')}
                </h2>
                <p className='mb-4 text-justify text-base text-text'>
                  <span className='font-bold text-text'>
                    {t('our_mission')}
                  </span>{' '}
                  {t('our_mission_desc')}
                </p>
                <p className='mb-4 text-justify text-base text-text'>
                  <span className='font-bold text-text'>{t('our_vision')}</span>{' '}
                  {t('our_vision_desc')}
                </p>
                <p className='text-justify text-base text-text'>
                  <span className='font-bold'>{t('our_values')}</span> —{' '}
                  {t('our_values_desc')}
                </p>
              </div>
            </div>

            {/* CEO Image */}
            <div className='relative order-1 min-h-[20rem] overflow-hidden rounded-md md:order-2 lg:min-h-[24rem]'>
              <Image
                src='/assets/ceo.jpg'
                alt='Founding CEO'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
                priority={false}
              />
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-black/10' />
              <div className='absolute bottom-6 left-6 w-[calc(100%-3rem)] text-on-dark md:w-auto'>
                <h3 className='text-lg font-bold'>{t('ceo_title')}</h3>
                <p className='mt-1 text-sm'>{t('ceo_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter could be added later once component is ready */}
      <section className='py-2 sm:py-4'>
        <div className='mx-auto max-w-6xl px-2 sm:px-4'>
          <NewsletterSignupClient />
        </div>
      </section>
    </div>
  );
}
