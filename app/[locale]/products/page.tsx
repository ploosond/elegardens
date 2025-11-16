'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from '@/components/ui/HeroSection';
import ProductCard from '@/components/cards/ProductCard';
import { useFetchProducts } from '@/hooks/useProducts';
import { useLocale, useTranslations } from 'next-intl';
import SearchInput from '@/components/ui/SearchInput';
import type { ProductDto } from '@/types/dto/product.dto';
import { useDebounce } from '@/hooks/useDebounce';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const t = useTranslations('ProductsPage');
  const locale = useLocale();

  // Pagination + Search
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const limit = 1000; // Fetch all products at once

  // Fetch all products
  const {
    isPending: isPendingProducts,
    isError: isErrorProducts,
    data: productsData,
    error: errorProducts,
  } = useFetchProducts(1, limit);

  const allProducts: ProductDto[] = useMemo(
    () => productsData?.data?.products ?? [],
    [productsData]
  );

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return allProducts;
    const term = debouncedSearch.toLowerCase();
    return allProducts.filter((product) => {
      const en = (product.common_name?.en || '').toString().toLowerCase();
      const de = (product.common_name?.de || '').toString().toLowerCase();
      return en.includes(term) || de.includes(term);
    });
  }, [debouncedSearch, allProducts]);

  // Client-side pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate visible page numbers (max 3)
  const visiblePages = useMemo(() => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page === 1) return [1, 2, 3];
    if (page === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1];
  }, [page, totalPages]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearch) setPage(1);
  }, [debouncedSearch]);

  // Loading / Error
  if (isPendingProducts) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-text'>{t('loading')}</h2>
      </div>
    );
  }

  if (isErrorProducts) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <h2 className='text-2xl font-semibold text-danger'>
          {t('error')}: {errorProducts?.message}
        </h2>
      </div>
    );
  }

  // Page
  return (
    <div>
      <HeroSection
        title={t('hero_title')}
        highlight={t('hero_highlight')}
        description={t('hero_description')}
      />

      {/* Search input */}
      <div className='bg-gradient-to-r from-primary-dark to-primary pb-6'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
          />
        </div>
      </div>

      {/* Products Section */}
      <section className='bg-white py-2 sm:py-4'>
        <div className='mx-auto mt-0 px-4 sm:mt-0 sm:px-6'>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='w-full'>
              {/* Item count summary */}
              <div className='mb-4 flex items-center justify-between text-sm text-text'>
                {searchTerm ? (
                  <span>
                    {t('results', { count: filteredProducts.length })}
                  </span>
                ) : (
                  <span>
                    {t('showing', {
                      from: startIndex + 1,
                      to: Math.min(endIndex, filteredProducts.length),
                      total: filteredProducts.length,
                    })}
                  </span>
                )}
              </div>
              {filteredProducts.length === 0 ? (
                <div className='rounded-lg bg-muted py-12 text-center'>
                  <h3 className='mb-2 text-xl font-medium'>
                    {t('no_products_title')}
                  </h3>
                  <p className='mb-4 text-text/70'>{t('no_products_desc')}</p>
                  <Button onClick={() => setSearchTerm('')}>
                    {t('clear_filters')}
                  </Button>
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-2 gap-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination Controls (hidden when searching) */}
                  {!searchTerm && totalPages > 1 && (
                    <div className='mt-8 flex items-center justify-center gap-2'>
                      <Button
                        variant='secondary'
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label='Previous page'
                        className='px-4 py-2'
                        icon={<ChevronLeft className='h-4 w-4' />}
                      >
                        {t('prev')}
                      </Button>
                      {visiblePages.map((p) => (
                        <Button
                          key={p}
                          variant={p === page ? 'primary' : 'secondary'}
                          onClick={() => setPage(p)}
                          aria-current={p === page ? 'page' : undefined}
                          className='px-4 py-2'
                        >
                          {p}
                        </Button>
                      ))}
                      <Button
                        variant='secondary'
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages}
                        aria-label='Next page'
                        className='px-4 py-2'
                      >
                        {t('next')}
                        <ChevronRight className='h-4 w-4 ml-2' />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
