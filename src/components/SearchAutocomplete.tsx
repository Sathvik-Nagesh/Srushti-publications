'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, BookOpen, Clock, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDeferredValue } from 'react'

interface SearchResult {
  id: string
  title: string
  slug: string
  author: string
  price: number
  originalPrice?: number
  image?: string
  category?: string
}

interface SearchAutocompleteProps {
  placeholder?: string
  onClose?: () => void
}

// Popular searches - can be fetched from analytics later
const popularSearches = [
  'ಕಾವ್ಯ',
  'ಕಾದಂಬರಿ',
  'ಮಕ್ಕಳ ಪುಸ್ತಕ',
  'ಇತಿಹಾಸ',
  'ಕುವೆಂಪು',
]

export default function SearchAutocomplete({ placeholder = 'ಪುಸ್ತಕಗಳನ್ನು ಹುಡುಕಿ...', onClose }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  // Save recent search
  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Search API call
  useEffect(() => {
    if (deferredQuery.length < 2) {
      setResults([])
      return
    }

    const searchBooks = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}&limit=6`)
        const data = await response.json()
        if (data.success) {
          setResults(data.data)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchBooks, 300)
    return () => clearTimeout(debounceTimer)
  }, [deferredQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const itemCount = results.length > 0 ? results.length : (query.length < 2 ? recentSearches.length + popularSearches.length : 0)
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, itemCount - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex])
      } else if (query.length >= 2) {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(result.title)
    router.push(`/books/${result.slug}`)
    setIsOpen(false)
    onClose?.()
  }

  const handleSuggestionClick = (term: string) => {
    setQuery(term)
    saveRecentSearch(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
    setIsOpen(false)
    onClose?.()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-border)',
        padding: '0.75rem 1rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...(isOpen ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(234, 96, 42, 0.15)' } : {})
      }}>
        <Search size={20} style={{ color: 'var(--color-text-muted)', marginRight: '0.75rem', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          id="site-search"
          name="q"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            background: 'transparent',
            color: 'var(--color-text)'
          }}
        />
        {isLoading && (
          <Loader2 size={18} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
        )}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              color: 'var(--color-text-muted)'
            }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {/* Search Results */}
          {query.length >= 2 && results.length > 0 && (
            <div style={{ padding: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.5rem 0.75rem', fontWeight: 600 }}>
                ಫಲಿತಾಂಶಗಳು
              </p>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: selectedIndex === index ? 'var(--color-bg-alt)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div style={{
                    width: '48px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'var(--color-bg-alt)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative'
                    }}>
                      <img
                        src={result.image || '/placeholder-book.jpg'}
                        alt={result.title}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-book.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 500,
                      marginBottom: '0.125rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {result.title}
                    </p>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-light)',
                      marginBottom: '0.125rem'
                    }}>
                      {result.author}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        ₹{result.price}
                      </span>
                      {result.originalPrice && result.originalPrice > result.price && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          textDecoration: 'line-through'
                        }}>
                          ₹{result.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  textAlign: 'center',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  borderTop: '1px solid var(--color-border)',
                  marginTop: '0.5rem'
                }}
                onClick={() => {
                  saveRecentSearch(query)
                  setIsOpen(false)
                  onClose?.()
                }}
              >
                "{query}" ಗಾಗಿ ಎಲ್ಲಾ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ →
              </Link>
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && results.length === 0 && !isLoading && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <BookOpen size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--color-text-light)' }}>
                "{query}" ಗಾಗಿ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ
              </p>
            </div>
          )}

          {/* Suggestions when no query */}
          {query.length < 2 && (
            <div style={{ padding: '0.5rem' }}>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem'
                  }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} /> ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳು
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.75rem',
                        color: 'var(--color-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      ಅಳಿಸಿ
                    </button>
                  </div>
                  {recentSearches.map((term, index) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        background: selectedIndex === index ? 'var(--color-bg-alt)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.5rem 0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={14} /> ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem 0.75rem' }}>
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s'
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
