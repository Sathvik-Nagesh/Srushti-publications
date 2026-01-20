'use client'

import { Shield, Truck, RefreshCw, CreditCard, Lock, Award } from 'lucide-react'

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'compact'
  showPaymentIcons?: boolean
}

const badges = [
  {
    icon: Shield,
    title: '100% ಸುರಕ್ಷಿತ',
    titleEn: 'Secure',
    description: 'ಸುರಕ್ಷಿತ ಪಾವತಿ',
    color: '#10b981'
  },
  {
    icon: Truck,
    title: 'ಉಚಿತ ಶಿಪ್ಪಿಂಗ್',
    titleEn: 'Free Shipping',
    description: '₹500+ ಆರ್ಡರ್‌ಗೆ',
    color: '#3b82f6'
  },
  {
    icon: RefreshCw,
    title: '7 ದಿನ ರಿಟರ್ನ್',
    titleEn: '7 Day Return',
    description: 'ಸುಲಭ ಮರುಪಾವತಿ',
    color: '#8b5cf6'
  },
  {
    icon: Award,
    title: 'ಅಸಲಿ ಪುಸ್ತಕಗಳು',
    titleEn: 'Authentic',
    description: 'ಗುಣಮಟ್ಟ ಖಾತ್ರಿ',
    color: '#f59e0b'
  }
]

const paymentMethods = [
  { name: 'Visa', color: '#1A1F71' },
  { name: 'Mastercard', color: '#EB001B' },
  { name: 'UPI', color: '#00897B' },
  { name: 'Net Banking', color: '#0066CC' },
  { name: 'COD', color: '#4CAF50' }
]

export default function TrustBadges({ 
  variant = 'horizontal',
  showPaymentIcons = true 
}: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {badges.slice(0, 3).map((badge, i) => {
          const Icon = badge.icon
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-light)'
            }}>
              <Icon size={16} style={{ color: badge.color }} />
              <span>{badge.title}</span>
            </div>
          )
        })}
      </div>
    )
  }
  
  return (
    <div style={{
      background: 'var(--color-cream-light)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      border: '1px solid var(--color-border)'
    }}>
      {/* Trust Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: variant === 'horizontal' 
          ? 'repeat(auto-fit, minmax(150px, 1fr))' 
          : '1fr',
        gap: '1rem',
        marginBottom: showPaymentIcons ? '1.5rem' : 0
      }}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: `${badge.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} style={{ color: badge.color }} />
              </div>
              <div>
                <p style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  margin: 0,
                  marginBottom: '0.125rem'
                }}>
                  {badge.title}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-light)',
                  margin: 0
                }}>
                  {badge.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Payment Methods */}
      {showPaymentIcons && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <Lock size={14} style={{ color: 'var(--color-text-muted)' }} />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontWeight: 500
            }}>
              ಸುರಕ್ಷಿತ ಪಾವತಿ ವಿಧಾನಗಳು
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {paymentMethods.map((method, i) => (
              <div 
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: method.color,
                  border: `1px solid ${method.color}30`,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
