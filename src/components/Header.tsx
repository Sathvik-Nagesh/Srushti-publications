'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const t = useTranslations('common')
  const itemCount = useCartStore(state => state.getItemCount())
  
  // Fix hydration mismatch - only show cart count after mounting on client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }
  
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
              style={{ borderRadius: '8px' }}
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
            >
              <Search size={20} />
            </button>
            
            {/* Cart */}
            <Link href="/cart" className="cart-button">
              <ShoppingCart size={20} />
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
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar - Expandable */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} style={{ 
            padding: '1rem 0',
            borderTop: '1px solid var(--color-border)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ flex: 1 }}
                autoFocus
              />
              <button type="submit" className="btn btn-primary">
                <Search size={18} />
                {t('search')}
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  )
}
