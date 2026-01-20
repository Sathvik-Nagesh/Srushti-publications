'use client'

import { useEffect, useRef } from 'react'

/**
 * Skip Navigation Link Component
 * Allows keyboard users to skip directly to main content
 * 
 * Usage: Add <SkipToContent /> at the very beginning of your layout
 * Make sure your main content has id="main-content"
 */
export default function SkipToContent() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.tabIndex = -1
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <a
      ref={linkRef}
      href="#main-content"
      onClick={handleClick}
      className="skip-to-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '0',
        zIndex: 9999,
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        fontWeight: 600,
        textDecoration: 'none',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        transition: 'left 0.2s ease'
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '0'
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px'
      }}
    >
      ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ (Skip to main content)
    </a>
  )
}
