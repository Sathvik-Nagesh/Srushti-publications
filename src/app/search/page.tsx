'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookOpen, Search, Filter, ChevronDown, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data for search
const allBooks = [
  {
    id: '1',
    title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು',
    titleEn: 'Malegalalli Madumagalu',
    slug: 'malegalli-madhumagalu',
    author: 'ಕುವೆಂಪು',
    authorEn: 'Kuvempu',
    coverImage: '/books/book1.jpg',
    mrp: 450,
    sellingPrice: 399,
    isNewRelease: true,
    isBestSeller: true,
    isOnSale: true,
    category: { name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature' }
  },
  {
    id: '2',
    title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
    titleEn: 'Karnataka History',
    slug: 'karnataka-itihasa',
    author: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್',
    authorEn: 'Dr. Suryanath Kamat',
    coverImage: '/books/book2.jpg',
    mrp: 550,
    sellingPrice: 495,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: false,
    category: { name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic' }
  },
  {
    id: '3',
    title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು',
    titleEn: 'Panchatantra Stories',
    slug: 'panchatantra-kathegalu',
    author: 'ವಿಷ್ಣುಶರ್ಮ',
    authorEn: 'Vishnusharma',
    coverImage: '/books/book3.jpg',
    mrp: 199,
    sellingPrice: 149,
    isNewRelease: true,
    isBestSeller: false,
    isOnSale: true,
    category: { name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children' }
  },
  {
    id: '4',
    title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ',
    titleEn: 'KAS Guide',
    slug: 'kas-margadarshi',
    author: 'ಶ್ರೀಕಾಂತ್ ಎನ್',
    authorEn: 'Srikanth N',
    coverImage: '/books/book4.jpg',
    mrp: 799,
    sellingPrice: 699,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: true,
    category: { name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides' }
  },
  {
    id: '5',
    title: 'ಕನ್ನಡ ವ್ಯಾಕರಣ',
    titleEn: 'Kannada Grammar',
    slug: 'kannada-vyakarana',
    author: 'ಪ್ರೊ. ಜಿ. ವೆಂಕಟಸುಬ್ಬಯ್ಯ',
    authorEn: 'Prof. G. Venkatasubbaiah',
    coverImage: '/books/book5.jpg',
    mrp: 350,
    sellingPrice: 320,
    isNewRelease: false,
    isBestSeller: false,
    isOnSale: false,
    category: { name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic' }
  },
  {
    id: '6',
    title: 'ಬೇಂದ್ರೆ ಕವನಗಳು',
    titleEn: 'Bendre Poems',
    slug: 'bendre-kavanagalu',
    author: 'ದ. ರಾ. ಬೇಂದ್ರೆ',
    authorEn: 'Da. Ra. Bendre',
    coverImage: '/books/book6.jpg',
    mrp: 280,
    sellingPrice: 250,
    isNewRelease: true,
    isBestSeller: true,
    isOnSale: true,
    category: { name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature' }
  }
]

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState(allBooks)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Simulate search delay
    const timer = setTimeout(() => {
      if (query) {
        const filtered = allBooks.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.titleEn?.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.authorEn?.toLowerCase().includes(query.toLowerCase()) ||
          book.category.name.toLowerCase().includes(query.toLowerCase()) ||
          book.category.nameEn?.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      } else {
        setResults(allBooks)
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
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
                <div className="product-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {results.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.slug}`}
                      className="book-card"
                      style={{
                        background: 'white',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        height: '200px',
                        background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                        
                        {/* Badges */}
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem'
                        }}>
                          {book.isNewRelease && (
                            <span className="badge badge-new">ಹೊಸ</span>
                          )}
                          {book.isBestSeller && (
                            <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
                          )}
                          {book.isOnSale && book.mrp > book.sellingPrice && (
                            <span className="badge badge-sale">
                              {Math.round(((book.mrp - book.sellingPrice) / book.mrp) * 100)}% ರಿಯಾಯಿತಿ
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ padding: '1.25rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-primary)',
                          fontWeight: 500
                        }}>
                          {book.category.name}
                        </span>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          marginTop: '0.25rem',
                          marginBottom: '0.25rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {book.title}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-light)',
                          marginBottom: '0.75rem'
                        }}>
                          {book.author}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)'
                          }}>
                            {formatCurrency(book.sellingPrice)}
                          </span>
                          {book.mrp > book.sellingPrice && (
                            <span style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-text-muted)',
                              textDecoration: 'line-through'
                            }}>
                              {formatCurrency(book.mrp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
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
