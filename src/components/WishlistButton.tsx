'use client'

import { useState, useEffect } from 'react'
import { Heart } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { useWishlistStore } from '@/lib/wishlist'
import toast from 'react-hot-toast'

interface WishlistButtonProps {
  book: {
    id: string
    title: string
    slug: string
    author: string
    coverImage: string
    mrp: number
    sellingPrice: number
  }
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function WishlistButton({ book, size = 'md', showLabel = false }: WishlistButtonProps) {
  const t = useTranslations('common')
  const [mounted, setMounted] = useState(false)
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isWishlisted = mounted ? isInWishlist(book.id) : false

  const handleToggle = () => {
    if (isWishlisted) {
      removeItem(book.id)
      toast.success('ವಿಶ್‌ಲಿಸ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ')
    } else {
      addItem(book)
      toast.success('ವಿಶ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ')
    }
  }

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 28 : 22
  const padding = size === 'sm' ? '0.5rem' : size === 'lg' ? '1rem' : '0.75rem'

  return (
    <button
      onClick={handleToggle}
      className={`btn ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
      style={{
        padding: showLabel ? undefined : padding,
        gap: '0.5rem',
        minWidth: showLabel ? undefined : 'auto'
      }}
      aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
      aria-pressed={isWishlisted}
    >
      <Heart 
        size={iconSize} 
        weight={isWishlisted ? 'fill' : 'bold'} 
        style={{ color: isWishlisted ? 'white' : 'currentColor' }}
      />
      {showLabel && (isWishlisted ? t('wishlistAdded') : t('wishlistAdd'))}
    </button>
  )
}
