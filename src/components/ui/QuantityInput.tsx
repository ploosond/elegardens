'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

export default function QuantityInput({
  value,
  onChange,
  min = 0,
  max,
  disabled = false,
  className = '',
}: QuantityInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleIncrement = () => {
    if (disabled) return
    const newValue = max !== undefined ? Math.min(value + 1, max) : value + 1
    onChange(newValue)
  }

  const handleDecrement = () => {
    if (disabled) return
    const newValue = Math.max(value - 1, min)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value
    setInputValue(inputVal)

    // Allow empty input while typing
    if (inputVal === '') {
      return
    }

    const numValue = parseInt(inputVal, 10)
    if (!isNaN(numValue)) {
      let finalValue = Math.max(numValue, min)
      if (max !== undefined) {
        finalValue = Math.min(finalValue, max)
      }
      onChange(finalValue)
    }
  }

  const handleBlur = () => {
    // Ensure value is valid on blur
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      setInputValue(value.toString())
    } else {
      let finalValue = parseInt(inputValue, 10)
      finalValue = Math.max(finalValue, min)
      if (max !== undefined) {
        finalValue = Math.min(finalValue, max)
      }
      onChange(finalValue)
      setInputValue(finalValue.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleIncrement()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleDecrement()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="flex h-10 w-10 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        min={min}
        max={max}
        className="h-10 w-20 rounded border border-muted bg-bg px-3 text-center text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        className="flex h-10 w-10 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
