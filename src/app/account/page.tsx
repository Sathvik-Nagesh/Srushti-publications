'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Package,
  MapPin,
  LogOut,
  Edit2,
  Save,
  X,
  ShoppingBag,
  ChevronRight,
  Heart,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/lib/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  items: Array<{
    bookTitle: string
    quantity: number
  }>
}

export default function AccountPage() {
  const router = useRouter()
  const { customer, isLoading, isAuthenticated, logout, updateProfile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address'>('orders')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || ''
      })
    }
  }, [customer])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/customer/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleSave = async () => {
    const result = await updateProfile(formData)
    if (result.success) {
      toast.success('ಪ್ರೊಫೈಲ್ ಅಪ್ಡೇಟ್ ಆಗಿದೆ!')
      setIsEditing(false)
    } else {
      toast.error(result.error || 'ಅಪ್ಡೇಟ್ ವಿಫಲ')
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('ಲಾಗ್ ಔಟ್ ಆಗಿದೆ')
    router.push('/')
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'ಬಾಕಿ', color: '#f59e0b' },
      PAID: { label: 'ಪಾವತಿಸಲಾಗಿದೆ', color: '#10b981' },
      PROCESSING: { label: 'ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ', color: '#3b82f6' },
      DISPATCHED: { label: 'ರವಾನೆಯಾಗಿದೆ', color: '#8b5cf6' },
      DELIVERED: { label: 'ತಲುಪಿದೆ', color: '#10b981' },
      CANCELLED: { label: 'ರದ್ದುಮಾಡಲಾಗಿದೆ', color: '#ef4444' }
    }
    const s = statusMap[status] || { label: status, color: '#6b7280' }
    return (
      <span style={{
        background: `${s.color}20`,
        color: s.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600
      }}>
        {s.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="spinner" style={{ width: 40, height: 40 }} />
        </main>
        <Footer />
      </>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <main className="main-content" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* User Info */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 auto 1rem'
                  }}>
                    {customer?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {customer?.name}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    {customer?.email}
                  </p>
                </div>

                {/* Nav */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === 'orders' ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 500
                    }}
                  >
                    <Package size={20} />
                    ನನ್ನ ಆರ್ಡರ್‌ಗಳು
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === 'profile' ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 500
                    }}
                  >
                    <User size={20} />
                    ಪ್ರೊಫೈಲ್
                  </button>
                  <button
                    onClick={() => setActiveTab('address')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: activeTab === 'address' ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === 'address' ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 500
                    }}
                  >
                    <MapPin size={20} />
                    ವಿಳಾಸ
                  </button>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      color: 'var(--color-error)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 500
                    }}
                  >
                    <LogOut size={20} />
                    ಲಾಗ್ ಔಟ್
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    ನನ್ನ ಆರ್ಡರ್‌ಗಳು
                  </h1>

                  {isLoadingOrders ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <span className="spinner" style={{ width: 32, height: 32 }} />
                    </div>
                  ) : orders.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem',
                      background: 'white',
                      borderRadius: 'var(--radius-xl)'
                    }}>
                      <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                      <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>ಇನ್ನೂ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ</p>
                      <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                        ಈಗ ಶಾಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ!
                      </p>
                      <Link href="/books" className="btn btn-primary">
                        ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.map(order => (
                        <Link
                          key={order.id}
                          href={`/order-confirmation?order=${order.orderNumber}`}
                          style={{
                            display: 'block',
                            background: 'white',
                            borderRadius: 'var(--radius-xl)',
                            padding: '1.25rem',
                            textDecoration: 'none',
                            color: 'inherit',
                            border: '1px solid var(--color-border)',
                            transition: 'border-color 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div>
                              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                #{order.orderNumber}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                {new Date(order.createdAt).toLocaleDateString('kn-IN')}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {getStatusBadge(order.status)}
                              <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                                {formatCurrency(order.totalAmount)}
                              </p>
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--color-border)'
                          }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                              {order.items.map(i => `${i.bookTitle} (×${i.quantity})`).join(', ').substring(0, 50)}...
                            </p>
                            <ChevronRight size={20} style={{ color: 'var(--color-text-muted)' }} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ಪ್ರೊಫೈಲ್</h1>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Edit2 size={18} />
                        ಎಡಿಟ್
                      </button>
                    )}
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                      <div>
                        <label className="label">ಹೆಸರು</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          <p style={{ fontWeight: 500 }}>{customer?.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="label">ಇ-ಮೇಲ್</label>
                        <p style={{ fontWeight: 500 }}>{customer?.email}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          ಇ-ಮೇಲ್ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ
                        </p>
                      </div>
                      <div>
                        <label className="label">ಫೋನ್</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            className="input"
                            value={formData.phone}
                            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        ) : (
                          <p style={{ fontWeight: 500 }}>{customer?.phone || '-'}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={handleSave} className="btn btn-primary">
                          <Save size={18} />
                          ಉಳಿಸಿ
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                          <X size={18} />
                          ರದ್ದುಮಾಡಿ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ</h1>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Edit2 size={18} />
                        ಎಡಿಟ್
                      </button>
                    )}
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                      <div>
                        <label className="label">ವಿಳಾಸ</label>
                        {isEditing ? (
                          <textarea
                            className="input"
                            rows={2}
                            value={formData.address}
                            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          />
                        ) : (
                          <p style={{ fontWeight: 500 }}>{customer?.address || '-'}</p>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label className="label">ನಗರ</label>
                          {isEditing ? (
                            <input
                              type="text"
                              className="input"
                              value={formData.city}
                              onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            />
                          ) : (
                            <p style={{ fontWeight: 500 }}>{customer?.city || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="label">ರಾಜ್ಯ</label>
                          {isEditing ? (
                            <input
                              type="text"
                              className="input"
                              value={formData.state}
                              onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                            />
                          ) : (
                            <p style={{ fontWeight: 500 }}>{customer?.state || 'Karnataka'}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="label">ಪಿನ್‌ಕೋಡ್</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="input"
                            value={formData.pincode}
                            onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                          />
                        ) : (
                          <p style={{ fontWeight: 500 }}>{customer?.pincode || '-'}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={handleSave} className="btn btn-primary">
                          <Save size={18} />
                          ಉಳಿಸಿ
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                          <X size={18} />
                          ರದ್ದುಮಾಡಿ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
