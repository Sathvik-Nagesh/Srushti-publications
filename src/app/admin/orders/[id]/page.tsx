'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Download, Mail, Phone, MapPin, BookOpen, FileText } from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'PENDING', label: 'ಬಾಕಿ', color: '#f59e0b' },
  { value: 'PAID', label: 'ಪಾವತಿ', color: '#10b981' },
  { value: 'PROCESSING', label: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ', color: '#3b82f6' },
  { value: 'DISPATCHED', label: 'ಕಳುಹಿಸಲಾಗಿದೆ', color: '#8b5cf6' },
  { value: 'DELIVERED', label: 'ತಲುಪಿಸಲಾಗಿದೆ', color: '#059669' },
  { value: 'CANCELLED', label: 'ರದ್ದು', color: '#ef4444' }
]

const mockOrder = {
  id: '1', orderNumber: 'SP-2024-001', status: 'PAID', paymentStatus: 'SUCCESS',
  customerName: 'ರಾಜೇಶ್ ಕುಮಾರ್', customerEmail: 'rajesh@example.com', customerPhone: '9876543210',
  shippingAddress: '123, 4ನೇ ಮುಖ್ಯ ರಸ್ತೆ, ಜಯನಗರ', shippingCity: 'ಬೆಂಗಳೂರು', shippingState: 'ಕರ್ನಾಟಕ', shippingPincode: '560041',
  subtotal: 1293, discount: 106, shippingCharge: 0, taxAmount: 0, totalAmount: 1187,
  razorpayPaymentId: 'pay_XXXXXXXXXXXXX', invoiceNumber: 'INV2401-ABCD12',
  createdAt: new Date(), paidAt: new Date(),
  items: [
    { id: '1', bookTitle: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', bookAuthor: 'ಕುವೆಂಪು', quantity: 2, unitPrice: 399, totalPrice: 798 },
    { id: '2', bookTitle: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', bookAuthor: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್', quantity: 1, unitPrice: 495, totalPrice: 495 }
  ]
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState(mockOrder)
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')

  const handleUpdateStatus = () => {
    setOrder(prev => ({ ...prev, status }))
    toast.success('ಆರ್ಡರ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ!')
  }

  const currentStatus = statusOptions.find(s => s.value === order.status)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}><ArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>ಆರ್ಡರ್ #{order.orderNumber}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline"><Download size={18} /> ಇನ್ವಾಯ್ಸ್</button>
          <button className="btn btn-outline"><Mail size={18} /> ಇ-ಮೇಲ್</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Items */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> ಆರ್ಡರ್ ಐಟಂಗಳು</h2>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '60px', height: '80px', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} /></div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}><span>ಶಿಪ್ಪಿಂಗ್</span><span>{order.shippingCharge === 0 ? 'ಉಚಿತ' : formatCurrency(order.shippingCharge)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid var(--color-border)', fontWeight: 600, fontSize: '1.125rem' }}><span>ಒಟ್ಟು</span><span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-light)' }}>ಗ್ರಾಹಕ</h3>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{order.customerName}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}><Mail size={14} /> {order.customerEmail}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}><Phone size={14} /> {order.customerPhone}</p>
            </div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-light)' }}>ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ</h3>
              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9375rem', margin: 0 }}><MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} /><span>{order.shippingAddress}<br />{order.shippingCity}, {order.shippingState} - {order.shippingPincode}</span></p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>ಆರ್ಡರ್ ಸ್ಥಿತಿ</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: `${currentStatus?.color}15`, borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
              {order.status === 'DELIVERED' ? <CheckCircle size={24} style={{ color: currentStatus?.color }} /> : order.status === 'CANCELLED' ? <XCircle size={24} style={{ color: currentStatus?.color }} /> : <Truck size={24} style={{ color: currentStatus?.color }} />}
              <span style={{ fontWeight: 600, color: currentStatus?.color }}>{currentStatus?.label}</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ಸ್ಥಿತಿ ಬದಲಾಯಿಸಿ</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input select">{statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
            </div>
            {status === 'DISPATCHED' && (
              <div style={{ marginBottom: '1rem' }}><label className="label">ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ</label><input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input" placeholder="AWB ಸಂಖ್ಯೆ" /></div>
            )}
            <button onClick={handleUpdateStatus} className="btn btn-primary" style={{ width: '100%' }}>ಸ್ಥಿತಿ ನವೀಕರಿಸಿ</button>
          </div>

          {/* Payment */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>ಪಾವತಿ ವಿವರಗಳು</h3>
            <div style={{ fontSize: '0.875rem' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ color: 'var(--color-text-light)' }}>ಸ್ಥಿತಿ</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>ಯಶಸ್ವಿ</span></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ color: 'var(--color-text-light)' }}>ಪಾವತಿ ID</span><span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{order.razorpayPaymentId}</span></p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}><span style={{ color: 'var(--color-text-light)' }}>ದಿನಾಂಕ</span><span>{formatDateTime(order.paidAt)}</span></p>
            </div>
          </div>

          {/* Invoice */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> ಇನ್ವಾಯ್ಸ್</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>ಇನ್ವಾಯ್ಸ್ ಸಂಖ್ಯೆ: <strong>{order.invoiceNumber}</strong></p>
            <Link href={`/api/invoice/${order.orderNumber}`} className="btn btn-outline" style={{ width: '100%' }}><Download size={16} /> PDF ಡೌನ್‌ಲೋಡ್</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
