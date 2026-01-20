'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Check, Settings } from 'lucide-react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])
  
  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }
  
  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }
  
  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '1rem',
      animation: 'slideUp 0.4s ease-out'
    }}>
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
        padding: '1.5rem 2rem',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Icon */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Cookie size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          
          {/* Content */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🍪 ನಾವು ಕುಕೀಗಳನ್ನು ಬಳಸುತ್ತೇವೆ
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-light)',
              lineHeight: 1.6,
              margin: 0
            }}>
              ನಿಮ್ಮ ಅನುಭವವನ್ನು ಸುಧಾರಿಸಲು ನಾವು ಕುಕೀಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ಕಾರ್ಟ್ ಮಾಹಿತಿ ಮತ್ತು ಭಾಷಾ ಆಯ್ಕೆಗಳನ್ನು ಉಳಿಸಲು ಕುಕೀಗಳು ಅಗತ್ಯ.
            </p>
            
            {showDetails && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>ಅಗತ್ಯ ಕುಕೀಗಳು:</strong>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-light)' }}>
                    ಕಾರ್ಟ್, ಲಾಗಿನ್, ಭಾಷೆ ಆಯ್ಕೆ - ಇವು ವೆಬ್‌ಸೈಟ್ ಕಾರ್ಯನಿರ್ವಹಣೆಗೆ ಅಗತ್ಯ
                  </p>
                </div>
                <div>
                  <strong>ವಿಶ್ಲೇಷಣೆ ಕುಕೀಗಳು:</strong>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-light)' }}>
                    ವೆಬ್‌ಸೈಟ್ ಸುಧಾರಣೆಗಾಗಿ ಬಳಕೆದಾರರ ನಡವಳಿಕೆ ವಿಶ್ಲೇಷಣೆ
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minWidth: 200
          }}>
            <button
              onClick={acceptAll}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Check size={18} />
              ಎಲ್ಲವನ್ನೂ ಸ್ವೀಕರಿಸಿ
            </button>
            <button
              onClick={acceptEssential}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              ಅಗತ್ಯ ಮಾತ್ರ
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-light)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <Settings size={14} />
              {showDetails ? 'ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ' : 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ'}
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={decline}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '0.25rem'
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
