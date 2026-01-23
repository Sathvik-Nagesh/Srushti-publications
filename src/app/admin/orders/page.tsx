'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye, Download, RefreshCw, Package, Truck, CheckCircle, XCircle, Clock, Filter } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  items: Array<{ id: string; bookTitle: string; quantity: number }>
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

const statusLabels: Record<string, string> = {
  PENDING: 'ಬಾಕಿ',
  PAID: 'ಪಾವತಿಸಲಾಗಿದೆ',
  PROCESSING: 'ಸಂಸ್ಕರಣೆ',
  DISPATCHED: 'ಕಳುಹಿಸಲಾಗಿದೆ',
  DELIVERED: 'ತಲುಪಿಸಲಾಗಿದೆ',
  CANCELLED: 'ರದ್ದುಮಾಡಲಾಗಿದೆ',
  REFUNDED: 'ಮರುಪಾವತಿ'
}

const paymentLabels: Record<string, string> = {
  PENDING: 'ಬಾಕಿ',
  SUCCESS: 'ಯಶಸ್ವಿ',
  FAILED: 'ವಿಫಲ',
  REFUNDED: 'ಮರುಪಾವತಿ'
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPayment, setFilterPayment] = useState('')
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, delivered: 0, revenue: 0 })

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.set('status', filterStatus)
      if (filterPayment) params.set('paymentStatus', filterPayment)
      if (searchQuery) params.set('search', searchQuery)

      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data.orders || [])
        setStats(data.data.stats || { total: 0, pending: 0, processing: 0, delivered: 0, revenue: 0 })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('ಆರ್ಡರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filterStatus, filterPayment])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['ಆರ್ಡರ್ ಸಂಖ್ಯೆ', 'ಗ್ರಾಹಕ', 'ಇಮೇಲ್', 'ಫೋನ್', 'ಮೊತ್ತ', 'ಸ್ಥಿತಿ', 'ಪಾವತಿ', 'ದಿನಾಂಕ'],
      ...orders.map(o => [
        o.orderNumber,
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.totalAmount.toString(),
        statusLabels[o.status],
        paymentLabels[o.paymentStatus],
        formatDate(new Date(o.createdAt))
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('CSV ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ')
  }

  const filtered = orders.filter(o => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return o.orderNumber.toLowerCase().includes(q) || 
           o.customerName.toLowerCase().includes(q) || 
           o.customerEmail.toLowerCase().includes(q) ||
           o.customerPhone.includes(q)
  })

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</p>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಬಾಕಿ ಇರುವ</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</p>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಸಂಸ್ಕರಣೆ</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{stats.processing}</p>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ತಲುಪಿಸಲಾಗಿದೆ</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{stats.delivered}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', color: 'white' }}>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>ಒಟ್ಟು ಆದಾಯ</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="ಆರ್ಡರ್, ಹೆಸರು, ಇಮೇಲ್ ಹುಡುಕಿ..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="input" 
              style={{ paddingLeft: '40px', width: '280px' }} 
            />
          </form>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input select" style={{ width: '160px' }}>
            <option value="">ಎಲ್ಲಾ ಸ್ಥಿತಿ</option>
            <option value="PENDING">ಬಾಕಿ</option>
            <option value="PAID">ಪಾವತಿಸಲಾಗಿದೆ</option>
            <option value="PROCESSING">ಸಂಸ್ಕರಣೆ</option>
            <option value="DISPATCHED">ಕಳುಹಿಸಲಾಗಿದೆ</option>
            <option value="DELIVERED">ತಲುಪಿಸಲಾಗಿದೆ</option>
            <option value="CANCELLED">ರದ್ದು</option>
          </select>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="input select" style={{ width: '160px' }}>
            <option value="">ಎಲ್ಲಾ ಪಾವತಿ</option>
            <option value="PENDING">ಪಾವತಿ ಬಾಕಿ</option>
            <option value="SUCCESS">ಯಶಸ್ವಿ</option>
            <option value="FAILED">ವಿಫಲ</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchOrders} className="btn btn-outline" disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> ರಿಫ್ರೆಶ್
          </button>
          <button onClick={handleExportCSV} className="btn btn-outline" disabled={orders.length === 0}>
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Package size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ</h3>
            <p style={{ color: 'var(--color-text-light)' }}>ಹೊಸ ಆರ್ಡರ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಆರ್ಡರ್</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಗ್ರಾಹಕ</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಐಟಂಗಳು</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಮೊತ್ತ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಸ್ಥಿತಿ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಪಾವತಿ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ದಿನಾಂಕ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಕ್ರಿಯೆ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.125rem' }}>{order.orderNumber}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: 500, margin: 0 }}>{order.customerName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>{order.customerEmail}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{order.customerPhone}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>{order.items.length} ಪುಸ್ತಕ(ಗಳು)</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items.map(i => i.bookTitle).join(', ')}
                      </p>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600, background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.7rem', fontWeight: 500, background: order.paymentStatus === 'SUCCESS' ? '#10b98120' : order.paymentStatus === 'FAILED' ? '#ef444420' : '#f59e0b20', color: order.paymentStatus === 'SUCCESS' ? '#10b981' : order.paymentStatus === 'FAILED' ? '#ef4444' : '#f59e0b' }}>
                        {paymentLabels[order.paymentStatus] || order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                      {formatDate(new Date(order.createdAt))}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Link href={`/admin/orders/${order.id}`} style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
