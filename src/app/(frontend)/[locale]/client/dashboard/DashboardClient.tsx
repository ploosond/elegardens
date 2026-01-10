'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import type { Client } from '@/payload-types'
import { LogOut, Building2, Mail, Phone, MapPin } from 'lucide-react'

interface DashboardClientProps {
  client: Client
  locale: string
}

export default function DashboardClient({ client, locale }: DashboardClientProps) {
  const t = useTranslations('ClientDashboard')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/client/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('client_user')
        // Redirect to login
        router.push('/client/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if logout fails
      localStorage.removeItem('client_user')
      router.push('/client/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">{t('title')}</h1>
            <p className="mt-2 text-text/70">
              {t('welcome')}, {client.companyName}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            loading={loading}
            variant="secondary"
            icon={<LogOut className="h-4 w-4" />}
          >
            {t('logout')}
          </Button>
        </div>

        {/* Client Info Card */}
        <div className="mb-8 rounded-lg border border-muted bg-bg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-text">Account Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-text/70">Company Name</p>
                <p className="text-text">{client.companyName}</p>
              </div>
            </div>
            {client.contactPerson && (
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-text/70">Contact Person</p>
                  <p className="text-text">{client.contactPerson}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-text/70">Email</p>
                <p className="text-text">{client.email}</p>
              </div>
            </div>
            {client.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-text/70">Phone</p>
                  <p className="text-text">{client.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-text/70">Address</p>
                <p className="text-text whitespace-pre-line">{client.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-medium text-text/70">Client ID</p>
                <p className="text-text font-mono">{client.clientId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-medium text-text/70">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    client.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {client.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-muted bg-bg p-6 shadow">
            <h3 className="mb-2 text-lg font-semibold text-text">Products</h3>
            <p className="mb-4 text-sm text-text/70">
              Browse our product catalog and add items to your cart
            </p>
            <Button
              onClick={() => router.push('/products')}
              variant="primary"
              className="w-full"
            >
              View Products
            </Button>
          </div>
          <div className="rounded-lg border border-muted bg-bg p-6 shadow">
            <h3 className="mb-2 text-lg font-semibold text-text">Cart</h3>
            <p className="mb-4 text-sm text-text/70">
              Review your cart and submit your order request
            </p>
            <Button
              onClick={() => router.push('/client/cart')}
              variant="primary"
              className="w-full"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
