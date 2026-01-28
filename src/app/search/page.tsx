'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookCard from '@/components/BookCard'
import { BookOpen, Search, Filter, ChevronDown, X, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useSearch } from '@/lib/hooks/useDataFetching'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  
  // Use SWR-based search hook with caching
  const { results, isLoading, error } = useSearch(query, 50)

  // Update local search query when URL changes
  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', background: 'var(--color-bg)' }}>
        {/* Search Header */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
          padding: '3rem 0'
        }}>
          <div className="container">
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              🔍 ಪುಸ್ತಕ ಹುಡುಕಾಟ
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} style={{
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'white',
                padding: '0.5rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={20} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)'
                  }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ಪುಸ್ತಕದ ಹೆಸರು, ಲೇಖಕ ಅಥವಾ ವಿಭಾಗ..."
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      background: 'transparent'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        padding: '0.25rem'
                      }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Search size={18} />
                  ಹುಡುಕಿ
                </button>
              </div>
            </form>

            {query && (
              <p style={{
                textAlign: 'center',
                marginTop: '1rem',
                color: 'var(--color-text-light)'
              }}>
                &quot;<strong>{query}</strong>&quot; ಗಾಗಿ {results.length} ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿವೆ
              </p>
            )}
          </div>
        </section>

        {/* Results Section */}
        <section className="section">
          <div className="container">
            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '4rem'
              }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }} />
              </div>
            ) : results.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--color-cream-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <Search size={36} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ
                </h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                  &quot;{query}&quot; ಗಾಗಿ ಯಾವುದೇ ಪುಸ್ತಕಗಳು ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ. ಬೇರೆ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.
                </p>
                <Link href="/books" className="btn btn-primary">
                  ಎಲ್ಲಾ ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ
                </Link>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className="product-grid">
                  {results.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Suggestions */}
                {query && results.length > 0 && (
                  <div style={{
                    marginTop: '3rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                      ಹೆಚ್ಚಿನ ಪುಸ್ತಕಗಳಿಗಾಗಿ ವಿಭಾಗಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      <Link href="/categories/literature" className="btn btn-outline">ಸಾಹಿತ್ಯ</Link>
                      <Link href="/categories/academic" className="btn btn-outline">ಶೈಕ್ಷಣಿಕ</Link>
                      <Link href="/categories/children" className="btn btn-outline">ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು</Link>
                      <Link href="/categories/exam-guides" className="btn btn-outline">ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ</Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
