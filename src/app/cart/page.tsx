'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QuantitySelector from '@/components/QuantitySelector'
import { useCartStore, useCartTotals } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, Trash, ArrowRight, Books, Tag, Truck, Shield } from '@phosphor-icons/react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const { subtotal, itemCount, totalMrp, savings, savingsPercentage } = useCartTotals()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleRemoveItem = (bookId: string, title: string) => {
    removeItem(bookId)
    toast.success(`"${title}" ಕಾರ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ`)
  }
  
  const handleClearCart = () => {
    if (confirm('ನೀವು ಕಾರ್ಟ್ ಅನ್ನು ಖಾಲಿ ಮಾಡಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?')) {
      clearCart()
      toast.success('ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ')
    }
  }
  
  const shippingCharge = subtotal >= 500 ? 0 : 50
  const orderTotal = subtotal + shippingCharge
  
  if (!mounted) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)', padding: '2rem 0' }}>
          <div className="container">
            <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)' }} />
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
          padding: '1.5rem 0'
        }}>
          <div className="container">
            <nav style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>/</span>
              <span style={{ color: 'var(--color-text)' }}>ಕಾರ್ಟ್</span>
            </nav>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>
              🛒 ನಿಮ್ಮ ಕಾರ್ಟ್
            </h1>
          </div>
        </div>
        
        <div className="container" style={{ padding: '1.5rem 1rem' }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <ShoppingBag size={64} weight="light" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                ನನ್ನ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ!
              </p>
              <Link href="/books" className="btn btn-primary btn-lg">
                <Books size={20} weight="bold" />
                ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Checkout Bar - Fixed at bottom on mobile */}
              <div className="mobile-checkout-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                padding: '1rem',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                zIndex: 100,
                display: 'none'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ಒಟ್ಟು</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(orderTotal)}
                    </p>
                  </div>
                  <Link href="/checkout" className="btn btn-primary" style={{ flex: 1, maxWidth: '200px' }}>
                    ಚೆಕ್‌ಔಟ್ <ArrowRight size={18} weight="bold" />
                  </Link>
                </div>
              </div>

              <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items">
                  {/* Cart Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontWeight: 500 }}>{itemCount} ಐಟಂಗಳು</span>
                    <button
                      onClick={handleClearCart}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Trash size={16} weight="bold" />
                      ಎಲ್ಲಾ ತೆಗೆ
                    </button>
                  </div>
                  
                  {/* Items List */}
                  <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="cart-item"
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '1rem',
                          borderBottom: index < items.length - 1 ? '1px solid var(--color-border)' : 'none'
                        }}
                      >
                        {/* Book Image */}
                        <Link 
                          href={`/books/${item.book.slug}`}
                          style={{
                            width: '80px',
                            minWidth: '80px',
                            height: '100px',
                            background: 'var(--color-cream-light)',
                            borderRadius: 'var(--radius-lg)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <Books size={32} weight="light" style={{ color: 'var(--color-primary)', opacity: 0.4 }} />
                        </Link>
                        
                        {/* Book Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link 
                            href={`/books/${item.book.slug}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <h3 style={{ 
                              fontSize: '0.9375rem', 
                              fontWeight: 600,
                              color: 'var(--color-text)',
                              marginBottom: '0.25rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.book.title}
                            </h3>
                          </Link>
                          <p style={{ 
                            fontSize: '0.8125rem', 
                            color: 'var(--color-text-light)',
                            marginBottom: '0.5rem'
                          }}>
                            {item.book.author}
                          </p>
                          
                          {/* Price */}
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                              {formatCurrency(item.price)}
                            </span>
                            {item.book.mrp > item.price && (
                              <>
                                <span style={{ 
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8125rem',
                                  color: 'var(--color-text-muted)',
                                  textDecoration: 'line-through'
                                }}>
                                  {formatCurrency(item.book.mrp)}
                                </span>
                                <span style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.75rem',
                                  color: 'var(--color-success)',
                                  fontWeight: 500
                                }}>
                                  {Math.round(((item.book.mrp - item.price) / item.book.mrp) * 100)}% ↓
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Quantity & Remove */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <QuantitySelector
                              quantity={item.quantity}
                              maxQuantity={item.book.stockQuantity}
                              onQuantityChange={(qty) => updateQuantity(item.bookId, qty)}
                              size="sm"
                            />
                            <button
                              onClick={() => handleRemoveItem(item.bookId, item.book.title)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-error)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.8125rem'
                              }}
                              aria-label="Remove item"
                            >
                              <Trash size={16} weight="bold" />
                              ತೆಗೆ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Continue Shopping */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link href="/books" className="btn btn-ghost">
                      ← ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ
                    </Link>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="cart-summary" style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  height: 'fit-content'
                }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    ಆರ್ಡರ್ ಸಾರಾಂಶ
                  </h2>
                  
                  {/* Price Breakdown */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ color: 'var(--color-text-light)' }}>ಉಪಮೊತ್ತ ({itemCount})</span>
                      <span>{formatCurrency(totalMrp)}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        color: 'var(--color-success)',
                        fontSize: '0.9375rem'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Tag size={16} weight="bold" />
                          ಉಳಿತಾಯ ({savingsPercentage}%)
                        </span>
                        <span>- {formatCurrency(savings)}</span>
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ 
                        color: 'var(--color-text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Truck size={16} weight="bold" />
                        ಶಿಪ್ಪಿಂಗ್
                      </span>
                      {shippingCharge === 0 ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>ಉಚಿತ</span>
                      ) : (
                        <span>{formatCurrency(shippingCharge)}</span>
                      )}
                    </div>
                    
                    {shippingCharge > 0 && (
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-info)',
                        background: 'var(--color-primary-50)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '0.75rem'
                      }}>
                        ₹500+ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್! ({formatCurrency(500 - subtotal)} ಹೆಚ್ಚು)
                      </p>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '2px solid var(--color-border)',
                    marginBottom: '1.25rem'
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>ಒಟ್ಟು</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(orderTotal)}
                    </span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link 
                    href="/checkout"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಸಿ
                    <ArrowRight size={20} weight="bold" />
                  </Link>
                  
                  {/* Security Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-text-light)',
                    fontSize: '0.8125rem'
                  }}>
                    <Shield size={16} weight="bold" />
                    <span>100% ಸುರಕ್ಷಿತ ಪಾವತಿ</span>
                  </div>
                </div>
              </div>

              {/* Spacer for mobile fixed checkout bar */}
              <div className="mobile-checkout-spacer" style={{ height: '100px', display: 'none' }} />
            </>
          )}
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          
          .cart-summary {
            order: -1;
          }
        }

        @media (max-width: 600px) {
          .mobile-checkout-bar {
            display: block !important;
          }
          
          .mobile-checkout-spacer {
            display: block !important;
          }
          
          .cart-summary {
            display: none;
          }

          .cart-item {
            padding: 0.875rem !important;
          }
        }
      `}</style>
    </>
  )
}
