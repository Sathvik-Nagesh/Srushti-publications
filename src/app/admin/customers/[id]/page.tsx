'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Package, Calendar, DollarSign, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  bookTitle: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

interface CustomerDetails {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  createdAt: string
  orders: Order[]
  stats: {
    totalOrders: number
    totalRevenue: number
  }
}

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b',
  PAID: '#10b981',
  PROCESSING: '#3b82f6',
  DISPATCHED: '#8b5cf6',
  DELIVERED: '#059669',
  CANCELLED: '#ef4444',
  REFUNDED: '#6b7280'
}

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/admin/customers/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setCustomer(data.data)
        } else {
          toast.error(data.error || 'ಗ್ರಾಹಕರು ಕಂಡುಬಂದಿಲ್ಲ')
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
        toast.error('ಮಾಹಿತಿ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCustomer()
  }, [id])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>ಗ್ರಾಹಕರು ಕಂಡುಬಂದಿಲ್ಲ</h3>
        <Link href="/admin/customers" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ಹಿಂದಕ್ಕೆ ಹೋಗಿ
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/admin/customers"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--color-text-light)', 
            textDecoration: 'none',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={16} />
          ಗ್ರಾಹಕರ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                fontWeight: 700, 
                color: 'white'
              }}>
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{customer.name}</h1>
                <p style={{ color: 'var(--color-text-light)', marginTop: '0.25rem' }}>ಸದಸ್ಯತ್ವ: {formatDate(new Date(customer.createdAt))}</p>
              </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Contact Info */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>ಸಂಪರ್ಕ ವಿವರಗಳು</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}><Mail size={18} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ಇಮೇಲ್</p>
                <p style={{ fontWeight: 500 }}>{customer.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}><Phone size={18} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ಫೋನ್</p>
                <p style={{ fontWeight: 500 }}>{customer.phone || '-'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}><MapPin size={18} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ವಿಳಾಸ</p>
                <p style={{ fontWeight: 500 }}>
                  {customer.address}<br/>
                  {customer.city}, {customer.state} - {customer.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>ಅಂಕಿಅಂಶಗಳು</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0c4a6e' }}>{customer.stats.totalOrders}</p>
            </div>
            <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: '0.5rem' }}>ಒಟ್ಟು ಖರ್ಚು</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064e3b' }}>{formatCurrency(customer.stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders History */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>ಆರ್ಡರ್ ಇತಿಹಾಸ</h3>
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {customer.orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Package size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <p>ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ಆರ್ಡರ್ ಐಡಿ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ದಿನಾಂಕ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ಸ್ಥಿತಿ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ಪಾವತಿ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ಮೊತ್ತ</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>ಕ್ರಿಯೆ</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>#{order.orderNumber}</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                      {formatDate(new Date(order.createdAt))}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        background: `${statusColors[order.status]}20`, 
                        color: statusColors[order.status] 
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '0.75rem',
                        background: order.paymentStatus === 'SUCCESS' ? '#10b98120' : '#f59e0b20',
                        color: order.paymentStatus === 'SUCCESS' ? '#10b981' : '#f59e0b'
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.25rem', 
                          color: 'var(--color-primary)', 
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        ವಿವರಿಸಿ <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
