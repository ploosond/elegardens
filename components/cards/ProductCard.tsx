'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ProductDto } from '@/types/dto/product.dto';

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('ProductCard');

  return (
    <div className='group flex h-full flex-col overflow-hidden rounded-sm border border-muted/10 bg-white/5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-muted/20 hover:shadow-lg'>
      <div className='relative overflow-hidden'>
        <Image
          src={product.images[0]?.url}
          alt={product.common_name?.[locale as 'en' | 'de']}
          width={400}
          height={400}
          className='h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-80'
        />
      </div>
      <div
        className='flex h-32 flex-col justify-between overflow-hidden p-2 text-left md:h-32 md:p-3'
        style={{
          backgroundColor: product.color,
        }}
      >
        <div>
          {locale === 'de' ? (
            <>
              <p className='line-clamp-2 text-sm font-black tracking-tight text-on-dark md:text-base'>
                {product.common_name?.de}
              </p>
              <p className='line-clamp-1 text-xs italic text-on-dark md:text-sm'>
                {product.common_name?.en}
              </p>
            </>
          ) : (
            <>
              <p className='line-clamp-2 text-sm font-black tracking-tight text-on-dark md:text-base'>
                {product.common_name?.en}
              </p>
              <p className='line-clamp-1 text-xs italic text-on-dark md:text-sm'>
                {product.common_name?.de}
              </p>
            </>
          )}
        </div>
        {/* CTAs */}
        <div className='mt-2 grid grid-cols-2 gap-2'>
          <span
            aria-hidden='true'
            className='inline-flex w-full items-center justify-center rounded-full border-2 border-on-dark/60 px-4 py-1 text-sm font-semibold text-on-dark/90 opacity-0 transition-colors hover:bg-white/15'
          >
            {t('buy')}
          </span>
          <a
            href={`/${locale}/products/${product.id}`}
            className='inline-flex w-full cursor-pointer items-center justify-center rounded-full border-2 border-on-dark/60 px-4 py-1 text-sm font-semibold text-on-dark/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark/50'
          >
            {t('details')}
          </a>
        </div>
      </div>
    </div>
  );
}
