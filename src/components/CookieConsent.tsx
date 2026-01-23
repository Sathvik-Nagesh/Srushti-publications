'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '500px',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 100,
      border: '1px solid var(--color-border)',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🍪 We use cookies
        </h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <X size={20} />
        </button>
      </div>
      
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleAccept}
          className="btn btn-primary"
          style={{ flex: 1 }}
        >
          Accept
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="btn btn-ghost"
        >
          Decline
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
