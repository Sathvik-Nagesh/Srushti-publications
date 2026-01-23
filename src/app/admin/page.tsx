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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalBooks: number
  activeOffers: number
  pendingOrders: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

interface BestSeller {
  id: string
  title: string
  salesCount: number
  revenue: number
}

interface WeeklyRevenue {
  day: string
  revenue: number
  orders: number
}

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
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalBooks: 0,
    activeOffers: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([])
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      if (data.success) {
        setStats(data.data.stats)
        setRecentOrders(data.data.recentOrders)
        setBestSellers(data.data.bestSellers)
        setWeeklyRevenue(data.data.weeklyRevenue)
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard')
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Find max revenue for chart scaling
  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.revenue), 1)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    )
  }

  return (
    <div>
      {/* Header with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>📊 ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಾರಾಂಶ</h2>
        <button onClick={fetchDashboardData} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> ರಿಫ್ರೆಶ್
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#dc2626'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

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
            {stats.revenueChange !== 0 && (
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
            )}
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
            ಕಳೆದ 30 ದಿನಗಳ ಆದಾಯ
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
            {stats.ordersChange !== 0 && (
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
            )}
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
            ಕಳೆದ 30 ದಿನಗಳ ಆರ್ಡರ್‌ಗಳು
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
              background: stats.pendingOrders > 0 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Clock size={24} />
            </div>
            {stats.pendingOrders > 0 && (
              <span style={{
                background: '#fef3c7',
                color: '#d97706',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                ಗಮನ ಬೇಕು
              </span>
            )}
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

      {/* Charts and Revenue Section */}
      {weeklyRevenue.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} style={{ color: 'var(--color-primary)' }} />
            ವಾರದ ಆದಾಯ
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', height: '140px', alignItems: 'flex-end' }}>
            {weeklyRevenue.map((day, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '40px',
                    height: `${Math.max((day.revenue / maxRevenue) * 100, 5)}px`,
                    background: day.revenue > 0 ? 'linear-gradient(180deg, var(--color-primary), var(--color-primary-dark))' : '#e5e7eb',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    transition: 'height 0.3s ease'
                  }}
                  title={`₹${day.revenue} (${day.orders} ಆರ್ಡರ್)`}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
          
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              <Package size={32} style={{ marginBottom: '0.5rem' }} />
              <p>ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.15s'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: '0.125rem' }}>{order.orderNumber}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: 0 }}>
                      {order.customerName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{formatCurrency(order.totalAmount)}</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      background: `${statusColors[order.status]}20`,
                      color: statusColors[order.status]
                    }}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
          
          {bestSellers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              <BookOpen size={32} style={{ marginBottom: '0.5rem' }} />
              <p>ಮಾರಾಟ ಡೇಟಾ ಇಲ್ಲ</p>
            </div>
          ) : (
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
                      fontSize: '0.9375rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
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
          )}
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
          href="/admin/offers"
          className="btn btn-outline btn-lg"
          style={{ justifyContent: 'center' }}
        >
          <Tag size={20} />
          ಆಫರ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ
        </Link>
      </div>
    </div>
  )
}
