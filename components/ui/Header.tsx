'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Languages, Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentLocale = useLocale();
  const nextLocale = currentLocale === 'de' ? 'en' : 'de';

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('products'), href: '/products' },
    { name: t('projects'), href: '/projects' },
    { name: t('teams'), href: '/teams' },
  ];

  return (
    <>
      <header className='fixed left-0 right-0 top-0 z-50 bg-bg shadow'>
        <div className='relative mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center'>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='flex items-center rounded-md border border-muted p-2 text-text transition hover:bg-muted focus:outline-none md:col-start-1 md:hidden'
              aria-label='Toggle navigation menu'
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Logo - centered on mobile, left on desktop */}
            <Link href='/'>
              <Image
                src='/assets/logo.png'
                alt='Logo'
                width={120}
                height={40}
                priority
                className='h-10 w-auto md:h-12'
              />
            </Link>

            {/* Desktop navigation */}
            <nav className='hidden items-center gap-1 md:col-start-2 md:flex md:justify-self-center'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='group relative inline-block overflow-hidden rounded-full border border-transparent px-3 py-2  text-sm font-semibold uppercase text-text transition-all duration-300 hover:border-muted'
                  onClick={() => setMenuOpen(false)}
                >
                  <span className='relative z-10'>{item.name}</span>
                  <span className='absolute inset-0 z-0 rounded-full bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className='mr-2 flex items-center space-x-2 md:col-start-3 md:mr-0 md:justify-self-end'>
              {/* Language toggle */}
              <Link
                href={pathname || '/'}
                locale={nextLocale}
                className='group flex items-center gap-1 rounded-full bg-muted px-3 py-1.5  text-xs font-semibold text-text transition hover:bg-muted/80'
                title={t('languageSwitcher')}
              >
                <Languages size={16} />
                <span className='tracking-wide'>
                  {nextLocale === 'de' ? 'DEU' : 'ENG'}
                </span>
              </Link>

              {/* Contact button */}
              <Link
                href='/contact'
                className='group relative ml-2 hidden items-center gap-2 overflow-hidden rounded-full border border-primary px-4 py-1.5  transition-all duration-300 lg:flex'
              >
                <span className='relative z-10 flex items-center gap-2 text-sm font-semibold text-text'>
                  {t('contact')}
                  <ArrowUpRight
                    size={18}
                    className='transition-transform duration-300 group-hover:translate-x-1'
                  />
                </span>
                <span className='absolute inset-0 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden ${
            menuOpen ? 'block' : 'hidden'
          } space-y-2 border-t bg-bg py-3`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='block px-6 py-2  text-sm font-semibold uppercase text-text hover:bg-muted'
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>

      <div className='h-16' aria-hidden='true' />
    </>
  );
}
