'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Client } from '@/payload-types'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

interface CartClientProps {
  client: Client
  locale: string
}

interface CartItem {
  product: {
    id: number
    common_name?: string
    productId?: string
    slug?: string
    images?: any[]
  }
  quantity: number
}

export default function CartClient({ client, locale }: CartClientProps) {
  const t = useTranslations('ClientCart')
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('client_cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCartItems(parsed)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }, [])

  // Listen for cart updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'client_cart') {
        try {
          const stored = localStorage.getItem('client_cart')
          if (stored) {
            const parsed = JSON.parse(stored)
            setCartItems(parsed)
          } else {
            setCartItems([])
          }
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    const handleCartUpdate = () => {
      try {
        const stored = localStorage.getItem('client_cart')
        if (stored) {
          const parsed = JSON.parse(stored)
          setCartItems(parsed)
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
      localStorage.setItem('client_cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('cartUpdated'))
      return updated
    })
  }

  const removeItem = (productId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId)
      localStorage.setItem('client_cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('cartUpdated'))
      return updated
    })
  }

  const getProductImage = (item: CartItem) => {
    if (item.product.images && item.product.images.length > 0) {
      const firstImage = item.product.images[0]
      if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
        return firstImage.url
      }
    }
    return '/place_holder.png'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        client: client.id,
        companyName: client.companyName,
        deliveryDate,
        items: cartItems.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        notes: notes || undefined,
        status: 'pending',
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit order')
      }

      // Clear cart
      localStorage.removeItem('client_cart')
      window.dispatchEvent(new Event('cartUpdated'))

      // Redirect to orders page or success page
      router.push('/client/orders')
    } catch (error: any) {
      console.error('Order submission error:', error)
      alert(error.message || t('submit_error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="rounded-lg border border-muted bg-bg p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-text/40" />
          <h3 className="mb-2 text-xl font-medium">{t('empty_title')}</h3>
          <p className="mb-4 text-text/70">{t('empty_desc')}</p>
          <Button onClick={() => router.push('/client/products')} variant="primary">
            {t('browse_products')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 rounded-lg border border-muted bg-bg p-4 shadow"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={getProductImage(item)}
                  alt={item.product.common_name || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text">
                      {item.product.common_name || 'Product'}
                    </h3>
                    {item.product.productId && (
                      <p className="text-sm text-text/70">ID: {item.product.productId}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={t('remove_item')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text/70">{t('quantity')}:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted"
                      aria-label={t('decrease_quantity')}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted"
                      aria-label={t('increase_quantity')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="rounded-lg border border-muted bg-bg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-text">{t('order_details')}</h2>
          <div className="space-y-4">
            <div>
              <Input
                type="date"
                label={t('delivery_date_label')}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                {t('notes_label')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t('notes_placeholder')}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" loading={submitting} variant="primary" className="min-w-[200px]">
            {t('submit_order')}
          </Button>
        </div>
      </form>
    </div>
  )
}
