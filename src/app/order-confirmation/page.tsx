'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  FileText, 
  Download,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Home,
  ShoppingBag
} from 'lucide-react'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || searchParams.get('order')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderNumber])
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div className="spinner" />
      </div>
    )
  }
  
  if (!order) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem' 
      }}>
        <h2>ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ</h2>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ
        </Link>
      </div>
    )
  }
  
  return (
    <>
      <Header />
      <main style={{ 
        minHeight: '100vh', 
        background: 'var(--color-bg-alt)',
        padding: '2rem 0'
      }}>
        <div className="container">
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <CheckCircle size={80} style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '1.5rem' }}>
              ಆರ್ಡರ್ ಸಂಖ್ಯೆ: <strong>{order.orderNumber}</strong>
            </p>
            <p style={{ opacity: 0.8 }}>
              ನಿಮ್ಮ ಇ-ಮೇಲ್‌ಗೆ ದೃಢೀಕರಣ ಕಳುಹಿಸಲಾಗಿದೆ
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Order Details */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Package size={20} />
                ಆರ್ಡರ್ ವಿವರಗಳು
              </h2>
              
              {/* Order Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: 'var(--color-cream-light)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>ಪಾವತಿ ಯಶಸ್ವಿ</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* Order Items */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  color: 'var(--color-text-light)'
                }}>
                  ಆರ್ಡರ್ ಐಟಂಗಳು
                </h3>
                
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem 0',
                      borderBottom: '1px solid var(--color-border)'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '80px',
                      background: 'var(--color-cream-light)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <BookOpen size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {item.bookTitle}
                      </h4>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--color-text-light)',
                        marginBottom: '0.25rem'
                      }}>
                        {item.bookAuthor}
                      </p>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>
                        ×{item.quantity} · {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Summary */}
              <div style={{
                background: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>ಉಪಮೊತ್ತ</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-success)'
                }}>
                  <span>ಉಳಿತಾಯ</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>GST</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>ಶಿಪ್ಪಿಂಗ್</span>
                  <span>{order.shippingCharge === 0 ? 'ಉಚಿತ' : formatCurrency(order.shippingCharge)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '2px solid var(--color-border)',
                  fontWeight: 600
                }}>
                  <span>ಒಟ್ಟು</span>
                  <span style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Shipping & Invoice */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Truck size={20} />
                  ಶಿಪ್ಪಿಂಗ್ ವಿವರಗಳು
                </h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                    {order.customerName}
                  </p>
                  <p style={{ 
                    fontSize: '0.9375rem', 
                    color: 'var(--color-text-light)',
                    marginBottom: '0.5rem'
                  }}>
                    <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                    {order.shippingAddress}<br />
                    {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                  </p>
                  <p style={{ 
                    fontSize: '0.9375rem', 
                    color: 'var(--color-text-light)',
                    marginBottom: '0.25rem'
                  }}>
                    <Phone size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                    {order.customerPhone}
                  </p>
                  <p style={{ 
                    fontSize: '0.9375rem', 
                    color: 'var(--color-text-light)',
                    margin: 0
                  }}>
                    <Mail size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                    {order.customerEmail}
                  </p>
                </div>
                
                {/* Delivery Estimate */}
                <div style={{
                  padding: '1rem',
                  background: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Truck size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>ಅಂದಾಜು ವಿತರಣೆ</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                      ಮೆಟ್ರೋ: 2-3 ದಿನ | ಇತರ: 5-6 ದಿನ
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Invoice */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FileText size={20} />
                  GST ಇನ್‌ವಾಯ್ಸ್
                </h2>
                
                <p style={{ 
                  fontSize: '0.9375rem', 
                  color: 'var(--color-text-light)',
                  marginBottom: '1rem'
                }}>
                  ಇನ್‌ವಾಯ್ಸ್ ಸಂಖ್ಯೆ: <strong>{order.invoiceNumber}</strong>
                </p>
                
                <a 
                  href={`/api/invoice/${order.orderNumber}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline" 
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Download size={18} />
                  ಇನ್‌ವಾಯ್ಸ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ
                </a>
                
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.75rem',
                  textAlign: 'center'
                }}>
                  ಇನ್‌ವಾಯ್ಸ್ ನಿಮ್ಮ ಇ-ಮೇಲ್‌ಗೂ ಕಳುಹಿಸಲಾಗಿದೆ
                </p>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link 
                  href="/" 
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  <Home size={18} />
                  ಮುಖಪುಟ
                </Link>
                <Link 
                  href="/books" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={18} />
                  ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="spinner" />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
