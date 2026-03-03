'use client'

import { useState, useEffect } from 'react'
import { 
  Tag, Globe, FolderOpen, RotateCcw, Eye, Zap, AlertTriangle, CheckCircle,
  TrendingDown, Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDiscountLabel, type DiscountType } from '@/lib/discount'
import { formatCurrency } from '@/lib/utils'

interface Category { id: string; name: string; nameEn?: string }

interface PreviewItem {
  title: string
  mrp: number
  oldSellingPrice: number
  newSellingPrice: number
}

interface PreviewData {
  affectedCount: number
  sample: PreviewItem[]
}

export default function GlobalDiscountPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [scope, setScope] = useState<'all' | 'category'>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [mode, setMode] = useState<'override' | 'stack'>('override')
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.data) })
  }, [])

  const discountNum = parseFloat(discountValue) || 0

  const handlePreview = async () => {
    if (!discountNum) { toast.error('ರಿಯಾಯಿತಿ ಮೊತ್ತ ನಮೂದಿಸಿ'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/global-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountType, discountValue: discountNum,
          scope, categoryIds: selectedCategories, mode, preview: true,
        }),
      })
      const data = await res.json()
      if (data.success) setPreview(data)
      else toast.error(data.error || 'ಮುನ್ನೋಟ ವಿಫಲ')
    } catch {
      toast.error('ನೆಟ್‌ವರ್ಕ್ ದೋಷ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    if (!discountNum) { toast.error('ರಿಯಾಯಿತಿ ಮೊತ್ತ ನಮೂದಿಸಿ'); return }
    if (!confirm(`${preview?.affectedCount || '?'} ಪುಸ್ತಕಗಳಿಗೆ ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಲು ಖಚಿತಪಡಿಸಿ`)) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/global-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountType, discountValue: discountNum,
          scope, categoryIds: selectedCategories, mode, preview: false,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setPreview(null)
      } else {
        toast.error(data.error || 'ರಿಯಾಯಿತಿ ಅನ್ವಯ ವಿಫಲ')
      }
    } catch {
      toast.error('ನೆಟ್‌ವರ್ಕ್ ದೋಷ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('ಎಲ್ಲಾ ರಿಯಾಯಿತಿ ತೆಗೆದು ಹಾಕಿ ಮೂಲ ಬೆಲೆ ಮರಳಿ ಹೊಂದಿಸಲು ಖಚಿತಪಡಿಸಿ?')) return
    setIsResetting(true)
    try {
      const res = await fetch('/api/admin/global-discount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, categoryIds: selectedCategories }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setPreview(null)
      } else {
        toast.error(data.error || 'ರೀಸೆಟ್ ವಿಫಲ')
      }
    } catch {
      toast.error('ನೆಟ್‌ವರ್ಕ್ ದೋಷ')
    } finally {
      setIsResetting(false)
    }
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TrendingDown color="var(--color-primary)" size={28} />
          ಜಾಗತಿಕ ರಿಯಾಯಿತಿ ನಿರ್ವಹಣೆ
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          ಎಲ್ಲಾ ಪುಸ್ತಕಗಳಿಗೆ ಅಥವಾ ಆಯ್ದ ವರ್ಗಗಳಿಗೆ ಒಂದೇ ಸಮಯದಲ್ಲಿ ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಿ.
          ಮೂಲ MRP ಬದಲಾಗುವುದಿಲ್ಲ.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Discount Type & Value */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={20} color="var(--color-primary)" /> ರಿಯಾಯಿತಿ ಹೊಂದಿಸಿ
          </h2>

          {/* Type Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {(['percentage', 'fixed'] as DiscountType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setDiscountType(type)}
                style={{
                  flex: 1, padding: '0.75rem',
                  border: `2px solid ${discountType === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: discountType === type ? 'var(--color-primary)' : 'white',
                  color: discountType === type ? 'white' : 'var(--color-text)',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {type === 'percentage' ? '% ಶೇಕಡಾ ರಿಯಾಯಿತಿ' : '₹ ಸ್ಥಿರ ರಿಯಾಯಿತಿ'}
              </button>
            ))}
          </div>

          {/* Value Input */}
          <div style={{ position: 'relative', maxWidth: 280 }}>
            <span style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text-muted)',
            }}>
              {discountType === 'percentage' ? '%' : '₹'}
            </span>
            <input
              type="number"
              className="input"
              value={discountValue}
              onChange={e => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? '10' : '50'}
              min="1"
              max={discountType === 'percentage' ? '90' : undefined}
              style={{ paddingLeft: '2.5rem', fontSize: '1.125rem', fontWeight: 600 }}
            />
          </div>
          {discountNum > 0 && (
            <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
              → {formatDiscountLabel(discountType, discountNum)} ಎಲ್ಲಾ ಆಯ್ದ ಪುಸ್ತಕಗಳಿಗೆ
            </p>
          )}
        </div>

        {/* Mode */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="var(--color-primary)" /> ಅನ್ವಯ ಮೋಡ್
          </h2>
          {[
            {
              value: 'override',
              title: 'MRP ನಿಂದ ಅನ್ವಯಿಸಿ (ಶಿಫಾರಸು)',
              desc: 'ಪ್ರತಿ ಪುಸ್ತಕದ MRP ಆಧಾರದ ಮೇಲೆ ರಿಯಾಯಿತಿ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ. ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ರಿಯಾಯಿತಿ ತೆಗೆದು ಹೊಸದು ಹೊಂದಿಸಲಾಗುತ್ತದೆ.',
            },
            {
              value: 'stack',
              title: 'ಅಸ್ತಿತ್ವದ ಬೆಲೆ ಮೇಲೆ ಅನ್ವಯಿಸಿ',
              desc: 'ಪ್ರಸ್ತುತ ಮಾರಾಟ ಬೆಲೆ ಆಧಾರದ ಮೇಲೆ ಹೆಚ್ಚುವರಿ ರಿಯಾಯಿತಿ ನೀಡಲಾಗುತ್ತದೆ (stack discount).',
            },
          ].map(opt => (
            <label key={opt.value} style={{
              display: 'flex', gap: '0.75rem', padding: '0.875rem 1rem', marginBottom: '0.75rem',
              border: `2px solid ${mode === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              background: mode === opt.value ? 'var(--color-primary-50)' : 'white',
            }}>
              <input
                type="radio"
                value={opt.value}
                checked={mode === opt.value}
                onChange={() => setMode(opt.value as 'override' | 'stack')}
                style={{ marginTop: '3px', accentColor: 'var(--color-primary)' }}
              />
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{opt.title}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Scope */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--color-primary)" /> ಯಾವ ಪುಸ್ತಕಗಳಿಗೆ?
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { value: 'all', label: '🌐 ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು', icon: <Globe size={16} /> },
              { value: 'category', label: '📁 ಆಯ್ದ ವರ್ಗಗಳು', icon: <FolderOpen size={16} /> },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setScope(opt.value as 'all' | 'category')}
                style={{
                  flex: 1, padding: '0.75rem',
                  border: `2px solid ${scope === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: scope === opt.value ? 'var(--color-primary)' : 'white',
                  color: scope === opt.value ? 'white' : 'var(--color-text)',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {scope === 'category' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    border: `2px solid ${selectedCategories.includes(cat.id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: '50px',
                    background: selectedCategories.includes(cat.id) ? 'var(--color-primary)' : 'white',
                    color: selectedCategories.includes(cat.id) ? 'white' : 'var(--color-text)',
                    cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                >
                  <Package size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {cat.name}
                </button>
              ))}
              {categories.length === 0 && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>ವರ್ಗಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
              )}
            </div>
          )}
        </div>

        {/* Preview Results */}
        {preview && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', marginBottom: '1rem' }}>
              <Eye size={18} /> ಮುನ್ನೋಟ — {preview.affectedCount} ಪುಸ್ತಕಗಳು ಪರಿಣಾಮ
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {preview.sample.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'white', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem',
                  flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.title}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                      {formatCurrency(item.oldSellingPrice)}
                    </span>
                    <span style={{ fontSize: '0.75rem' }}>→</span>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>{formatCurrency(item.newSellingPrice)}</span>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                      MRP {formatCurrency(item.mrp)}
                    </span>
                  </div>
                </div>
              ))}
              {preview.affectedCount > 5 && (
                <p style={{ fontSize: '0.8rem', color: '#166534', textAlign: 'center', margin: '0.25rem 0 0' }}>
                  ... ಮತ್ತು {preview.affectedCount - 5} ಇತರ ಪುಸ್ತಕಗಳು
                </p>
              )}
            </div>
          </div>
        )}

        {/* Warning */}
        <div style={{ display: 'flex', gap: '0.75rem', background: '#fffbeb', border: '1.5px solid #fbbf24', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
            <strong>ಮಹತ್ವದ ಟಿಪ್ಪಣಿ:</strong> ಈ ಕ್ರಿಯೆ ಆಯ್ದ ಎಲ್ಲಾ ಪುಸ್ತಕಗಳ ಮಾರಾಟ ಬೆಲೆ ಬದಲಿಸುತ್ತದೆ.
            MRP ಬದಲಾಗುವುದಿಲ್ಲ. &quot;ರೀಸೆಟ್&quot; ಮಾಡಿ ಮೂಲ MRP ಗೆ ಹಿಂದಿರುಗಿಸಬಹುದು.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePreview}
            disabled={isLoading || !discountNum}
            className="btn btn-outline"
            style={{ flex: 1, minWidth: 160 }}
          >
            {isLoading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : <Eye size={18} />}
            ಮುನ್ನೋಟ ನೋಡಿ
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !discountNum}
            className="btn btn-primary"
            style={{ flex: 2, minWidth: 200 }}
          >
            {isLoading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : <CheckCircle size={18} />}
            ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಿ
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="btn"
            style={{ flex: 1, minWidth: 140, background: '#fee2e2', color: 'var(--color-error)' }}
          >
            {isResetting ? <div className="spinner" style={{ width: 18, height: 18 }} /> : <RotateCcw size={18} />}
            ರೀಸೆಟ್ ಮಾಡಿ
          </button>
        </div>
      </div>
    </div>
  )
}
