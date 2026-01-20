'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  maxQuantity: number
  onQuantityChange: (quantity: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
  size = 'md'
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }
  
  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onQuantityChange(value)
    }
  }
  
  const buttonSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40
  const inputWidth = size === 'sm' ? 40 : size === 'lg' ? 80 : 60
  
  return (
    <div className="quantity-selector" style={{
      display: 'flex',
      alignItems: 'center',
      border: '2px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="quantity-btn"
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-alt)',
          border: 'none',
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          opacity: quantity <= 1 ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 14 : 18} />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={maxQuantity}
        className="quantity-input"
        style={{
          width: inputWidth,
          height: buttonSize,
          border: 'none',
          textAlign: 'center',
          fontSize: size === 'sm' ? '0.875rem' : '1rem',
          fontWeight: 600,
          background: 'transparent'
        }}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        className="quantity-btn"
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-alt)',
          border: 'none',
          cursor: quantity >= maxQuantity ? 'not-allowed' : 'pointer',
          opacity: quantity >= maxQuantity ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 14 : 18} />
      </button>
    </div>
  )
}
