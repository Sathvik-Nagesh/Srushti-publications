'use client'

import { useState, useEffect } from 'react'
import { Tag, ToggleLeft, ToggleRight, Info } from 'lucide-react'
import {
  applyDiscount,
  calculateSavingsPercent,
  validateDiscount,
  formatDiscountLabel,
  type DiscountType,
} from '@/lib/discount'
import { formatCurrency } from '@/lib/utils'

interface DiscountPanelProps {
  mrp: number
  sellingPrice: number
  isOnSale: boolean
  /** Called when discount is applied and selling price should change */
  onDiscountChange: (sellingPrice: number, isOnSale: boolean) => void
}

export default function DiscountPanel({
  mrp,
  sellingPrice,
  isOnSale,
  onDiscountChange,
}: DiscountPanelProps) {
  const [enabled, setEnabled] = useState(isOnSale || mrp > sellingPrice)
  const [discountType, setDiscountType] = useState<DiscountType>('percentage')
  const [discountValue, setDiscountValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Derive initial discount value from existing price
  useEffect(() => {
    if (mrp > sellingPrice) {
      const pct = calculateSavingsPercent(mrp, sellingPrice)
      if (pct > 0) {
        setEnabled(true)
        setDiscountType('percentage')
        setDiscountValue(String(pct))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  const discountNum = parseFloat(discountValue) || 0
  const previewPrice = enabled && discountNum > 0
    ? applyDiscount(mrp, discountType, discountNum)
    : mrp
  const savings = calculateSavingsPercent(mrp, previewPrice)

  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)
    if (!next) {
      // Disable discount — reset selling price to MRP
      setDiscountValue('')
      setError(null)
      onDiscountChange(mrp, false)
    }
  }

  const handleApply = () => {
    if (!mrp || mrp <= 0) {
      setError('ದಯವಿಟ್ಟು ಮೊದಲು MRP ನಮೂದಿಸಿ')
      return
    }
    const validationError = validateDiscount(mrp, discountType, discountNum)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    onDiscountChange(previewPrice, true)
  }

  const handleValueChange = (val: string) => {
    setDiscountValue(val)
    setError(null)
    // Live preview — update price automatically
    const num = parseFloat(val) || 0
    if (num > 0 && mrp > 0) {
      const err = validateDiscount(mrp, discountType, num)
      if (!err) {
        onDiscountChange(applyDiscount(mrp, discountType, num), true)
      }
    }
  }

  return (
    <div style={{
      border: `1.5px solid ${enabled ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      background: enabled ? 'var(--color-primary-50)' : 'white',
      transition: 'all 0.2s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: enabled ? '1.25rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={18} color="var(--color-primary)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>ರಿಯಾಯಿತಿ ಹೊಂದಿಸಿ</h4>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.375rem 0.875rem',
            background: enabled ? 'var(--color-primary)' : 'var(--color-border)',
            color: enabled ? 'white' : 'var(--color-text-muted)',
            border: 'none', borderRadius: '50px', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
          }}
        >
          {enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          {enabled ? 'ಸಕ್ರಿಯ' : 'ನಿಷ್ಕ್ರಿಯ'}
        </button>
      </div>

      {enabled && (
        <>
          {/* Discount Type Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['percentage', 'fixed'] as DiscountType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { setDiscountType(type); setError(null) }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: `2px solid ${discountType === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: discountType === type ? 'var(--color-primary)' : 'white',
                  color: discountType === type ? 'white' : 'var(--color-text)',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {type === 'percentage' ? '% ಶೇಕಡಾ' : '₹ ಸ್ಥಿರ ಮೊತ್ತ'}
              </button>
            ))}
          </div>

          {/* Discount Value Input */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '1rem',
                }}>
                  {discountType === 'percentage' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  className="input"
                  value={discountValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={discountType === 'percentage' ? '0 – 90' : '0 – ' + (mrp - 1)}
                  min="0"
                  max={discountType === 'percentage' ? '90' : String(mrp - 1)}
                  step={discountType === 'percentage' ? '1' : '10'}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              {error && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{error}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap', paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              ಅನ್ವಯಿಸಿ
            </button>
          </div>

          {/* Live Price Preview */}
          {mrp > 0 && discountNum > 0 && !error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.875rem 1rem',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0 0 0.2rem' }}>
                    ಮಾರಾಟ ಬೆಲೆ (ಮಾರ್ಪಾಟಿನ ನಂತರ)
                  </p>
                  <p style={{ margin: 0 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {formatCurrency(previewPrice)}
                    </span>
                    {' '}
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                      {formatCurrency(mrp)}
                    </span>
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                  color: 'white',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}>
                  {formatDiscountLabel(discountType, discountNum)}
                  {savings > 0 && discountType === 'fixed' && ` (${savings}%)`}
                </div>
              </div>
            </div>
          )}

          {/* Info note */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', marginTop: '0.875rem' }}>
            <Info size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              MRP ಯನ್ನು ಬದಲಿಸಲಾಗುವುದಿಲ್ಲ. ಇಲ್ಲಿ ಹೊಂದಿಸಿದ ರಿಯಾಯಿತಿಯು ಮಾರಾಟ ಬೆಲೆಯನ್ನು ಮಾತ್ರ ನವೀಕರಿಸುತ್ತದೆ.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
