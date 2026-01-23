'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Tag, Percent, RefreshCw, Copy, Check, ToggleLeft, ToggleRight, Power } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Offer {
  id: string
  name: string
  description: string | null
  code: string | null
  discountType: string
  discountValue: number
  minPurchase: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
}

const defaultFormData = {
  name: '',
  description: '',
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minPurchase: '',
  maxDiscount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
  isActive: true
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Fetch offers from API
  const fetchOffers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/offers')
      const data = await response.json()
      if (data.success) {
        setOffers(data.data)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast.error('ಆಫರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({
        name: offer.name,
        description: offer.description || '',
        code: offer.code || '',
        discountType: offer.discountType,
        discountValue: offer.discountValue.toString(),
        minPurchase: offer.minPurchase?.toString() || '',
        maxDiscount: offer.maxDiscount?.toString() || '',
        usageLimit: offer.usageLimit?.toString() || '',
        startDate: offer.startDate.split('T')[0],
        endDate: offer.endDate.split('T')[0],
        isActive: offer.isActive
      })
    } else {
      setEditingOffer(null)
      setFormData(defaultFormData)
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast.error('ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }

    setIsSubmitting(true)
    try {
      const url = editingOffer ? `/api/admin/offers/${editingOffer.id}` : '/api/admin/offers'
      const method = editingOffer ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          code: formData.code || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          isActive: formData.isActive
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingOffer ? 'ಆಫರ್ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'ಹೊಸ ಆಫರ್ ಸೇರಿಸಲಾಗಿದೆ!')
        setShowModal(false)
        fetchOffers()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ಈ ಆಫರ್ ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?')) return

    try {
      const response = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        toast.success('ಆಫರ್ ಅಳಿಸಲಾಗಿದೆ')
        fetchOffers()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('ಕೋಡ್ ನಕಲಿಸಲಾಗಿದೆ!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Toggle offer active status
  const toggleOfferStatus = async (offer: Offer) => {
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !offer.isActive })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(offer.isActive ? 'ಆಫರ್ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ' : 'ಆಫರ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ')
        fetchOffers()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('ಸ್ಥಿತಿ ಬದಲಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ')
    }
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)
    return offer.isActive && now >= start && now <= end
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>🎁 ರಿಯಾಯಿತಿಗಳು & ಕೂಪನ್‌ಗಳು</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchOffers} className="btn btn-outline" disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> ರಿಫ್ರೆಶ್
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={18} /> ಹೊಸ ಆಫರ್
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಒಟ್ಟು ಆಫರ್‌ಗಳು</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{offers.length}</p>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಸಕ್ರಿಯ ಆಫರ್‌ಗಳು</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{offers.filter(isOfferActive).length}</p>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ಒಟ್ಟು ಬಳಕೆ</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{offers.reduce((sum, o) => sum + o.usedCount, 0)}</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" />
        </div>
      ) : offers.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center' }}>
          <Tag size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>ಯಾವುದೇ ಆಫರ್‌ಗಳಿಲ್ಲ</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>ಹೊಸ ರಿಯಾಯಿತಿ ಕೋಡ್ ರಚಿಸಿ</p>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={18} /> ಆಫರ್ ಸೇರಿಸಿ
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {offers.map(offer => {
            const active = isOfferActive(offer)
            return (
              <div key={offer.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: active ? 1 : 0.6, borderLeft: `4px solid ${active ? 'var(--color-success)' : 'var(--color-text-muted)'}` }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: offer.discountType === 'percentage' ? '#8b5cf620' : '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {offer.discountType === 'percentage' ? <Percent size={24} style={{ color: '#8b5cf6' }} /> : <Tag size={24} style={{ color: '#10b981' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{offer.name}</h3>
                    {offer.code && (
                      <button
                        onClick={() => copyCode(offer.code!)}
                        style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {offer.code}
                        {copiedCode === offer.code ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    )}
                    <span style={{ fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)', background: active ? '#10b98120' : '#f5955020', color: active ? '#10b981' : '#f59e0b' }}>
                      {active ? 'ಸಕ್ರಿಯ' : 'ನಿಷ್ಕ್ರಿಯ'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% ರಿಯಾಯಿತಿ` : `${formatCurrency(offer.discountValue)} ರಿಯಾಯಿತಿ`}
                    {offer.minPurchase && ` • ಕನಿಷ್ಠ ₹${offer.minPurchase}`}
                    {offer.maxDiscount && ` • ಗರಿಷ್ಠ ₹${offer.maxDiscount}`}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                    <span><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{formatDate(new Date(offer.startDate))} - {formatDate(new Date(offer.endDate))}</span>
                    <span>ಬಳಕೆ: {offer.usedCount}{offer.usageLimit ? `/${offer.usageLimit}` : ''}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Toggle Button */}
                  <button 
                    onClick={() => toggleOfferStatus(offer)} 
                    title={offer.isActive ? 'ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ' : 'ಸಕ್ರಿಯಗೊಳಿಸಿ'}
                    style={{ 
                      width: '44px', 
                      height: '28px', 
                      borderRadius: '14px', 
                      background: offer.isActive ? 'var(--color-success)' : '#d1d5db', 
                      border: 'none', 
                      cursor: 'pointer', 
                      position: 'relative',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: offer.isActive ? '18px' : '2px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                  <button onClick={() => handleOpenModal(offer)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(offer.id)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: 'var(--color-error)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingOffer ? 'ಆಫರ್ ಸಂಪಾದಿಸಿ' : 'ಹೊಸ ಆಫರ್'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಹೆಸರು *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="ಹೊಸ ವರ್ಷದ ಆಫರ್" required /></div>
                  <div><label className="label">ಕೂಪನ್ ಕೋಡ್</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input" style={{ textTransform: 'uppercase' }} placeholder="NEWYEAR24" /></div>
                </div>
                <div><label className="label">ವಿವರಣೆ</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input" rows={2} placeholder="ಆಫರ್ ವಿವರಣೆ..." /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">ರಿಯಾಯಿತಿ ಪ್ರಕಾರ</label>
                    <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="input select">
                      <option value="percentage">ಶೇಕಡಾ (%)</option>
                      <option value="fixed">ಸ್ಥಿರ ಮೊತ್ತ (₹)</option>
                    </select>
                  </div>
                  <div><label className="label">ಮೌಲ್ಯ *</label><input type="number" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} className="input" placeholder={formData.discountType === 'percentage' ? '10' : '100'} required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಕನಿಷ್ಠ ಆರ್ಡರ್ (₹)</label><input type="number" value={formData.minPurchase} onChange={e => setFormData({ ...formData, minPurchase: e.target.value })} className="input" placeholder="500" /></div>
                  <div><label className="label">ಗರಿಷ್ಠ ರಿಯಾಯಿತಿ (₹)</label><input type="number" value={formData.maxDiscount} onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} className="input" placeholder="200" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಪ್ರಾರಂಭ ದಿನಾಂಕ *</label><input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="input" required /></div>
                  <div><label className="label">ಅಂತಿಮ ದಿನಾಂಕ *</label><input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="input" required /></div>
                </div>
                <div><label className="label">ಬಳಕೆ ಮಿತಿ</label><input type="number" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="input" placeholder="ಅಪರಿಮಿತಕ್ಕೆ ಖಾಲಿ ಬಿಡಿ" /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }} />
                  <span>ಸಕ್ರಿಯ</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>ರದ್ದು</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : editingOffer ? 'ನವೀಕರಿಸಿ' : 'ಸೇರಿಸಿ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
