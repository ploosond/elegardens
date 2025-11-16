'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { RxHeight, RxWidth } from 'react-icons/rx';
import { PiSnowflakeThin } from 'react-icons/pi';
import { IoSunnyOutline } from 'react-icons/io5';
import BackButton from '@/components/ui/BackButton';
import ProductCard from '@/components/cards/ProductCard';
import { useFetchProduct, useFetchProducts } from '@/hooks/useProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations('ProductPage');
  const locale = useLocale();
  const productId = Number(params.id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch current product
  const {
    data: productData,
    isPending: isLoadingProduct,
    isError: isErrorProduct,
  } = useFetchProduct(productId);

  // Fetch all products for related section
  const { data: productsData } = useFetchProducts(1, 1000);

  if (isLoadingProduct) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-text'>{t('loading')}</h2>
      </div>
    );
  }

  if (isErrorProduct || !productData?.data?.product) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-text'>
            {t('product_not_found')}
          </h2>
          <p className='mt-4 text-text/70'>{t('product_not_found_desc')}</p>
          <Link
            href={`/${locale}/products`}
            className='mt-6 inline-block rounded-md bg-primary px-6 py-3 text-on-dark hover:bg-primary-dark'
          >
            {t('back_to_products')}
          </Link>
        </div>
      </div>
    );
  }

  const product = productData.data.product;
  const allProducts = productsData?.data?.products ?? [];

  // Related products (exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  return (
    <div>
      {/* Content Section - unified horizontal spacing */}
      <div className='mx-auto mt-8 px-4 sm:mt-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-24'>
          {/* Image Slider (portrait mode) */}
          <div className='flex flex-col items-start'>
            <BackButton
              href={`/${locale}/products`}
              label={t('back_to_products')}
              className='mb-4'
            />

            {/* Image Gallery */}
            <div className='flex w-full flex-col items-center gap-4'>
              <div className='relative aspect-[2/3] w-full max-h-[480px] overflow-hidden rounded-lg bg-muted'>
                <Image
                  src={
                    product.images[selectedImageIndex]?.url ||
                    '/placeholder.png'
                  }
                  alt={
                    product.images[selectedImageIndex]?.altText ||
                    product.common_name[locale as 'en' | 'de']
                  }
                  fill
                  className='object-cover'
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className='flex gap-2 overflow-x-auto'>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                        idx === selectedImageIndex
                          ? 'border-primary'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `Thumbnail ${idx + 1}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className='flex flex-col'>
            <div className='mb-10'>
              <h1 className='mb-2 font-poppins text-2xl font-semibold text-primary sm:text-3xl'>
                {product.common_name[locale as 'en' | 'de']}
              </h1>
              <hr className='border-muted/60 mb-6 border-0 border-b-2' />
              {/* Product Attributes */}
              <div className='grid w-full grid-cols-2 gap-x-8 gap-y-6 rounded-lg bg-white p-6 shadow-lg sm:grid-cols-2 lg:grid-cols-2'>
                {/* Row 1 */}
                <div className='flex items-center space-x-2'>
                  <RxHeight className='h-8 w-8 rounded bg-muted p-1 text-primary' />
                  <p className='whitespace-nowrap'>{t('height')}</p>
                </div>
                <div className='flex items-center font-semibold text-text'>
                  {product.height ? `${product.height} cm` : '—'}
                </div>

                <div className='flex items-center space-x-2'>
                  <RxWidth className='h-8 w-8 rounded bg-muted p-1 text-primary' />
                  <p className='whitespace-nowrap'>{t('diameter')}</p>
                </div>
                <div className='flex items-center font-semibold text-text'>
                  {product.diameter ? `${product.diameter} cm` : '—'}
                </div>

                {/* Row 2 */}
                <div className='flex items-center space-x-2'>
                  <PiSnowflakeThin className='h-8 w-8 rounded bg-muted p-1 text-primary' />
                  <p className='whitespace-nowrap'>{t('hardy')}</p>
                </div>
                <div className='flex items-center font-semibold text-text'>
                  {product.hardiness ? `${product.hardiness}°C` : '—'}
                </div>

                <div className='flex items-center space-x-2'>
                  <IoSunnyOutline className='h-8 w-8 rounded bg-muted p-1 text-primary' />
                  <p className='whitespace-nowrap'>{t('light')}</p>
                </div>
                <div className='flex items-center font-semibold text-text'>
                  {product.light[locale as 'en' | 'de']}
                </div>
              </div>
            </div>
            <p className='text-justify leading-relaxed text-text'>
              {product.description[locale as 'en' | 'de']}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className='mt-12 bg-white py-8 sm:py-12'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 flex items-end justify-between'>
            <div>
              <h2 className='text-3xl font-bold text-gray-800 md:text-4xl'>
                {t('related_products')}
              </h2>
              <p className='mt-2 text-lg text-gray-600'>
                {t('you_might_also_like')}
              </p>
            </div>
            <Link
              href={`/${locale}/products`}
              className='hidden items-center text-primary transition-colors hover:text-primary-dark md:flex'
            >
              {t('view_all_products')} <ArrowRight size={16} className='ml-2' />
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
            {relatedProducts?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className='mt-8 text-center md:hidden'>
            <Link
              href={`/${locale}/products`}
              className='inline-flex items-center text-primary transition-colors hover:text-primary-dark'
            >
              {t('view_all_products')} <ArrowRight size={16} className='ml-2' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
