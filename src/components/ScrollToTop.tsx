'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('common')
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      aria-label={t('scrollToTop')}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary)',
        color: 'white',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-lg)',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'all 0.3s ease',
        zIndex: 50
      }}
    >
      <ChevronUp size={24} />
    </button>
  )
}
