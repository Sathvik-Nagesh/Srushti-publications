'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingCart, Check, Minus, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCompareStore } from '@/lib/compareStore'
import { useCartStore } from '@/lib/store'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ComparePage() {
  const { books, removeBook, clearAll } = useCompareStore()
  const addToCart = useCartStore(state => state.addItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </main>
        <Footer />
      </>
    )
  }

  if (books.length === 0) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '60vh', background: 'var(--color-bg-alt)' }}>
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
              ಹೋಲಿಕೆ ಪಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ
            </h1>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
              ಪುಸ್ತಕಗಳನ್ನು ಹೋಲಿಸಲು ಅವುಗಳನ್ನು ಹೋಲಿಕೆ ಪಟ್ಟಿಗೆ ಸೇರಿಸಿ
            </p>
            <Link href="/books" className="btn btn-primary">
              <ArrowLeft size={18} /> ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleAddToCart = (book: typeof books[0]) => {
    if (book.stockQuantity <= 0) {
      toast.error('ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ')
      return
    }
    addToCart(book)
    toast.success('ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!')
  }

  // Comparison rows
  const comparisonFields = [
    { key: 'coverImage', label: 'ಮುಖಚಿತ್ರ', type: 'image' },
    { key: 'title', label: 'ಶೀರ್ಷಿಕೆ', type: 'text' },
    { key: 'author', label: 'ಲೇಖಕ', type: 'text' },
    { key: 'sellingPrice', label: 'ಬೆಲೆ', type: 'price' },
    { key: 'mrp', label: 'MRP', type: 'price' },
    { key: 'discount', label: 'ರಿಯಾಯಿತಿ', type: 'discount' },
    { key: 'pages', label: 'ಪುಟಗಳು', type: 'number' },
    { key: 'publicationYear', label: 'ಪ್ರಕಟಣೆ ವರ್ಷ', type: 'number' },
    { key: 'edition', label: 'ಆವೃತ್ತಿ', type: 'text' },
    { key: 'isbn', label: 'ISBN', type: 'text' },
    { key: 'stockQuantity', label: 'ಸ್ಟಾಕ್', type: 'stock' },
    { key: 'isNewRelease', label: 'ಹೊಸ ಬಿಡುಗಡೆ', type: 'boolean' },
    { key: 'isBestSeller', label: 'ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್', type: 'boolean' },
  ]

  const renderValue = (book: typeof books[0], field: typeof comparisonFields[0]) => {
    const value = (book as any)[field.key]
    
    switch (field.type) {
      case 'image':
        return (
          <div style={{ 
            position: 'relative', 
            width: '120px', 
            height: '160px', 
            margin: '0 auto',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <Image 
              src={value || '/placeholder-book.jpg'} 
              alt={book.title} 
              fill 
              style={{ objectFit: 'cover' }} 
              sizes="120px"
            />
          </div>
        )
      case 'price':
        return <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(value)}</span>
      case 'discount':
        const discount = calculateDiscountPercentage(book.mrp, book.sellingPrice)
        return discount > 0 
          ? <span className="badge badge-sale">{discount}%</span>
          : <span style={{ color: 'var(--color-text-muted)' }}>-</span>
      case 'stock':
        return value > 0 
          ? <span style={{ color: 'var(--color-success)' }}>✓ {value} ಉಳಿದಿವೆ</span>
          : <span style={{ color: 'var(--color-error)' }}>✗ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ</span>
      case 'boolean':
        return value 
          ? <Check size={20} style={{ color: 'var(--color-success)' }} />
          : <Minus size={20} style={{ color: 'var(--color-text-muted)' }} />
      case 'number':
        return value || <span style={{ color: 'var(--color-text-muted)' }}>-</span>
      default:
        return value || <span style={{ color: 'var(--color-text-muted)' }}>-</span>
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh', background: 'var(--color-bg-alt)' }}>
        <div className="container" style={{ padding: '2rem 1rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                📊 ಪುಸ್ತಕಗಳ ಹೋಲಿಕೆ
              </h1>
              <p style={{ color: 'var(--color-text-light)' }}>
                {books.length} ಪುಸ್ತಕಗಳನ್ನು ಹೋಲಿಸಲಾಗುತ್ತಿದೆ
              </p>
            </div>
            <button onClick={clearAll} className="btn btn-outline">
              <X size={18} /> ಎಲ್ಲಾ ತೆಗೆ
            </button>
          </div>

          {/* Compare Table */}
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--radius-xl)', 
            overflow: 'auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <tbody>
                {comparisonFields.map((field, idx) => (
                  <tr 
                    key={field.key}
                    style={{ 
                      borderBottom: '1px solid var(--color-border)',
                      background: idx % 2 === 0 ? 'var(--color-bg-alt)' : 'white'
                    }}
                  >
                    <td style={{ 
                      padding: '1rem', 
                      fontWeight: 600, 
                      width: '150px',
                      background: 'var(--color-cream-light)'
                    }}>
                      {field.label}
                    </td>
                    {books.map((book) => (
                      <td 
                        key={book.id} 
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'center',
                          minWidth: '180px'
                        }}
                      >
                        {renderValue(book, field)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions Row */}
                <tr>
                  <td style={{ 
                    padding: '1rem', 
                    fontWeight: 600,
                    background: 'var(--color-cream-light)'
                  }}>
                    ಕ್ರಿಯೆಗಳು
                  </td>
                  {books.map((book) => (
                    <td key={book.id} style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stockQuantity <= 0}
                          className="btn btn-primary btn-sm"
                          style={{ opacity: book.stockQuantity <= 0 ? 0.5 : 1 }}
                        >
                          <ShoppingCart size={16} /> ಕಾರ್ಟ್‌ಗೆ
                        </button>
                        <Link 
                          href={`/books/${book.slug}`} 
                          className="btn btn-outline btn-sm"
                        >
                          ವಿವರಗಳನ್ನು ನೋಡಿ
                        </Link>
                        <button
                          onClick={() => removeBook(book.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-error)' }}
                        >
                          <X size={16} /> ತೆಗೆ
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Back to Books */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/books" className="btn btn-ghost">
              <ArrowLeft size={18} /> ಹೆಚ್ಚಿನ ಪುಸ್ತಕಗಳನ್ನು ಸೇರಿಸಿ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
