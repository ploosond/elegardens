import HeroSection from '@/components/ui/HeroSection';
import ContactForm from '@/components/ui/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Contact Info & Form */}
      <section className='py-12 sm:py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            {/* Contact Information */}
            <div className='mx-auto w-full'>
              <h2 className='text-3xl font-semibold text-text'>
                {t('contact_us')}
              </h2>
              <p className='mt-2 text-text opacity-70'>
                {t('contact_us_desc')}
              </p>

              <div className='mt-8 space-y-6'>
                <div className='flex items-start'>
                  <MapPin size={24} className='mr-4 shrink-0 text-primary' />
                  <div>
                    <h3 className='font-medium text-text'>
                      {t('location_title')}
                    </h3>
                    <p className='text-text opacity-70'>
                      {t('location_address1')}
                    </p>
                    <p className='text-text opacity-70'>
                      {t('location_address2')}
                    </p>
                    <p className='text-text opacity-70'>
                      {t('location_address3')}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Phone size={24} className='mr-4 shrink-0 text-primary' />
                  <div>
                    <h3 className='font-medium text-text'>
                      {t('phone_title')}
                    </h3>
                    <p>
                      <a
                        href='tel:+49282691500'
                        className='text-text opacity-70 transition-colors hover:text-primary'
                      >
                        {t('phone_number')}
                      </a>
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Mail size={24} className='mr-4 shrink-0 text-primary' />
                  <div>
                    <h3 className='font-medium text-text'>
                      {t('email_title')}
                    </h3>
                    <p>
                      <a
                        href='mailto:info@elegardens.com'
                        className='text-text opacity-70 transition-colors hover:text-primary'
                      >
                        {t('email_address')}
                      </a>
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Clock size={24} className='mr-4 shrink-0 text-primary' />
                  <div>
                    <h3 className='font-medium text-text'>
                      {t('hours_title')}
                    </h3>
                    <p className='text-text opacity-70'>{t('hours_value')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
