'use client';

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from '@c15t/nextjs';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ConsentManager({ children }: { children: ReactNode }) {
  const t = useTranslations('CookieConsent');

  return (
    <ConsentManagerProvider
      options={{
        mode: 'offline',
        consentCategories: ['necessary', 'marketing'],
        ignoreGeoLocation: true, // Useful for development to always view the banner.
      }}
    >
      <CookieBanner
        title={t('title')}
        description={
          <>
            {t('description')}{' '}
            <Link href='/policy' className='underline hover:text-primary '>
              {t('privacyPolicy')}
            </Link>
            .
          </>
        }
        acceptButtonText={t('acceptAll')}
        rejectButtonText={t('rejectAll')}
        customizeButtonText={t('customize')}
      />
      <ConsentManagerDialog />
      {children}
    </ConsentManagerProvider>
  );
}
