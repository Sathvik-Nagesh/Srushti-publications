'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Download, Mail, Phone, MapPin, BookOpen, FileText, RefreshCw, Save } from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'PENDING', label: 'ಬಾಕಿ', color: '#f59e0b' },
  { value: 'PAID', label: 'ಪಾವತಿಸಲಾಗಿದೆ', color: '#10b981' },
  { value: 'PROCESSING', label: 'ಸಂಸ್ಕರಣೆ', color: '#3b82f6' },
  { value: 'DISPATCHED', label: 'ಕಳುಹಿಸಲಾಗಿದೆ', color: '#8b5cf6' },
  { value: 'DELIVERED', label: 'ತಲುಪಿಸಲಾಗಿದೆ', color: '#059669' },
  { value: 'CANCELLED', label: 'ರದ್ದುಮಾಡಲಾಗಿದೆ', color: '#ef4444' }
]

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'ಬಾಕಿ', color: '#f59e0b' },
  SUCCESS: { label: 'ಯಶಸ್ವಿ', color: '#10b981' },
  FAILED: { label: 'ವಿಫಲ', color: '#ef4444' },
  REFUNDED: { label: 'ಮರುಪಾವತಿ', color: '#6b7280' }
}

interface OrderItem {
  id: string
  bookTitle: string
  bookAuthor: string
  bookCover: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  subtotal: number
  discount: number
  shippingCharge: number
  taxAmount: number
  totalAmount: number
  razorpayPaymentId: string | null
  invoiceNumber: string | null
  courierName: string | null
  trackingNumber: string | null
  notes: string | null
  createdAt: string
  paidAt: string | null
  dispatchedAt: string | null
  deliveredAt: string | null
  items: OrderItem[]
  paymentMethod: string | null
  paymentScreenshot: string | null
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [courierName, setCourierName] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
        setStatus(data.data.status)
        setCourierName(data.data.courierName || '')
        setTrackingNumber(data.data.trackingNumber || '')
        setNotes(data.data.notes || '')
      } else {
        toast.error('ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('ಆರ್ಡರ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleUpdateStatus = async () => {
    if (!order) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          courierName: courierName || null,
          trackingNumber: trackingNumber || null,
          notes: notes || null
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
        toast.success('ಆರ್ಡರ್ ನವೀಕರಿಸಲಾಗಿದೆ!')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ</h2>
        <Link href="/admin/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>ಹಿಂತಿರುಗಿ</Link>
      </div>
    )
  }

  const currentStatus = statusOptions.find(s => s.value === order.status)
  const paymentInfo = paymentStatusLabels[order.paymentStatus]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}><ArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>ಆರ್ಡರ್ #{order.orderNumber}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>{formatDateTime(new Date(order.createdAt))}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchOrder} className="btn btn-outline"><RefreshCw size={16} /> ರಿಫ್ರೆಶ್</button>
          <Link href={`/api/invoice/${order.orderNumber}`} target="_blank" className="btn btn-outline"><Download size={18} /> ಇನ್ವಾಯ್ಸ್</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="order-detail-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Items */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> ಆರ್ಡರ್ ಐಟಂಗಳು ({order.items.length})</h2>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '60px', height: '80px', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.bookTitle}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>{item.bookAuthor}</p>
                  <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0' }}>×{item.quantity} · {formatCurrency(item.unitPrice)}</p>
                </div>
                <div style={{ fontWeight: 600 }}>{formatCurrency(item.totalPrice)}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}><span>ಉಪಮೊತ್ತ</span><span>{formatCurrency(order.subtotal)}</span></div>
              {order.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-success)' }}><span>ರಿಯಾಯಿತಿ</span><span>-{formatCurrency(order.discount)}</span></div>}
              {order.taxAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}><span>GST</span><span>{formatCurrency(order.taxAmount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}><span>ಶಿಪ್ಪಿಂಗ್</span><span>{order.shippingCharge === 0 ? 'ಉಚಿತ' : formatCurrency(order.shippingCharge)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid var(--color-border)', fontWeight: 600, fontSize: '1.125rem' }}><span>ಒಟ್ಟು</span><span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="customer-grid">
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-light)' }}>ಗ್ರಾಹಕ ವಿವರಗಳು</h3>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{order.customerName}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}><Mail size={14} /> {order.customerEmail}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}><Phone size={14} /> {order.customerPhone}</p>
            </div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-light)' }}>ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ</h3>
              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9375rem', margin: 0 }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{order.shippingAddress}<br />{order.shippingCity}, {order.shippingState} - {order.shippingPincode}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Update */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>ಆರ್ಡರ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಿ</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: `${currentStatus?.color}15`, borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
              {order.status === 'DELIVERED' ? <CheckCircle size={20} style={{ color: currentStatus?.color }} /> : 
               order.status === 'CANCELLED' ? <XCircle size={20} style={{ color: currentStatus?.color }} /> : 
               <Truck size={20} style={{ color: currentStatus?.color }} />}
              <span style={{ fontWeight: 600, color: currentStatus?.color }}>{currentStatus?.label}</span>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ಹೊಸ ಸ್ಥಿತಿ</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input select">
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            
            {(status === 'DISPATCHED' || status === 'DELIVERED') && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="label">ಕೊರಿಯರ್ ಸೇವೆ</label>
                  <input 
                    value={courierName} 
                    onChange={e => setCourierName(e.target.value)} 
                    className="input" 
                    placeholder="India Post, DTDC, Professional..." 
                    list="courier-list"
                  />
                  <datalist id="courier-list">
                    <option value="India Post" />
                    <option value="DTDC" />
                    <option value="Professional" />
                    <option value="Trackon" />
                  </datalist>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="label">ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ</label>
                  <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input" placeholder="AWB ಸಂಖ್ಯೆ" />
                </div>
              </>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ಟಿಪ್ಪಣಿ</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input" rows={2} placeholder="ಆಂತರಿಕ ಟಿಪ್ಪಣಿಗಳು..." />
            </div>
            
            <button onClick={handleUpdateStatus} className="btn btn-primary" style={{ width: '100%' }} disabled={isSaving}>
              {isSaving ? <><div className="spinner" style={{ width: 16, height: 16 }} /> ಉಳಿಸಲಾಗುತ್ತಿದೆ...</> : <><Save size={16} /> ಸ್ಥಿತಿ ನವೀಕರಿಸಿ</>}
            </button>
          </div>

          {/* Payment */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>ಪಾವತಿ ವಿವರಗಳು (Payment)</h3>
            <div style={{ fontSize: '0.875rem' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-light)' }}>ವಿಧಾನ</span>
                <span style={{ fontWeight: 600 }}>{order.paymentMethod === 'QR' ? 'QR Code (UPI)' : order.paymentMethod || 'COD'}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-light)' }}>ಸ್ಥಿತಿ</span>
                <span style={{ color: paymentInfo?.color, fontWeight: 600, padding: '0.125rem 0.5rem', background: `${paymentInfo?.color}15`, borderRadius: 'var(--radius-sm)' }}>{paymentInfo?.label}</span>
              </p>
              {order.razorpayPaymentId && <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ color: 'var(--color-text-light)' }}>ಪಾವತಿ ID</span><span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{order.razorpayPaymentId}</span></p>}
              {order.paidAt && <p style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}><span style={{ color: 'var(--color-text-light)' }}>ಪಾವತಿ ದಿನಾಂಕ</span><span>{formatDateTime(new Date(order.paidAt))}</span></p>}
            </div>

            {order.paymentMethod === 'QR' && order.paymentScreenshot && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)' }}>
                 <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>ಪಾವತಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ (Screenshot)</p>
                 <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                     <img src={order.paymentScreenshot} alt="Payment Screenshot" style={{ width: '100%', height: 'auto', display: 'block' }} />
                 </a>
                 {order.paymentStatus === 'PENDING' && (
                     <button 
                         onClick={async () => {
                             setIsSaving(true);
                             try {
                                 const res = await fetch(`/api/admin/orders/${order.id}`, {
                                     method: 'PATCH',
                                     headers: {'Content-Type': 'application/json'},
                                     body: JSON.stringify({ paymentStatus: 'SUCCESS' })
                                 });
                                 const data = await res.json();
                                 if(data.success) {
                                     setOrder(data.data);
                                     setStatus(data.data.status);
                                     toast.success('ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ! (Payment Verified)');
                                 } else {
                                     throw new Error(data.error);
                                 }
                             } catch(e) {
                                 toast.error('ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ (Verification Failed)');
                             } finally {
                                 setIsSaving(false);
                             }
                         }}
                         disabled={isSaving}
                         className="btn btn-primary"
                         style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#10b981', borderColor: '#10b981' }}
                     >
                         <CheckCircle size={16} /> ಪಾವತಿ ಪರಿಶೀಲಿಸಿ (Verify Payment)
                     </button>
                 )}
              </div>
            )}
          </div>

          {/* Invoice */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> ಇನ್ವಾಯ್ಸ್</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>ಇನ್ವಾಯ್ಸ್ ಸಂಖ್ಯೆ: <strong>{order.invoiceNumber || `INV-${order.orderNumber}`}</strong></p>
            <Link href={`/api/invoice/${order.orderNumber}`} target="_blank" className="btn btn-outline" style={{ width: '100%' }}><Download size={16} /> ಡೌನ್‌ಲೋಡ್ PDF</Link>
          </div>

          {/* Timeline */}
          {(order.dispatchedAt || order.deliveredAt) && (
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>ಟೈಮ್‌ಲೈನ್</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                <p style={{ marginBottom: '0.5rem' }}>📦 ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ: {formatDateTime(new Date(order.createdAt))}</p>
                {order.paidAt && <p style={{ marginBottom: '0.5rem' }}>💳 ಪಾವತಿಸಲಾಗಿದೆ: {formatDateTime(new Date(order.paidAt))}</p>}
                {order.dispatchedAt && <p style={{ marginBottom: '0.5rem' }}>🚚 ಕಳುಹಿಸಲಾಗಿದೆ: {formatDateTime(new Date(order.dispatchedAt))}</p>}
                {order.deliveredAt && <p style={{ margin: 0 }}>✅ ತಲುಪಿಸಲಾಗಿದೆ: {formatDateTime(new Date(order.deliveredAt))}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
          .customer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
