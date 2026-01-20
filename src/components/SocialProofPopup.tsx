'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, X } from 'lucide-react'

interface SocialProofPopupProps {
  enabled?: boolean
  intervalMs?: number
}

// Settings storage key (same as in site-config page)
const SETTINGS_KEY = 'srushti_site_settings'

// Mock recent purchases data
const recentPurchases = [
  { name: 'ರಾಜೇಶ್', city: 'ಬೆಂಗಳೂರು', book: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', timeAgo: '2 ನಿಮಿಷ' },
  { name: 'ಪ್ರಿಯಾ', city: 'ಮೈಸೂರು', book: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', timeAgo: '5 ನಿಮಿಷ' },
  { name: 'ಮಹೇಶ್', city: 'ಹುಬ್ಬಳ್ಳಿ', book: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು', timeAgo: '8 ನಿಮಿಷ' },
  { name: 'ಅನಿತಾ', city: 'ಮಂಗಳೂರು', book: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ', timeAgo: '12 ನಿಮಿಷ' },
  { name: 'ಸುರೇಶ್', city: 'ಧಾರವಾಡ', book: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', timeAgo: '15 ನಿಮಿಷ' },
  { name: 'ಲಕ್ಷ್ಮಿ', city: 'ಶಿವಮೊಗ್ಗ', book: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', timeAgo: '20 ನಿಮಿಷ' },
]

export default function SocialProofPopup({ 
  enabled: propEnabled = true,
  intervalMs: propIntervalMs = 15000 // Show every 15 seconds
}: SocialProofPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState(recentPurchases[0])
  const [purchaseIndex, setPurchaseIndex] = useState(0)
  const [isEnabled, setIsEnabled] = useState(propEnabled)
  const [intervalMs, setIntervalMs] = useState(propIntervalMs)
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY)
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (settings.socialProofEnabled !== undefined) {
          setIsEnabled(settings.socialProofEnabled)
        }
        if (settings.socialProofInterval) {
          setIntervalMs(settings.socialProofInterval)
        }
      }
    } catch (e) {
      console.error('Failed to load social proof settings:', e)
    }
  }, [])
  
  useEffect(() => {
    if (!isEnabled) return
    
    // Initial delay before first popup
    const initialDelay = setTimeout(() => {
      setIsVisible(true)
    }, 5000) // Show first popup after 5 seconds
    
    // Interval for showing popups
    const interval = setInterval(() => {
      setPurchaseIndex(prev => {
        const nextIndex = (prev + 1) % recentPurchases.length
        setCurrentPurchase(recentPurchases[nextIndex])
        return nextIndex
      })
      setIsVisible(true)
      
      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000)
    }, intervalMs)
    
    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [isEnabled, intervalMs])
  
  const handleClose = () => {
    setIsVisible(false)
  }
  
  if (!isEnabled || !isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '20px',
      zIndex: 998,
      animation: 'slideInLeft 0.5s ease-out',
      maxWidth: '320px'
    }}>
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        {/* Icon */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShoppingBag size={22} style={{ color: 'white' }} />
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            {currentPurchase.name} ({currentPurchase.city})
          </p>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-light)',
            margin: 0,
            marginBottom: '0.25rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontWeight: 500 }}>"{currentPurchase.book}"</span> ಖರೀದಿಸಿದ್ದಾರೆ
          </p>
          <p style={{
            fontSize: '0.6875rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            🕐 {currentPurchase.timeAgo} ಹಿಂದೆ
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--color-text-muted)',
            position: 'absolute',
            top: '8px',
            right: '8px'
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
