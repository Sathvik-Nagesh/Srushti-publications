'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { History, BookOpen, ChevronRight, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface RecentBook {
  id: string
  slug: string
  title: string
  author: string
  price: number
  mrp: number
  image?: string
  viewedAt: number
}

const MAX_RECENT_ITEMS = 8

// Helper function to add a book to recently viewed
export function addToRecentlyViewed(book: Omit<RecentBook, 'viewedAt'>) {
  if (typeof window === 'undefined') return
  
  try {
    const stored = localStorage.getItem('recently-viewed')
    let recentBooks: RecentBook[] = stored ? JSON.parse(stored) : []
    
    // Remove if already exists
    recentBooks = recentBooks.filter(b => b.id !== book.id)
    
    // Add to beginning
    recentBooks.unshift({
      ...book,
      viewedAt: Date.now()
    })
    
    // Keep only last N items
    recentBooks = recentBooks.slice(0, MAX_RECENT_ITEMS)
    
    localStorage.setItem('recently-viewed', JSON.stringify(recentBooks))
  } catch (error) {
    console.error('Error saving to recently viewed:', error)
  }
}

// Get recently viewed books
export function getRecentlyViewed(): RecentBook[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('recently-viewed')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Clear recently viewed
export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('recently-viewed')
}

interface RecentlyViewedProps {
  currentBookId?: string // Exclude current book from display
  maxItems?: number
  showClear?: boolean
}

export default function RecentlyViewed({ 
  currentBookId,
  maxItems = 4,
  showClear = true 
}: RecentlyViewedProps) {
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Moved loadRecentBooks up before useEffect to avoid hoisting error
  const loadRecentBooks = () => {
    const books = getRecentlyViewed()
    // Filter out current book if provided
    const filtered = currentBookId 
      ? books.filter(b => b.id !== currentBookId)
      : books
    setRecentBooks(filtered.slice(0, maxItems))
  }

  useEffect(() => {
    setMounted(true)
    loadRecentBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const handleClear = () => {
    clearRecentlyViewed()
    setRecentBooks([])
  }
  
  if (!mounted || recentBooks.length === 0) return null
  
  return (
    <section style={{
      padding: '2rem 0',
      background: 'var(--color-bg-alt)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <History size={24} style={{ color: 'var(--color-primary)' }} />
            ಇತ್ತೀಚೆಗೆ ನೋಡಿದ ಪುಸ್ತಕಗಳು
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {showClear && (
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <X size={14} />
                ತೆರವುಗೊಳಿಸಿ
              </button>
            )}
            <Link 
              href="/books"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Books Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {recentBooks.map(book => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid var(--color-border)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                {/* Book Icon/Image */}
                <div style={{
                  width: 50,
                  height: 65,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-cream-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BookOpen size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                </div>
                
                {/* Book Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {book.title}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-light)',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {book.author}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      fontSize: '0.875rem'
                    }}>
                      {formatCurrency(book.price)}
                    </span>
                    {book.mrp > book.price && (
                      <span style={{
                        textDecoration: 'line-through',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.75rem'
                      }}>
                        {formatCurrency(book.mrp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
