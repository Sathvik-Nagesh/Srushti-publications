'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Books } from '@phosphor-icons/react'

const SETTINGS_KEY = 'srushti_site_settings'

const defaultSettings = {
  heroTagline: '📚 ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
  heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  heroDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ, ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳ ಅತ್ಯುತ್ತಮ ಸಂಗ್ರಹ. ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.',
  heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ'
}

export default function DynamicHero() {
  const [settings, setSettings] = useState(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSettings = localStorage.getItem(SETTINGS_KEY)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Failed to parse settings:', e)
      }
    }
  }, [])

  // Use defaults until mounted to avoid hydration mismatch
  const displaySettings = mounted ? settings : defaultSettings

  return (
    <div className="hero-content">
      <span className="hero-tagline">
        {displaySettings.heroTagline}
      </span>
      <h1 className="hero-title">
        {displaySettings.heroTitle.includes('ಪಬ್ಲಿಕೇಷನ್ಸ್') ? (
          <>
            {displaySettings.heroTitle.split('ಪಬ್ಲಿಕೇಷನ್ಸ್')[0]}
            <span>ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
          </>
        ) : (
          displaySettings.heroTitle
        )}
      </h1>
      <p className="hero-description">
        {displaySettings.heroDescription}
      </p>
      <div className="hero-actions">
        <Link href="/books" className="btn btn-primary btn-lg">
          <Books size={22} weight="bold" />
          {displaySettings.heroButtonText}
        </Link>
        <Link href="/books?filter=new" className="btn btn-outline btn-lg">
          ಹೊಸ ಬಿಡುಗಡೆಗಳು
        </Link>
      </div>
      
      {/* Stats */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginTop: '3rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            200+
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            ಪುಸ್ತಕಗಳು
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            50+
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            ಲೇಖಕರು
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            5000+
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            ಸಂತೃಪ್ತ ಗ್ರಾಹಕರು
          </div>
        </div>
      </div>
    </div>
  )
}
