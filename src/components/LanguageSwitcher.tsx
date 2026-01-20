'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState('kn')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Get current locale from cookie
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] || 'kn'
    setCurrentLocale(locale)
  }, [])

  const handleLanguageChange = (locale: string) => {
    // Set cookie
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(locale)
    setIsOpen(false)
    // Reload page to apply new locale
    router.refresh()
    window.location.reload()
  }

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500
        }}
        aria-label="Change language"
      >
        <Globe size={16} />
        <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              zIndex: 100,
              minWidth: '140px'
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: currentLocale === lang.code ? 'var(--color-primary-50)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  textAlign: 'left',
                  color: currentLocale === lang.code ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: currentLocale === lang.code ? 600 : 400
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
