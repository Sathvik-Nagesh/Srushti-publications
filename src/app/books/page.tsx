'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import BookCardSkeleton from '@/components/BookCardSkeleton'
import BookCard from '@/components/BookCard'
import { BookOpen, Filter, ChevronDown, X, Grid, List, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Book, Category } from '@/lib/types'

function BooksContent() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState('newest')
  const [filterLabels, setFilterLabels] = useState({
    newRelease: false,
    bestSeller: false,
    onSale: false,
    inStock: false
  })
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
     // Fetch available categories
     fetch('/api/categories').then(r => r.json()).then(d => {
        if(d.success) setCategories(d.data)
     })
  }, [])

  // Get init filter from URL
  useEffect(() => {
    const filter = searchParams.get('filter')
    const category = searchParams.get('category')
    
    if (filter === 'new') {
      setFilterLabels(prev => ({ ...prev, newRelease: true }))
    } else if (filter === 'bestseller') {
      setFilterLabels(prev => ({ ...prev, bestSeller: true }))
    } else if (filter === 'sale') {
      setFilterLabels(prev => ({ ...prev, onSale: true }))
    }
    
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])
  
  // Fetch Books with Filters
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '12') // Pagination
        params.set('isActive', 'true')
        
        if (selectedCategory) params.set('categoryId', selectedCategory)
        
        // Only send price if modified from default wide range or strictly needed
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
        if (priceRange[1] < 2000) params.set('maxPrice', priceRange[1].toString())
        
        if (filterLabels.newRelease) params.set('isNewRelease', 'true')
        if (filterLabels.bestSeller) params.set('isBestSeller', 'true')
        if (filterLabels.onSale) params.set('isOnSale', 'true')
        if (filterLabels.inStock) params.set('inStock', 'true')
        
        params.set('sortBy', sortBy)

        const res = await fetch(`/api/books?${params.toString()}`)
        const data = await res.json()
        
        if (data.success) {
           setBooks(data.data.items)
           setTotalPages(data.data.totalPages)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce slightly to avoid rapid reloading on slider
    const timer = setTimeout(() => {
       fetchBooks()
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedCategory, priceRange, filterLabels, sortBy, page])

  // Reset page when filters change
  useEffect(() => {
     setPage(1)
  }, [selectedCategory, filterLabels, priceRange, sortBy])
  
  const handleApplyFilters = () => {
    setShowFilters(false)
  }
  
  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 2000])
    setSortBy('newest')
    setFilterLabels({
      newRelease: false,
      bestSeller: false,
      onSale: false,
      inStock: false
    })
  }
  
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
          padding: '3rem 0'
        }}>
          <div className="container">
            <nav style={{ marginBottom: '1rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>/</span>
              <span style={{ color: 'var(--color-text)' }}>ಪುಸ್ತಕಗಳು</span>
            </nav>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              📚 ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು
            </h1>
            <p style={{ color: 'var(--color-text-light)' }}>
              ನನ್ನ ಸಮೃದ್ಧ ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ
            </p>
          </div>
        </div>
        
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem'
          }}>
            {/* Sidebar Filters - Desktop */}
            <aside className="hide-mobile" style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              height: 'fit-content',
              position: 'sticky',
              top: '90px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  <Filter size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  ಫಿಲ್ಟರ್‌ಗಳು
                </h3>
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ಎಲ್ಲಾ ತೆಗೆ
                </button>
              </div>
              
              {/* Categories */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                  ವಿಭಾಗ
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.9375rem' }}>ಎಲ್ಲಾ ವಿಭಾಗಗಳು</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '0.9375rem' }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                  ಬೆಲೆ ವ್ಯಾಪ್ತಿ
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="input"
                    style={{ width: '100px', padding: '0.5rem' }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="₹2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                    className="input"
                    style={{ width: '100px', padding: '0.5rem' }}
                  />
                </div>
              </div>
              
              {/* Labels */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
                  ಲೇಬಲ್‌ಗಳು
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterLabels.newRelease}
                      onChange={(e) => setFilterLabels(prev => ({ ...prev, newRelease: e.target.checked }))}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span className="badge badge-new" style={{ fontSize: '0.75rem' }}>ಹೊಸ ಬಿಡುಗಡೆ</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterLabels.bestSeller}
                      onChange={(e) => setFilterLabels(prev => ({ ...prev, bestSeller: e.target.checked }))}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span className="badge badge-bestseller" style={{ fontSize: '0.75rem' }}>ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterLabels.onSale}
                      onChange={(e) => setFilterLabels(prev => ({ ...prev, onSale: e.target.checked }))}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span className="badge badge-sale" style={{ fontSize: '0.75rem' }}>ರಿಯಾಯಿತಿ</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterLabels.inStock}
                      onChange={(e) => setFilterLabels(prev => ({ ...prev, inStock: e.target.checked }))}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.875rem' }}>ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                ಫಿಲ್ಟರ್ ಅನ್ವಯಿಸಿ
              </button>
            </aside>
            
            {/* Main Content */}
            <div>
              {/* Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>
                    {loading ? '...' : books.length} ಪುಸ್ತಕಗಳು
                  </span>
                  
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="btn btn-outline btn-sm show-mobile"
                  >
                    <SlidersHorizontal size={18} />
                    ಫಿಲ್ಟರ್
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input select"
                    style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem' }}
                  >
                    <option value="newest">ಹೊಸವು ಮೊದಲು</option>
                    <option value="price_asc">ಬೆಲೆ: ಕಡಿಮೆ → ಹೆಚ್ಚು</option>
                    <option value="price_desc">ಬೆಲೆ: ಹೆಚ್ಚು → ಕಡಿಮೆ</option>
                    <option value="popular">ಜನಪ್ರಿಯ</option>
                    <option value="title">ಹೆಸರು</option>
                  </select>
                  
                  {/* View Toggle */}
                  <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        padding: '0.5rem',
                        background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'grid' ? 'white' : 'var(--color-text)',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
                      }}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '0.5rem',
                        background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'list' ? 'white' : 'var(--color-text)',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '0 var(--radius-md) var(--radius-md) 0'
                      }}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Books Grid */}
              {loading ? (
                <BookCardSkeleton count={8} />
              ) : books.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xl)'
                }}>
                  <BookOpen size={60} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>ಪುಸ್ತಕಗಳು ಕಂಡುಬಂದಿಲ್ಲ</h3>
                  <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                    ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ
                  </p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆಗೆದುಹಾಕಿ
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "product-grid" : "product-list"}>
                  {books.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}

             {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                   <button 
                     disabled={page === 1} 
                     onClick={() => setPage(page - 1)}
                     className="btn btn-outline"
                    >
                      <ArrowLeft size={16} /> ಹಿಂದೆ
                   </button>
                   <span style={{ display: 'flex', alignItems: 'center' }}>
                      ಪುಟ {page} / {totalPages}
                   </span>
                   <button 
                     disabled={page === totalPages} 
                     onClick={() => setPage(page + 1)}
                     className="btn btn-outline"
                    >
                      ಮುಂದೆ <ArrowRight size={16} />
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Modal */}
        {showFilters && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              width: '85%',
              maxWidth: '350px',
              background: 'white',
              height: '100%',
              overflow: 'auto',
              padding: '1.5rem',
              animation: 'slideIn 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ಫಿಲ್ಟರ್‌ಗಳು</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>ವಿಭಾಗ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category-mobile"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>ಎಲ್ಲಾ ವಿಭಾಗಗಳು</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                ಅನ್ವಯಿಸಿ
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BookCardSkeleton count={8} />}>
      <BooksContent />
    </Suspense>
  )
}
