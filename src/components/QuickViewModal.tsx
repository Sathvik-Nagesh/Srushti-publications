'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Share2, Eye, ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import type { Book } from '@/lib/types'
import toast from 'react-hot-toast'

interface QuickViewModalProps {
  book: Book
  onClose: () => void
}

export default function QuickViewModal({ book, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const addItem = useCartStore(state => state.addItem)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  const discountPercentage = calculateDiscountPercentage(book.mrp, book.sellingPrice)
  const isOutOfStock = book.stockQuantity <= 0
  const isLowStock = book.stockQuantity > 0 && book.stockQuantity <= 5
  
  const allImages = [book.coverImage, ...(book.additionalImages || [])].filter(Boolean)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Focus the close button on mount for accessibility
    closeButtonRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('ಈ ಪುಸ್ತಕ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ')
      return
    }
    addItem(book, quantity)
    toast.success(`${quantity} ಐಟಂ(ಗಳು) ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!`)
    onClose()
  }
  
  const handleShare = async () => {
    const url = `${window.location.origin}/books/${book.slug}`
    if (navigator.share) {
      await navigator.share({ title: book.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!')
    }
  }
  
  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          animation: 'scaleIn 0.3s ease'
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="ಮುಚ್ಚಿ"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}>
          {/* Image Section */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '0.75',
              background: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              <Image
                src={allImages[currentImageIndex] || '/placeholder-book.jpg'}
                alt={book.title}
                fill
                style={{ objectFit: 'contain' }}
                sizes="400px"
              />
              
              {/* Badges */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {book.isNewRelease && <span className="badge badge-new">ಹೊಸ</span>}
                {book.isBestSeller && <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>}
                {discountPercentage > 0 && <span className="badge badge-sale">{discountPercentage}% ರಿಯಾಯಿತಿ</span>}
              </div>
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => prev === 0 ? allImages.length - 1 : prev - 1)}
                    style={{
                      position: 'absolute',
                      left: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => prev === allImages.length - 1 ? 0 : prev + 1)}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      width: '50px',
                      height: '65px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: idx === currentImageIndex ? '2px solid var(--color-primary)' : '2px solid transparent',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="50px" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Category */}
            {book.category && (
              <span style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {book.category.name}
              </span>
            )}
            
            {/* Title */}
            <h2 id="modal-title" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>
              {book.title}
            </h2>
            
            {/* Author */}
            <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
              ಲೇಖಕ: <strong>{book.author}</strong>
            </p>
            
            {/* Stock Status */}
            {isOutOfStock ? (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: '#fef2f2',
                color: '#dc2626',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <AlertTriangle size={16} />
                ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ
              </div>
            ) : isLowStock ? (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: '#fef3c7',
                color: '#d97706',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <AlertTriangle size={16} />
                ಕೇವಲ {book.stockQuantity} ಉಳಿದಿವೆ!
              </div>
            ) : (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: '#ecfdf5',
                color: '#059669',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <Check size={16} />
                ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ
              </div>
            )}
            
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatCurrency(book.sellingPrice)}
              </span>
              {book.mrp > book.sellingPrice && (
                <>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    textDecoration: 'line-through', 
                    color: 'var(--color-text-muted)' 
                  }}>
                    {formatCurrency(book.mrp)}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#059669', 
                    fontWeight: 600 
                  }}>
                    ₹{book.mrp - book.sellingPrice} ಉಳಿತಾಯ
                  </span>
                </>
              )}
            </div>
            
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>ಸಂಖ್ಯೆ:</span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-md)' 
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1.25rem'
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    width: '40px', 
                    textAlign: 'center', 
                    fontWeight: 600 
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1.25rem'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary"
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  opacity: isOutOfStock ? 0.5 : 1
                }}
              >
                <ShoppingCart size={18} />
                ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ
              </button>
              <button
                onClick={handleShare}
                className="btn btn-outline"
                style={{ width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Share2 size={18} />
              </button>
            </div>
            
            {/* View Full Details Link */}
            <Link 
              href={`/books/${book.slug}`}
              className="btn btn-ghost"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                marginTop: '0.5rem' 
              }}
            >
              <Eye size={18} />
              ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ನೋಡಿ
            </Link>
            
            {/* Book Meta */}
            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              {book.isbn && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>ISBN:</span>{' '}
                  <span style={{ fontWeight: 500 }}>{book.isbn}</span>
                </div>
              )}
              {book.pages && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>ಪುಟಗಳು:</span>{' '}
                  <span style={{ fontWeight: 500 }}>{book.pages}</span>
                </div>
              )}
              {book.publicationYear && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>ಪ್ರಕಟಣೆ ವರ್ಷ:</span>{' '}
                  <span style={{ fontWeight: 500 }}>{book.publicationYear}</span>
                </div>
              )}
              {book.edition && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>ಆವೃತ್ತಿ:</span>{' '}
                  <span style={{ fontWeight: 500 }}>{book.edition}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
