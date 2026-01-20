'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Package, Truck, CheckCircle, Clock, MapPin, MagnifyingGlass, Phone } from '@phosphor-icons/react'

// Mock order data - in production, this would come from API
const mockOrders: Record<string, OrderData> = {
  'ORD-2024-001': {
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    items: [{ title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', qty: 1, price: 399 }],
    total: 449,
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    address: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ',
    trackingSteps: [
      { status: 'ordered', label: 'ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ', date: '15 Jan', completed: true },
      { status: 'confirmed', label: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ', date: '15 Jan', completed: true },
      { status: 'shipped', label: 'ಶಿಪ್ ಮಾಡಲಾಗಿದೆ', date: '17 Jan', completed: true },
      { status: 'delivered', label: 'ವಿತರಿಸಲಾಗಿದೆ', date: '20 Jan', completed: true }
    ]
  },
  'ORD-2024-002': {
    orderNumber: 'ORD-2024-002',
    status: 'shipped',
    items: [{ title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', qty: 2, price: 495 }],
    total: 990,
    orderDate: '2024-01-18',
    deliveryDate: 'Expected: 25 Jan',
    address: 'ಮೈಸೂರು, ಕರ್ನಾಟಕ',
    trackingSteps: [
      { status: 'ordered', label: 'ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ', date: '18 Jan', completed: true },
      { status: 'confirmed', label: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ', date: '18 Jan', completed: true },
      { status: 'shipped', label: 'ಶಿಪ್ ಮಾಡಲಾಗಿದೆ', date: '20 Jan', completed: true },
      { status: 'delivered', label: 'ವಿತರಣೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ', date: '-', completed: false }
    ]
  }
}

interface OrderItem {
  title: string
  qty: number
  price: number
}

interface TrackingStep {
  status: string
  label: string
  date: string
  completed: boolean
}

interface OrderData {
  orderNumber: string
  status: string
  items: OrderItem[]
  total: number
  orderDate: string
  deliveryDate: string
  address: string
  trackingSteps: TrackingStep[]
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'delivered': return 'var(--color-success)'
    case 'shipped': return 'var(--color-info)'
    case 'confirmed': return 'var(--color-warning)'
    default: return 'var(--color-text-muted)'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'delivered': return 'ವಿತರಿಸಲಾಗಿದೆ'
    case 'shipped': return 'ಶಿಪ್ ಮಾಡಲಾಗಿದೆ'
    case 'confirmed': return 'ದೃಢೀಕರಿಸಲಾಗಿದೆ'
    case 'ordered': return 'ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ'
    default: return status
  }
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    
    if (!orderNumber.trim()) {
      setError('ದಯವಿಟ್ಟು ಆರ್ಡರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    
    const foundOrder = mockOrders[orderNumber.toUpperCase()]
    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      setError('ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ. ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಸರಿಯಾಗಿದೆಯೇ ಪರಿಶೀಲಿಸಿ.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: '4rem 0 3rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <Package size={48} weight="bold" style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Track Your Order</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '700px' }}>
            
            {/* Search Form */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2rem'
            }}>
              <form onSubmit={handleSearch}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                  ಆರ್ಡರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-2024-001"
                    className="input"
                    style={{ flex: 1 }}
                    aria-label="Order number"
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{ gap: '0.5rem' }}
                  >
                    {isLoading ? (
                      <span className="spinner" style={{ width: 20, height: 20 }} />
                    ) : (
                      <MagnifyingGlass size={20} weight="bold" />
                    )}
                    ಹುಡುಕಿ
                  </button>
                </div>
                
                {error && (
                  <p style={{ color: 'var(--color-error)', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                    {error}
                  </p>
                )}
              </form>
              
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                💡 Demo: ORD-2024-001 ಅಥವಾ ORD-2024-002 ಬಳಸಿ
              </p>
            </div>

            {/* Order Details */}
            {order && (
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}>
                {/* Order Header */}
                <div style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      ಆರ್ಡರ್ ಸಂಖ್ಯೆ
                    </p>
                    <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{order.orderNumber}</p>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಥಿತಿ</h3>
                  
                  <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* Vertical Line */}
                    <div style={{
                      position: 'absolute',
                      left: '11px',
                      top: '12px',
                      bottom: '12px',
                      width: '2px',
                      background: 'var(--color-border)'
                    }} />
                    
                    {order.trackingSteps.map((step, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '1rem',
                        marginBottom: i < order.trackingSteps.length - 1 ? '1.5rem' : 0,
                        position: 'relative'
                      }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: step.completed ? 'var(--color-success)' : 'var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'absolute',
                          left: '-2rem'
                        }}>
                          {step.completed && <CheckCircle size={16} weight="bold" style={{ color: 'white' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontWeight: step.completed ? 600 : 400,
                            color: step.completed ? 'var(--color-text)' : 'var(--color-text-muted)'
                          }}>
                            {step.label}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Info */}
                <div style={{
                  padding: '1.5rem 2rem',
                  background: 'var(--color-cream-light)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      ಆರ್ಡರ್ ದಿನಾಂಕ
                    </p>
                    <p style={{ fontWeight: 500 }}>{order.orderDate}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      <Truck size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      ವಿತರಣೆ
                    </p>
                    <p style={{ fontWeight: 500 }}>{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      ವಿಳಾಸ
                    </p>
                    <p style={{ fontWeight: 500 }}>{order.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>ಐಟಂಗಳು</h4>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                    }}>
                      <span>{item.title} × {item.qty}</span>
                      <span style={{ fontWeight: 600 }}>₹{item.price}</span>
                    </div>
                  ))}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    fontWeight: 700,
                    fontSize: '1.125rem'
                  }}>
                    <span>ಒಟ್ಟು</span>
                    <span style={{ color: 'var(--color-primary)' }}>₹{order.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div style={{
              background: 'var(--color-cream-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem 2rem',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>ಸಹಾಯ ಬೇಕೇ?</h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                ನಿಮ್ಮ ಆರ್ಡರ್ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ಸಂಪರ್ಕಿಸಿ
              </p>
              <a href="tel:+919845096668" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Phone size={18} weight="bold" />
                +91 98450 96668
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
