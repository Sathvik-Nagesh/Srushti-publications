'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, GitCompare, ChevronUp, ChevronDown } from 'lucide-react'
import { useCompareStore } from '@/lib/compareStore'

export default function CompareWidget() {
  const { books, removeBook, clearAll } = useCompareStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server or if no books
  if (!mounted || books.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '1rem',
        minWidth: '300px',
        maxWidth: '500px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '1rem' : 0,
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCompare size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 600 }}>
            ಹೋಲಿಕೆ ({books.length}/3)
          </span>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Books Preview */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {books.map((book) => (
              <div
                key={book.id}
                style={{
                  position: 'relative',
                  width: '70px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)'
                }}
              >
                <Image
                  src={book.coverImage || '/placeholder-book.jpg'}
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="70px"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeBook(book.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--color-error)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 3 - books.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                style={{
                  width: '70px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.75rem'
                }}
              >
                +
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={clearAll}
              className="btn btn-ghost btn-sm"
              style={{ flex: 1 }}
            >
              ತೆಗೆ
            </button>
            <Link
              href="/compare"
              className="btn btn-primary btn-sm"
              style={{ flex: 1, textAlign: 'center' }}
            >
              ಹೋಲಿಸಿ
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
