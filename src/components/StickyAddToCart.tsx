'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StickyAddToCartProps {
  bookTitle: string
  price: number
  mrp: number
  isOutOfStock: boolean
  onAddToCart: () => void
  onBuyNow: () => void
}

export default function StickyAddToCart({
  bookTitle,
  price,
  mrp,
  isOutOfStock,
  onAddToCart,
  onBuyNow
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    
    const handleScroll = () => {
      // Show after scrolling past the main action buttons (approx 500px)
      setIsVisible(window.scrollY > 500)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  if (!mounted || !isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid var(--color-border)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
      padding: '0.75rem 1rem',
      zIndex: 999,
      animation: 'slideUp 0.3s ease-out',
      display: 'none'
    }} className="show-mobile-flex">
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .show-mobile-flex { display: flex !important; }
        }
      `}</style>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '1rem'
      }}>
        {/* Book Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '0.25rem'
          }}>
            {bookTitle}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              {formatCurrency(price)}
            </span>
            {mrp > price && (
              <span style={{
                fontSize: '0.75rem',
                textDecoration: 'line-through',
                color: 'var(--color-text-muted)'
              }}>
                {formatCurrency(mrp)}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-primary)',
              background: 'white',
              color: 'var(--color-primary)',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.5 : 1
            }}
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={onBuyNow}
            disabled={isOutOfStock}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1.25rem',
              height: 44,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: 'white',
              fontWeight: 600,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.5 : 1
            }}
          >
            <Zap size={18} />
            ಈಗಲೇ ಖರೀದಿಸಿ
          </button>
        </div>
      </div>
    </div>
  )
}
