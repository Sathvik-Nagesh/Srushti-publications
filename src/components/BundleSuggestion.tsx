'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, ShoppingCart, Sparkles } from 'lucide-react'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import type { Book } from '@/lib/types'
import toast from 'react-hot-toast'

interface BundleSuggestionProps {
  currentBook: Book
  relatedBooks: Book[]
}

export default function BundleSuggestion({ currentBook, relatedBooks }: BundleSuggestionProps) {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([currentBook.id])
  const addItem = useCartStore(state => state.addItem)

  // Get up to 2 related books for bundle
  const bundleBooks = relatedBooks.slice(0, 2)
  
  if (bundleBooks.length === 0) {
    return null
  }

  const allBooks = [currentBook, ...bundleBooks]
  
  const toggleBook = (bookId: string) => {
    if (bookId === currentBook.id) return // Can't unselect current book
    
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId))
    } else {
      setSelectedBooks([...selectedBooks, bookId])
    }
  }
  
  const selectedBooksData = allBooks.filter(b => selectedBooks.includes(b.id))
  const totalMRP = selectedBooksData.reduce((sum, b) => sum + b.mrp, 0)
  const totalPrice = selectedBooksData.reduce((sum, b) => sum + b.sellingPrice, 0)
  const totalSavings = totalMRP - totalPrice
  const bundleDiscount = Math.round((totalSavings / totalMRP) * 100)
  
  const handleAddBundle = () => {
    selectedBooksData.forEach(book => {
      if (book.stockQuantity > 0) {
        addItem(book)
      }
    })
    toast.success(`${selectedBooksData.length} ಪುಸ್ತಕಗಳನ್ನು ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!`)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-cream-light) 0%, white 100%)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      marginTop: '2rem',
      border: '1px solid var(--color-border)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
          ಒಟ್ಟಿಗೆ ಖರೀದಿಸಿ & ಹೆಚ್ಚು ಉಳಿಸಿ
        </h3>
      </div>
      
      {/* Books Grid */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {allBooks.map((book, idx) => (
          <div key={book.id} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Book Item */}
            <div
              onClick={() => toggleBook(book.id)}
              style={{
                cursor: book.id === currentBook.id ? 'default' : 'pointer',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem',
                border: selectedBooks.includes(book.id) 
                  ? '2px solid var(--color-primary)' 
                  : '2px solid var(--color-border)',
                opacity: selectedBooks.includes(book.id) ? 1 : 0.6,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100px'
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--color-primary)',
                background: selectedBooks.includes(book.id) ? 'var(--color-primary)' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                alignSelf: 'flex-end'
              }}>
                {selectedBooks.includes(book.id) && '✓'}
              </div>
              
              {/* Cover */}
              <div style={{
                position: 'relative',
                width: '60px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}>
                <Image
                  src={book.coverImage || '/placeholder-book.jpg'}
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="60px"
                />
              </div>
              
              {/* Title */}
              <p style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                textAlign: 'center',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.3
              }}>
                {book.title}
              </p>
              
              {/* Price */}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-primary)'
              }}>
                {formatCurrency(book.sellingPrice)}
              </span>
            </div>
            
            {/* Plus Sign */}
            {idx < allBooks.length - 1 && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 0.25rem'
              }}>
                <Plus size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Total & Add Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {formatCurrency(totalPrice)}
            </span>
            {totalSavings > 0 && (
              <span style={{ 
                fontSize: '1rem', 
                textDecoration: 'line-through', 
                color: 'var(--color-text-muted)' 
              }}>
                {formatCurrency(totalMRP)}
              </span>
            )}
          </div>
          {totalSavings > 0 && (
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--color-success)', 
              fontWeight: 600 
            }}>
              ₹{totalSavings} ಉಳಿತಾಯ ({bundleDiscount}%)
            </span>
          )}
        </div>
        
        <button
          onClick={handleAddBundle}
          className="btn btn-primary"
          disabled={selectedBooks.length === 0}
        >
          <ShoppingCart size={18} />
          {selectedBooks.length} ಐಟಂಗಳನ್ನು ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ
        </button>
      </div>
    </div>
  )
}
