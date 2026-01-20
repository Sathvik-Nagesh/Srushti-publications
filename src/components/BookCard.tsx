'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import type { Book } from '@/lib/types'
import toast from 'react-hot-toast'

interface BookCardProps {
  book: Book
  showQuickAdd?: boolean
}

export default function BookCard({ book, showQuickAdd = true }: BookCardProps) {
  const addItem = useCartStore(state => state.addItem)
  
  const discountPercentage = calculateDiscountPercentage(book.mrp, book.sellingPrice)
  const isOutOfStock = book.stockQuantity <= 0
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOutOfStock) {
      toast.error('ಈ ಪುಸ್ತಕ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ')
      return
    }
    
    addItem(book)
    toast.success('ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!')
  }
  
  return (
    <Link href={`/books/${book.slug}`} className="book-card">
      {/* Cover Image */}
      <div className="book-card-image">
        <Image
          src={book.coverImage || '/placeholder-book.jpg'}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Badges */}
        <div className="book-card-badges">
          {book.isNewRelease && (
            <span className="badge badge-new">ಹೊಸ</span>
          )}
          {book.isBestSeller && (
            <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
          )}
          {book.isOnSale && discountPercentage > 0 && (
            <span className="badge badge-sale">{discountPercentage}% ರಿಯಾಯಿತಿ</span>
          )}
        </div>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              background: 'white',
              color: 'var(--color-text)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600
            }}>
              ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ
            </span>
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        {showQuickAdd && !isOutOfStock && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            display: 'flex',
            gap: '0.5rem',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
          className="book-card-actions">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <ShoppingCart size={16} />
              ಕಾರ್ಟ್‌ಗೆ
            </button>
            <button
              className="btn btn-outline btn-sm"
              style={{ 
                background: 'white',
                color: 'var(--color-text)'
              }}
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Book Details */}
      <div className="card-body">
        {/* Category */}
        {book.category && (
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--color-primary)',
            fontWeight: 500
          }}>
            {book.category.name}
          </span>
        )}
        
        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginTop: '0.25rem',
          marginBottom: '0.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {book.title}
        </h3>
        
        {/* Author */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-light)',
          marginBottom: '0.75rem'
        }}>
          {book.author}
        </p>
        
        {/* Price */}
        <div className="price-group">
          <span className="price-current">
            {formatCurrency(book.sellingPrice)}
          </span>
          {book.mrp > book.sellingPrice && (
            <>
              <span className="price-original">
                {formatCurrency(book.mrp)}
              </span>
              <span className="price-discount">
                {discountPercentage}% ಉಳಿತಾಯ
              </span>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .book-card:hover .book-card-actions {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  )
}
