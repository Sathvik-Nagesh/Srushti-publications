'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface LiveRegionContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

const LiveRegionContext = createContext<LiveRegionContextType | null>(null)

/**
 * Screen Reader Announcement Provider
 * Provides a way to announce dynamic content changes to screen readers
 * 
 * Usage:
 * 1. Wrap your app with <ScreenReaderAnnouncer>
 * 2. Use the hook: const { announce } = useAnnounce()
 * 3. Call announce('Your message') when content changes
 */
export function ScreenReaderAnnouncer({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('')
  const [assertiveMessage, setAssertiveMessage] = useState('')
  
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('')
      // Small delay to ensure screen reader picks up the change
      setTimeout(() => setAssertiveMessage(message), 100)
    } else {
      setPoliteMessage('')
      setTimeout(() => setPoliteMessage(message), 100)
    }
  }, [])
  
  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      {/* Polite announcements - waits for current speech to finish */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {politeMessage}
      </div>
      {/* Assertive announcements - interrupts current speech */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  )
}

export function useAnnounce() {
  const context = useContext(LiveRegionContext)
  if (!context) {
    // Return a no-op if not wrapped in provider
    return { announce: (message: string) => console.log('[A11y]', message) }
  }
  return context
}

/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({ children, as = 'span' }: { 
  children: React.ReactNode
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
  const Component = as
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
    >
      {children}
    </Component>
  )
}

/**
 * Focus Trap Hook
 * Traps focus within a container (useful for modals)
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return
    
    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    // Focus first element when trap activates
    firstElement?.focus()
    
    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive, containerRef])
}

/**
 * ARIA Helpers
 */
export const ariaHelpers = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Common ARIA patterns
  buttonProps: (label: string, expanded?: boolean) => ({
    role: 'button' as const,
    'aria-label': label,
    tabIndex: 0,
    ...(expanded !== undefined && { 'aria-expanded': expanded })
  }),
  
  linkProps: (label: string, external?: boolean) => ({
    'aria-label': label,
    ...(external && { 
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': `${label} (opens in new tab)`
    })
  }),
  
  loadingProps: (isLoading: boolean, loadingText: string = 'Loading...') => ({
    'aria-busy': isLoading,
    'aria-live': 'polite' as const,
    ...(isLoading && { 'aria-label': loadingText })
  })
}
