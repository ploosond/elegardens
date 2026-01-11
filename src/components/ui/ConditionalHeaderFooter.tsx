'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalHeaderFooter({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Check if route is a client route (with or without locale prefix)
  const isClientRoute = pathname?.includes('/client')

  return (
    <>
      {!isClientRoute && <Header />}
      {children}
      {!isClientRoute && <Footer />}
    </>
  )
}
