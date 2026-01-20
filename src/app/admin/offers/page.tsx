'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Calendar, Tag, Percent } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const mockOffers = [
  { id: '1', title: 'ಹೊಸ ವರ್ಷದ ಆಫರ್', titleEn: 'New Year Offer', code: 'NEWYEAR24', discountType: 'PERCENTAGE', discountValue: 20, minOrderValue: 500, maxDiscount: 200, usageLimit: 100, usedCount: 45, startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31'), isActive: true },
  { id: '2', title: 'ಸಂಕ್ರಾಂತಿ ಸ್ಪೆಷಲ್', titleEn: 'Sankranti Special', code: 'SANKRANTI', discountType: 'FIXED', discountValue: 100, minOrderValue: 400, maxDiscount: null, usageLimit: 50, usedCount: 30, startDate: new Date('2024-01-14'), endDate: new Date('2024-01-16'), isActive: true },
  { id: '3', title: 'ಮೊದಲ ಆರ್ಡರ್', titleEn: 'First Order', code: 'FIRST10', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 200, maxDiscount: 100, usageLimit: null, usedCount: 200, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isActive: true }
]

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(mockOffers)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<typeof mockOffers[0] | null>(null)
  const [formData, setFormData] = useState({ title: '', titleEn: '', code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', isActive: true })

  const handleOpenModal = (offer?: typeof mockOffers[0]) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({ title: offer.title, titleEn: offer.titleEn || '', code: offer.code, discountType: offer.discountType, discountValue: offer.discountValue.toString(), minOrderValue: offer.minOrderValue?.toString() || '', maxDiscount: offer.maxDiscount?.toString() || '', usageLimit: offer.usageLimit?.toString() || '', startDate: offer.startDate.toISOString().split('T')[0], endDate: offer.endDate.toISOString().split('T')[0], isActive: offer.isActive })
    } else {
      setEditingOffer(null)
      setFormData({ title: '', titleEn: '', code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', isActive: true })
    }
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.code || !formData.discountValue) { toast.error('ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ'); return }
    toast.success(editingOffer ? 'ಆಫರ್ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'ಹೊಸ ಆಫರ್ ಸೇರಿಸಲಾಗಿದೆ!')
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('ಈ ಆಫರ್ ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?')) {
      setOffers(offers.filter(o => o.id !== id))
      toast.success('ಆಫರ್ ಅಳಿಸಲಾಗಿದೆ')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ರಿಯಾಯಿತಿಗಳು & ಆಫರ್‌ಗಳು</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary"><Plus size={18} /> ಹೊಸ ಆಫರ್</button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {offers.map(offer => (
          <div key={offer.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: offer.isActive ? 1 : 0.6 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: offer.discountType === 'PERCENTAGE' ? '#8b5cf620' : '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {offer.discountType === 'PERCENTAGE' ? <Percent size={28} style={{ color: '#8b5cf6' }} /> : <Tag size={28} style={{ color: '#10b981' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{offer.title}</h3>
                <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600 }}>{offer.code}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% ರಿಯಾಯಿತಿ` : `${formatCurrency(offer.discountValue)} ರಿಯಾಯಿತಿ`}
                {offer.minOrderValue && ` • ಕನಿಷ್ಠ ₹${offer.minOrderValue}`}
                {offer.maxDiscount && ` • ಗರಿಷ್ಠ ₹${offer.maxDiscount}`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                <span>ಬಳಕೆ: {offer.usedCount}{offer.usageLimit ? `/${offer.usageLimit}` : ''}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleOpenModal(offer)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={16} /></button>
              <button onClick={() => handleDelete(offer.id)} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: 'var(--color-error)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingOffer ? 'ಆಫರ್ ಸಂಪಾದಿಸಿ' : 'ಹೊಸ ಆಫರ್'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಶೀರ್ಷಿಕೆ *</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input" required /></div>
                  <div><label className="label">ಕೋಡ್ *</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input" style={{ textTransform: 'uppercase' }} required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ರಿಯಾಯಿತಿ ಪ್ರಕಾರ</label><select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="input select"><option value="PERCENTAGE">ಶೇಕಡಾ (%)</option><option value="FIXED">ಸ್ಥಿರ ಮೊತ್ತ (₹)</option></select></div>
                  <div><label className="label">ಮೌಲ್ಯ *</label><input type="number" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} className="input" required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಕನಿಷ್ಠ ಆರ್ಡರ್ (₹)</label><input type="number" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })} className="input" /></div>
                  <div><label className="label">ಗರಿಷ್ಠ ರಿಯಾಯಿತಿ (₹)</label><input type="number" value={formData.maxDiscount} onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} className="input" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಪ್ರಾರಂಭ ದಿನಾಂಕ</label><input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="input" /></div>
                  <div><label className="label">ಅಂತಿಮ ದಿನಾಂಕ</label><input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="input" /></div>
                </div>
                <div><label className="label">ಬಳಕೆ ಮಿತಿ</label><input type="number" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="input" placeholder="ಅಪರಿಮಿತ ಗಾಗಿ ಖಾಲಿ ಬಿಡಿ" /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: 'var(--color-primary)' }} /><span>ಸಕ್ರಿಯ</span></label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>ರದ್ದು</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingOffer ? 'ಉಳಿಸಿ' : 'ಸೇರಿಸಿ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
