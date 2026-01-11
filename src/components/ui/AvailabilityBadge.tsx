'use client'

interface AvailabilityBadgeProps {
  availability: 'available' | 'out-of-stock'
  className?: string
}

export default function AvailabilityBadge({
  availability,
  className = '',
}: AvailabilityBadgeProps) {
  const isAvailable = availability === 'available'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isAvailable
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      } ${className}`}
    >
      {isAvailable ? 'Available' : 'Out of Stock'}
    </span>
  )
}
