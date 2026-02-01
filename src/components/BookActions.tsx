'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Share2, AlertCircle, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import QuantitySelector from './QuantitySelector'
import { useCartStore } from '@/lib/store'
import type { Book } from '@/lib/types'

interface BookActionsProps {
  book: Book
}

// Track book view on mount (fire and forget, non-blocking)
function useTrackView(slug: string) {
  useEffect(() => {
    // Use sendBeacon for non-blocking, reliable tracking
    // This works even if user navigates away immediately
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      navigator.sendBeacon(`/api/books/${slug}/view`)
    } else {
      // Fallback for older browsers
      fetch(`/api/books/${slug}/view`, { 
        method: 'POST',
        keepalive: true 
      }).catch(() => {
        // Ignore errors - view tracking is not critical
      })
    }
  }, [slug])
}

export default function BookActions({ book }: BookActionsProps) {
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  
  // Track view (non-blocking, rate-limited on server)
  useTrackView(book.slug)
  
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const isOutOfStock = book.stockQuantity <= 0
  const isLowStock = book.stockQuantity > 0 && book.stockQuantity <= (book.lowStockAlert || 10)

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('ಈ ಪುಸ್ತಕ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ')
      return
    }
    
    setIsAddingToCart(true)
    
    // Batch add to cart
    addItem(book, quantity)
    
    toast.success(`${quantity} ಪುಸ್ತಕಗಳನ್ನು ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!`)
    
    setTimeout(() => setIsAddingToCart(false), 500)
  }
  
  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `${book.title} - ${book.author}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!')
    }
  }

  return (
    <>
      {/* Stock Status */}
      <div style={{ marginBottom: '1.5rem' }}>
        {isOutOfStock ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--color-error)'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ</span>
          </div>
        ) : isLowStock ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--color-warning)'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>ಕೇವಲ {book.stockQuantity} ಬಾಕಿ!</span>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--color-success)'
          }}>
            <Check size={20} />
            <span style={{ fontWeight: 500 }}>ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ (ಲಭ್ಯವಿದೆ)</span>
          </div>
        )}
      </div>
      
      {/* Quantity & Add to Cart */}
      {!isOutOfStock && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            ಪ್ರಮಾಣ
          </label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <QuantitySelector
              quantity={quantity}
              maxQuantity={book.stockQuantity}
              onQuantityChange={setQuantity}
            />
          </div>
        </div>
      )}
      
      {/* Main Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="btn btn-outline btn-lg"
          style={{ flex: 1, minWidth: '200px' }}
        >
          <ShoppingCart size={20} />
          ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="btn btn-primary btn-lg"
          style={{ flex: 1, minWidth: '200px' }}
        >
          ಈಗಲೇ ಖರೀದಿಸಿ
        </button>
      </div>

        {/* Secondary Actions */}
        <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1rem'
        }}>
            <button
            className="btn btn-ghost"
            style={{ flex: 1, border: '1px solid var(--color-border)' }}
            onClick={() => toast.success('ಇಚ್ಛೆಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!')}
            >
            <Heart size={18} />
            ಇಚ್ಛೆಪಟ್ಟಿ
            </button>
            <button
            className="btn btn-ghost"
            style={{ flex: 1, border: '1px solid var(--color-border)' }}
            onClick={handleShare}
            >
            <Share2 size={18} />
            ಹಂಚಿಕೊಳ್ಳಿ
            </button>
        </div>
    </>
  )
}
