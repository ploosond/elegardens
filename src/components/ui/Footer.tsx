'use client';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoLogoInstagram } from 'react-icons/io';
import { IoLogoYoutube } from 'react-icons/io';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer>
      <div className='font-outfit font-medium mx-auto bg-gradient-to-l from-primary-dark to-primary px-4 pb-4 pt-16 text-on-dark sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4 lg:col-span-2'>
            <h3 className=' text-3xl '>{t('brand')}</h3>
            <p className=' md:max-w-md'>{t('description')}</p>
          </div>

          <div>
            <h4 className='mb-4 text-lg '>{t('quick_links')}</h4>
            <ul className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
              <li>
                <Link href='/' className=' transition-colors hover:text-accent'>
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className=' transition-colors hover:text-accent'
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className=' transition-colors hover:text-accent'
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href='/teams'
                  className=' transition-colors hover:text-accent'
                >
                  {t('teams')}
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className=' transition-colors hover:text-accent'
                >
                  {t('contact_us')}
                </Link>
              </li>
              <li>
                <Link
                  href='/career'
                  className=' transition-colors hover:text-accent'
                >
                  {t('careers')}
                </Link>
              </li>
              <li>
                <Link
                  href='/projects'
                  className=' transition-colors hover:text-accent'
                >
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link
                  href='/policy'
                  className=' transition-colors hover:text-accent'
                >
                  {t('privacy_policy')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-4 text-lg font-medium'>{t('contact_us')}</h4>
            <ul className='space-y-4'>
              <li className='flex items-start'>
                <MapPin size={20} className=' mr-2  flex-shrink-0' />
                <span>{t('address')}</span>
              </li>
              <li className='flex items-center'>
                <Mail size={20} className=' mr-2 flex-shrink-0' />
                <a href='mailto:info@gardenoasis.com'>{t('email')}</a>
              </li>
              <li className='flex items-center'>
                <Phone size={20} className='mr-2  flex-shrink-0' />
                <a href='tel:+49282691500'>{t('phone')}</a>
              </li>
            </ul>
            {/* Socials under Contact Us */}
            <div className='mt-4 flex space-x-4'>
              <a
                href='#'
                className='p-2 transition-colors hover:text-accent'
                aria-label='Facebook'
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href='#'
                className='p-2 transition-colors hover:text-accent'
                aria-label='Twitter'
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href='#'
                className='p-2 transition-colors hover:text-accent'
                aria-label='Instagram'
              >
                <IoLogoInstagram size={20} />
              </a>
              <a
                href='#'
                className='p-2 transition-colors hover:text-accent'
                aria-label='Instagram'
              >
                <IoLogoYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className='border-on-dark/10 mt-12 border-t pt-8 text-center'>
          <p className='text-on-dark/70 text-sm'>
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
