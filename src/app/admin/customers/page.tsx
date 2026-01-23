'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye, RefreshCw, Users, ShoppingBag, TrendingUp, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  state: string | null
  stats: {
    totalOrders: number
    totalRevenue: number
    lastOrderDate: string | null
  }
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({ total: 0, totalRevenue: 0, avgOrderValue: 0 })

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data)
        
        // Calculate aggregate stats
        const total = data.data.length
        const totalRev = data.data.reduce((sum: number, c: Customer) => sum + c.stats.totalRevenue, 0)
        const totalOrders = data.data.reduce((sum: number, c: Customer) => sum + c.stats.totalOrders, 0)
        
        setStats({
          total,
          totalRevenue: totalRev,
          avgOrderValue: totalOrders > 0 ? totalRev / totalOrders : 0
        })
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('ಗ್ರಾಹಕರ ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filters handled on client side for now as API returns all
  }

  const filtered = customers.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.email.toLowerCase().includes(q) || 
           c.name.toLowerCase().includes(q) || 
           (c.phone && c.phone.includes(q))
  })

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>👥 ಗ್ರಾಹಕ ನಿರ್ವಹಣೆ</h2>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>ನಿಮ್ಮ ಎಲ್ಲಾ ಗ್ರಾಹಕರನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ಒಟ್ಟು ಗ್ರಾಹಕರು</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stats.total}</p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ಒಟ್ಟು ಆದಾಯ</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>ಸರಾಸರಿ ಆರ್ಡರ್ ಮೌಲ್ಯ</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(stats.avgOrderValue)}</p>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="ಹೆಸರು, ಇಮೇಲ್, ಫೋನ್ ಹುಡುಕಿ..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="input" 
            style={{ paddingLeft: '40px', width: '320px' }} 
          />
        </form>
        <button onClick={fetchCustomers} className="btn btn-outline" disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> ರಿಫ್ರೆಶ್
        </button>
      </div>

      {/* Customers List */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Users size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>ಯಾವುದೇ ಗ್ರಾಹಕರಿಲ್ಲ</h3>
            <p style={{ color: 'var(--color-text-light)' }}>ನೋಂದಾಯಿತ ಗ್ರಾಹಕರು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತಾರೆ</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0' }}>
            {filtered.map((customer, index) => (
              <div 
                key={customer.id} 
                style={{ 
                  padding: '1.25rem', 
                  borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1fr) auto auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    background: 'var(--color-primary-50)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 700, 
                    color: 'var(--color-primary)',
                    fontSize: '1.25rem'
                  }}>
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1rem' }}>{customer.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={14} /> {customer.email}
                      </span>
                      {customer.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={14} /> {customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location & Last Order */}
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', minWidth: '150px' }}>
                  {(customer.city || customer.state) && (
                    <div style={{ marginBottom: '0.25rem' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {customer.city}{customer.city && customer.state ? ', ' : ''}{customer.state}
                    </div>
                  )}
                  {customer.stats.lastOrderDate && (
                    <div title="Last Order Date">
                      <ShoppingBag size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {formatDate(new Date(customer.stats.lastOrderDate))}
                    </div>
                  )}
                </div>

                {/* Stats & Actions */}
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>{customer.stats.totalOrders} ಆರ್ಡರ್‌ಗಳು</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(customer.stats.totalRevenue)}</p>
                  </div>
                  <Link 
                    href={`/admin/customers/${customer.id}`} 
                    className="btn btn-outline"
                    style={{ padding: '0.5rem', height: 'auto', borderRadius: '50%' }}
                    title="View History"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
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
