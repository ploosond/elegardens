'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Product } from '@/payload-types'
import QuantityInput from '@/components/ui/QuantityInput'
import AvailabilityBadge from '@/components/ui/AvailabilityBadge'
import Button from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'

interface B2BProductRowProps {
  product: Product
}

export default function B2BProductRow({ product }: B2BProductRowProps) {
  const t = useTranslations('B2BProducts')
  const { items, addItem, updateQuantity } = useCart()
  const [localQuantity, setLocalQuantity] = useState(0)

  // Find if product is already in cart
  const cartItem = items.find((item) => item.product.id === product.id)
  const cartQuantity = cartItem?.quantity || 0

  // Sync local quantity with cart quantity
  useEffect(() => {
    setLocalQuantity(cartQuantity)
  }, [cartQuantity])

  const handleQuantityChange = (newQuantity: number) => {
    setLocalQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (localQuantity > 0) {
      if (cartItem) {
        // Update existing item
        updateQuantity(product.id, localQuantity)
      } else {
        // Add new item
        addItem(product, localQuantity)
      }
    } else if (cartItem && localQuantity === 0) {
      // Remove from cart
      updateQuantity(product.id, 0)
    }
  }

  const isOutOfStock = product.availability === 'out-of-stock'
  const hasQuantity = localQuantity > 0 || cartQuantity > 0

  return (
    <tr
      className={`border-b border-muted transition-colors ${
        hasQuantity ? 'bg-primary/5' : 'bg-bg hover:bg-muted/50'
      }`}
    >
      <td className="px-4 py-3">
        <span className="font-mono text-sm font-semibold text-text">
          {product.productId || `#${product.id}`}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-text">{product.common_name || 'Unnamed Product'}</span>
      </td>
      <td className="px-4 py-3">
        <AvailabilityBadge availability={product.availability || 'available'} />
      </td>
      <td className="px-4 py-3">
        <QuantityInput
          value={localQuantity}
          onChange={handleQuantityChange}
          min={0}
          disabled={isOutOfStock}
          className="justify-center"
        />
      </td>
      <td className="px-4 py-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || localQuantity === 0}
          variant={cartQuantity > 0 ? 'secondary' : 'primary'}
          className="min-w-[120px]"
        >
          {cartQuantity > 0 ? t('update_cart') : t('add_to_cart')}
        </Button>
      </td>
    </tr>
  )
}
