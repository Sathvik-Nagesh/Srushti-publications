'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'

const languages = [
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]

import { setUserLocale } from '@/app/actions/locale'

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale: initialLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const t = useTranslations('common')
  const [currentLocale, setCurrentLocale] = useState(initialLocale)
  const [isOpen, setIsOpen] = useState(false)

  // Sync state if prop changes (e.g. after router refresh)
  useEffect(() => {
    setCurrentLocale(initialLocale)
  }, [initialLocale])

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleLanguageChange = async (locale: string) => {
    // Optimistic UI update
    setCurrentLocale(locale)
    setIsOpen(false)
    
    // Server action to set cookie
    await setUserLocale(locale)
    
    // Refresh RSC payload
    router.refresh()
  }

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="language-switcher-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="language-menu"
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
        aria-label={t('changeLanguage')}
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
            id="language-menu"
            role="menu"
            aria-labelledby="language-switcher-trigger"
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
                role="menuitem"
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
