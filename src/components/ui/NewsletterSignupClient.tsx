'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterSignupClient({
  className = '',
}: {
  className?: string;
}) {
  const t = useTranslations('NewsletterSection');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setMessage('');

    const isValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setStatus('error');
      setMessage(t('error_invalid'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, consent: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      if (data && data.message === 'Already subscribed') {
        setStatus('success');
        setMessage(t('success_already'));
      } else {
        setStatus('success');
        setMessage(t('success'));
        setEmail('');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || t('error_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      <div className='relative overflow-hidden rounded-md shadow-lg'>
        <div className='bg-secondary px-4 py-6 sm:px-8 sm:py-6'>
          <div className='mx-auto flex w-full flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between'>
            <div className='md:max-w-2xl'>
              <span className='mb-1 inline-flex items-center rounded-full bg-surface px-3 py-1 text-sm font-medium text-text'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mr-2 h-4 w-4 text-primary'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                {t('stay_connected')}
              </span>

              <h2 className='mt-2 text-2xl font-extrabold text-on-dark sm:text-3xl'>
                {t('title')}
              </h2>
              <p className='mt-1 text-sm text-on-dark/80'>{t('description')}</p>
            </div>

            <form onSubmit={handleSubmit} className='w-full md:w-auto'>
              <div className='relative mt-2 flex w-full items-center justify-center md:mt-0'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  className='w-full min-w-[320px] rounded-full bg-surface px-5 py-3 pr-28 text-sm text-text shadow-inner placeholder:text-muted'
                  aria-label='Email address'
                  required
                />

                <button
                  type='submit'
                  disabled={loading}
                  className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-dark transition-colors hover:bg-primary-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer'
                >
                  {loading ? t('button_sending') : t('button_subscribe')}
                </button>
              </div>
            </form>
          </div>

          {status === 'success' && (
            <div
              className='mt-4 text-center text-sm text-green-200'
              role='status'
            >
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className='mt-4 text-center text-sm text-red-200' role='alert'>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
