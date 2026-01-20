'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingCart,
  BookOpen,
  Tag,
  IndianRupee,
  Package,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock dashboard data
const mockStats = {
  totalRevenue: 256780,
  revenueChange: 12.5,
  totalOrders: 145,
  ordersChange: 8.2,
  totalBooks: 200,
  activeOffers: 5,
  pendingOrders: 12
}

const mockRecentOrders = [
  {
    id: '1',
    orderNumber: 'SP-2024-001',
    customerName: 'ರಾಜೇಶ್ ಕುಮಾರ್',
    totalAmount: 1250,
    status: 'PAID',
    createdAt: new Date()
  },
  {
    id: '2',
    orderNumber: 'SP-2024-002',
    customerName: 'ಪ್ರಿಯಾ ಶ್ರೀನಿವಾಸ್',
    totalAmount: 899,
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    orderNumber: 'SP-2024-003',
    customerName: 'ಮಹೇಶ್ ಗೌಡ',
    totalAmount: 2150,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    id: '4',
    orderNumber: 'SP-2024-004',
    customerName: 'ಲಕ್ಷ್ಮಿ ದೇವಿ',
    totalAmount: 450,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 86400000)
  }
]

const mockBestSellers = [
  { id: '1', title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', salesCount: 150, revenue: 59850 },
  { id: '2', title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ', salesCount: 120, revenue: 83880 },
  { id: '3', title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', salesCount: 95, revenue: 47025 },
  { id: '4', title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು', salesCount: 80, revenue: 11920 }
]

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b',
  PAID: '#10b981',
  PROCESSING: '#3b82f6',
  DISPATCHED: '#8b5cf6',
  DELIVERED: '#059669',
  CANCELLED: '#ef4444'
}

const statusLabels: Record<string, string> = {
  PENDING: 'ಬಾಕಿ',
  PAID: 'ಪಾವತಿ',
  PROCESSING: 'ಪ್ರಕ್ರಿಯೆ',
  DISPATCHED: 'ಕಳುಹಿಸಲಾಗಿದೆ',
  DELIVERED: 'ತಲುಪಿಸಲಾಗಿದೆ',
  CANCELLED: 'ರದ್ದು'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders)
  const [bestSellers, setBestSellers] = useState(mockBestSellers)
  
  return (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Revenue */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <IndianRupee size={24} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: stats.revenueChange >= 0 ? 'var(--color-success)' : 'var(--color-error)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {stats.revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(stats.revenueChange)}%
            </div>
          </div>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.25rem' 
          }}>
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)',
            margin: 0
          }}>
            ಒಟ್ಟು ಆದಾಯ
          </p>
        </div>
        
        {/* Total Orders */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <ShoppingCart size={24} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: stats.ordersChange >= 0 ? 'var(--color-success)' : 'var(--color-error)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {stats.ordersChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(stats.ordersChange)}%
            </div>
          </div>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.25rem' 
          }}>
            {stats.totalOrders}
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)',
            margin: 0
          }}>
            ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು
          </p>
        </div>
        
        {/* Total Books */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BookOpen size={24} />
            </div>
          </div>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.25rem' 
          }}>
            {stats.totalBooks}
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)',
            margin: 0
          }}>
            ಒಟ್ಟು ಪುಸ್ತಕಗಳು
          </p>
        </div>
        
        {/* Pending Orders */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Clock size={24} />
            </div>
          </div>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.25rem' 
          }}>
            {stats.pendingOrders}
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)',
            margin: 0
          }}>
            ಬಾಕಿ ಆರ್ಡರ್‌ಗಳು
          </p>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
      }}>
        {/* Recent Orders */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು
            </h2>
            <Link 
              href="/admin/orders"
              style={{
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              ಎಲ್ಲಾ ನೋಡಿ →
            </Link>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-light)',
                  textTransform: 'uppercase'
                }}>
                  ಆರ್ಡರ್
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-light)',
                  textTransform: 'uppercase'
                }}>
                  ಗ್ರಾಹಕ
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-light)',
                  textTransform: 'uppercase'
                }}>
                  ಮೊತ್ತ
                </th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-light)',
                  textTransform: 'uppercase'
                }}>
                  ಸ್ಥಿತಿ
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr 
                  key={order.id}
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {order.customerName}
                  </td>
                  <td style={{ 
                    padding: '1rem 0.75rem',
                    textAlign: 'right',
                    fontWeight: 600
                  }}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td style={{ 
                    padding: '1rem 0.75rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: `${statusColors[order.status]}20`,
                      color: statusColors[order.status]
                    }}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Best Sellers */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              <TrendingUp size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ಅತ್ಯುತ್ತಮ ಮಾರಾಟ
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bestSellers.map((book, index) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#f97316' : 'var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: index < 3 ? 'white' : 'var(--color-text)'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontWeight: 500, 
                    marginBottom: '0.125rem',
                    fontSize: '0.9375rem'
                  }}>
                    {book.title}
                  </p>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-text-light)',
                    margin: 0
                  }}>
                    {book.salesCount} ಮಾರಾಟ
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    fontWeight: 600, 
                    color: 'var(--color-success)',
                    marginBottom: 0
                  }}>
                    {formatCurrency(book.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <Link
          href="/admin/books/new"
          className="btn btn-primary btn-lg"
          style={{ justifyContent: 'center' }}
        >
          <BookOpen size={20} />
          ಹೊಸ ಪುಸ್ತಕ ಸೇರಿಸಿ
        </Link>
        <Link
          href="/admin/orders"
          className="btn btn-outline btn-lg"
          style={{ justifyContent: 'center' }}
        >
          <Package size={20} />
          ಆರ್ಡರ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ
        </Link>
        <Link
          href="/admin/offers/new"
          className="btn btn-outline btn-lg"
          style={{ justifyContent: 'center' }}
        >
          <Tag size={20} />
          ಹೊಸ ಆಫರ್ ರಚಿಸಿ
        </Link>
        <Link
          href="/admin/analytics"
          className="btn btn-outline btn-lg"
          style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', border: 'none' }}
        >
          <BarChart3 size={20} />
          ವಿಶ್ಲೇಷಣೆ ನೋಡಿ
        </Link>
      </div>
    </div>
  )
}
