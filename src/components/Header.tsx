'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingCart, MagnifyingGlass, List, X, User } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store'
import { useAuth } from '@/contexts/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'
import SearchAutocomplete from './SearchAutocomplete'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const t = useTranslations('common')
  const itemCount = useCartStore(state => state.getItemCount())
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Fix hydration mismatch - only show cart count after mounting on client
  useEffect(() => {
    setMounted(true)
    
    // Clean up any zombie service workers that might be blocking requests
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(console.error)
        }
      }).catch(console.error)
    }
  }, [])
  
  // Close search on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="logo">
            <Image
              src="/logo.jpg"
              alt="ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್"
              width={50}
              height={50}
              className="logo-image"
              style={{ borderRadius: '8px', width: 'auto' }}
            />
            <span className="logo-text hide-mobile">ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <Link href="/" className="nav-link">
              {t('home')}
            </Link>
            <Link href="/books" className="nav-link">
              {t('books')}
            </Link>
            <Link href="/categories" className="nav-link">
              {t('categories')}
            </Link>
            <Link href="/about" className="nav-link">
              {t('about')}
            </Link>
            <Link href="/contact" className="nav-link">
              {t('contact')}
            </Link>
          </nav>
          
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="cart-button"
              aria-label={t('search')}
              style={{
                background: isSearchOpen ? 'var(--color-primary)' : undefined,
                color: isSearchOpen ? 'white' : undefined
              }}
            >
              {isSearchOpen ? <X size={22} weight="bold" /> : <MagnifyingGlass size={22} weight="bold" />}
            </button>
            
            {/* Account/Login */}
            {mounted && !authLoading && (
              <Link 
                href={isAuthenticated ? '/account' : '/login'}
                className="cart-button"
                aria-label={isAuthenticated ? 'ಖಾತೆ' : 'ಲಾಗಿನ್'}
                title={isAuthenticated ? customer?.name : 'ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್'}
                style={{
                  background: isAuthenticated ? 'var(--color-primary)' : undefined,
                  color: isAuthenticated ? 'white' : undefined,
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {isAuthenticated && customer?.name ? (
                  <span style={{ 
                    width: 22, 
                    height: 22, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={22} weight="bold" />
                )}
              </Link>
            )}
            
            {/* Cart */}
            <Link href="/cart" className="cart-button" aria-label={t('cart')}>
              <ShoppingCart size={22} weight="bold" />
              {mounted && itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
            </button>
          </div>
        </div>
        
        {/* Search Autocomplete - Expandable */}
        {isSearchOpen && (
          <div style={{ 
            padding: '1rem 0',
            borderTop: '1px solid var(--color-border)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <SearchAutocomplete 
              placeholder={t('searchPlaceholder')}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        )}
      </div>
      
      {/* Search Overlay for mobile */}
      {isSearchOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            top: '140px',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 40
          }}
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  )
}
