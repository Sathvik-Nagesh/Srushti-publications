'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Books } from '@phosphor-icons/react'

const SETTINGS_KEY = 'srushti_site_settings'

interface HeroSettings {
  heroTagline: string
  heroTitle: string
  heroDescription: string
  heroButtonText: string
  heroStats?: {
    books: string
    authors: string
    customers: string
  }
}

// Default settings - shown immediately to prevent flash
const defaultSettings: HeroSettings = {
  heroTagline: '📚 ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
  heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  heroDescription: 'ವಿಶ್ವದ ಅತ್ಯುತ್ತಮ  ಪುಸ್ತಕಗಳು ಕನ್ನಡ‌  ಓದುಗರಿಗಾಗಿ... ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.',
  heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
  heroStats: {
    books: '200+',
    authors: '50+',
    customers: '5000+'
  }
}

export default function DynamicHero() {
  // Initialize with defaults to prevent hydration mismatch and flash
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First try to get from localStorage (fast)
        const savedSettings = localStorage.getItem(SETTINGS_KEY)
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings)
            setSettings(prev => ({ 
              ...prev, 
              heroTagline: parsed.heroTagline || prev.heroTagline,
              heroTitle: parsed.heroTitle || prev.heroTitle,
              heroDescription: parsed.heroDescription || prev.heroDescription,
              heroButtonText: parsed.heroButtonText || prev.heroButtonText,
              heroStats: {
                books: parsed.statsBooks || prev.heroStats?.books || '200+',
                authors: parsed.statsAuthors || prev.heroStats?.authors || '50+',
                customers: parsed.statsCustomers || prev.heroStats?.customers || '5000+'
              }
            }))
          } catch (e) {
            console.error('Failed to parse local settings:', e)
          }
        }

        // Then fetch from API for latest data (in background)
        const response = await fetch('/api/site-settings')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const apiSettings = data.data
            setSettings({
              heroTagline: apiSettings.heroTagline || defaultSettings.heroTagline,
              heroTitle: apiSettings.heroTitle || defaultSettings.heroTitle,
              heroDescription: apiSettings.heroDescription || defaultSettings.heroDescription,
              heroButtonText: apiSettings.heroButtonText || defaultSettings.heroButtonText,
              heroStats: {
                books: apiSettings.statsBooks || '200+',
                authors: apiSettings.statsAuthors || '50+',
                customers: apiSettings.statsCustomers || '5000+'
              }
            })
            // Update localStorage for faster next load
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(apiSettings))
          }
        }
      } catch (error) {
        console.error('Failed to load hero settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Stats from settings or defaults
  const stats = settings.heroStats || defaultSettings.heroStats!

  return (
    <div className="hero-content">
      <span className="hero-tagline">
        {settings.heroTagline}
      </span>
      <h1 className="hero-title">
        {settings.heroTitle.includes('ಪಬ್ಲಿಕೇಷನ್ಸ್') ? (
          <>
            {settings.heroTitle.split('ಪಬ್ಲಿಕೇಷನ್ಸ್')[0]}
            <span>ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
          </>
        ) : (
          settings.heroTitle
        )}
      </h1>
      <p className="hero-description">
        {settings.heroDescription}
      </p>
      <div className="hero-actions">
        <Link href="/books" className="btn btn-primary btn-lg">
          <Books size={22} weight="bold" />
          {settings.heroButtonText}
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
            {stats.books}
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
            {stats.authors}
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
            {stats.customers}
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
