'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockOrders = [
  { id: '1', orderNumber: 'SP-2024-001', customerName: 'ರಾಜೇಶ್', customerEmail: 'raj@example.com', totalAmount: 1250, status: 'PAID', createdAt: new Date() },
  { id: '2', orderNumber: 'SP-2024-002', customerName: 'ಪ್ರಿಯಾ', customerEmail: 'priya@example.com', totalAmount: 899, status: 'DISPATCHED', createdAt: new Date() },
  { id: '3', orderNumber: 'SP-2024-003', customerName: 'ಮಹೇಶ್', customerEmail: 'mahesh@example.com', totalAmount: 2150, status: 'PENDING', createdAt: new Date() },
  { id: '4', orderNumber: 'SP-2024-004', customerName: 'ಲಕ್ಷ್ಮಿ', customerEmail: 'lakshmi@example.com', totalAmount: 450, status: 'DELIVERED', createdAt: new Date() }
]

const statusColors: Record<string, string> = { PENDING: '#f59e0b', PAID: '#10b981', DISPATCHED: '#8b5cf6', DELIVERED: '#059669', CANCELLED: '#ef4444' }
const statusLabels: Record<string, string> = { PENDING: 'ಬಾಕಿ', PAID: 'ಪಾವತಿ', DISPATCHED: 'ಕಳುಹಿಸಲಾಗಿದೆ', DELIVERED: 'ತಲುಪಿಸಲಾಗಿದೆ', CANCELLED: 'ರದ್ದು' }

export default function AdminOrdersPage() {
  const [orders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.includes(searchQuery) || o.customerName.includes(searchQuery)
    const matchStatus = !filterStatus || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="ಆರ್ಡರ್ ಹುಡುಕಿ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input" style={{ paddingLeft: '40px', width: '280px' }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input select" style={{ width: '150px' }}>
            <option value="">ಎಲ್ಲಾ ಸ್ಥಿತಿ</option>
            <option value="PENDING">ಬಾಕಿ</option>
            <option value="PAID">ಪಾವತಿ</option>
            <option value="DISPATCHED">ಕಳುಹಿಸಲಾಗಿದೆ</option>
            <option value="DELIVERED">ತಲುಪಿಸಲಾಗಿದೆ</option>
          </select>
        </div>
        <button className="btn btn-outline"><Download size={16} /> CSV ರಫ್ತು</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-alt)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಆರ್ಡರ್</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಗ್ರಾಹಕ</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಮೊತ್ತ</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಸ್ಥಿತಿ</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ದಿನಾಂಕ</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಕ್ರಿಯೆ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{order.orderNumber}</td>
                <td style={{ padding: '1rem' }}><p style={{ fontWeight: 500, margin: 0 }}>{order.customerName}</p><p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>{order.customerEmail}</p></td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}><span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600, background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>{statusLabels[order.status]}</span></td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{formatDate(order.createdAt)}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}><Link href={`/admin/orders/${order.id}`} style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}><Eye size={16} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
