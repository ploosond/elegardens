import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import ConsentManager from '@/components/ui/ConsentManager'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'

const raleway = Raleway({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ele Gardens – BIO-Certified Perennials, Sustainable Horticulture & Garden Design',
  description:
    'Ele Gardens blends generations of horticultural expertise with sustainable innovation. We cultivate BIO-certified perennials that support biodiversity, delight customers, and perform reliably in gardens and retail. Discover our legacy, values, and commitment to a greener future.',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <ConsentManager>{children}</ConsentManager>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
