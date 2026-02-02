'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Heart, ShoppingCart, Trash, Books } from '@phosphor-icons/react'
import { useWishlistStore, WishlistItem } from '@/lib/wishlist'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore(state => state.addItem)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleAddToCart = (item: WishlistItem) => {
    // Create a minimal Book object from WishlistItem
    const book = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      author: item.author,
      coverImage: item.coverImage,
      mrp: item.mrp,
      sellingPrice: item.sellingPrice,
      // Default values for required Book fields
      description: '',
      additionalImages: [],
      stockQuantity: 100,
      lowStockAlert: 5,
      language: 'kn',
      isNewRelease: false,
      isBestSeller: false,
      isOnSale: item.mrp > item.sellingPrice,
      isFeatured: false,
      isActive: true,
      salesCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: ''
    }
    addToCart(book, 1)
    removeItem(item.id)
  }

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="section">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: '3rem 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <Heart size={40} weight="fill" style={{ marginBottom: '0.75rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              ನನ್ನ ವಿಶ್‌ಲಿಸ್ಟ್
            </h1>
            <p style={{ opacity: 0.9 }}>My Wishlist</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {items.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Heart size={64} weight="light" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  ನಿಮ್ಮ ವಿಶ್‌ಲಿಸ್ಟ್ ಖಾಲಿಯಾಗಿದೆ
                </h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                  ನಿಮಗೆ ಇಷ್ಟವಾದ ಪುಸ್ತಕಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ
                </p>
                <Link href="/books" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Books size={20} weight="bold" />
                  ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {items.length} ಐಟಂ{items.length > 1 ? 'ಗಳು' : ''}
                  </h2>
                  <button 
                    onClick={() => {
                      if (confirm('ವಿಶ್‌ಲಿಸ್ಟ್ ಅನ್ನು ಸಾಫ್ ಮಾಡುವುದೇ?')) {
                        clearWishlist()
                      }
                    }}
                    className="btn btn-ghost"
                    style={{ color: 'var(--color-error)', gap: '0.5rem' }}
                  >
                    <Trash size={18} weight="bold" />
                    ಎಲ್ಲಾ ತೆಗೆದುಹಾಕಿ
                  </button>
                </div>

                {/* Items Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {items.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        background: 'white',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <Link 
                        href={`/books/${item.slug}`}
                        style={{
                          height: '200px',
                          background: 'var(--color-cream-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Books size={60} weight="light" style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                      </Link>
                      
                      <div style={{ padding: '1.25rem' }}>
                        <Link 
                          href={`/books/${item.slug}`}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '0.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.title}
                          </h3>
                        </Link>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                          {item.author}
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                            {formatCurrency(item.sellingPrice)}
                          </span>
                          {item.mrp > item.sellingPrice && (
                            <span style={{ 
                              textDecoration: 'line-through', 
                              color: 'var(--color-text-muted)',
                              fontSize: '0.875rem'
                            }}>
                              {formatCurrency(item.mrp)}
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="btn btn-primary"
                            style={{ flex: 1, gap: '0.5rem' }}
                          >
                            <ShoppingCart size={18} weight="bold" />
                            ಕಾರ್ಟ್‌ಗೆ
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-ghost"
                            style={{ padding: '0.75rem', color: 'var(--color-error)' }}
                            aria-label="Remove from wishlist"
                          >
                            <Trash size={18} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
