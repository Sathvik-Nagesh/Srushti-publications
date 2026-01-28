'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import BookCardSkeleton from '@/components/BookCardSkeleton'
import BookCard from '@/components/BookCard'
import QuickViewModal from '@/components/QuickViewModal'
import { BookOpen, Filter, X, Grid, List, SlidersHorizontal, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import { useCategories } from '@/lib/hooks/useCategories'
import { useBooks, prefetchBooks } from '@/lib/hooks/useDataFetching'
import type { Book } from '@/lib/types'

function BooksContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const { categories } = useCategories()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null)
  
  // Initialize filters from URL
  const getInitialFilters = useCallback(() => {
    return {
      category: searchParams.get('category') || '',
      minPrice: parseInt(searchParams.get('minPrice') || '0'),
      maxPrice: parseInt(searchParams.get('maxPrice') || '2000'),
      sortBy: searchParams.get('sortBy') || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
      newRelease: searchParams.get('filter') === 'new' || searchParams.get('newRelease') === 'true',
      bestSeller: searchParams.get('filter') === 'bestseller' || searchParams.get('bestSeller') === 'true',
      onSale: searchParams.get('filter') === 'sale' || searchParams.get('onSale') === 'true',
      inStock: searchParams.get('inStock') === 'true',
      author: searchParams.get('author') || '',
    }
  }, [searchParams])

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [priceError, setPriceError] = useState<string>('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterLabels, setFilterLabels] = useState({
    newRelease: false,
    bestSeller: false,
    onSale: false,
    inStock: false
  })
  const [authorFilter, setAuthorFilter] = useState('')
  
  // Pagination
  const [page, setPage] = useState(1)

  // Initialize from URL on mount
  useEffect(() => {
    const filters = getInitialFilters()
    setSelectedCategory(filters.category)
    setPriceRange([filters.minPrice, filters.maxPrice])
    setSortBy(filters.sortBy)
    setPage(filters.page)
    setAuthorFilter(filters.author)
    setFilterLabels({
      newRelease: filters.newRelease,
      bestSeller: filters.bestSeller,
      onSale: filters.onSale,
      inStock: filters.inStock
    })
  }, []) // Only on mount

  // Sync filters to URL
  const syncToUrl = useCallback(() => {
    const params = new URLSearchParams()
    
    if (selectedCategory) params.set('category', selectedCategory)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 2000) params.set('maxPrice', priceRange[1].toString())
    if (sortBy !== 'newest') params.set('sortBy', sortBy)
    if (page > 1) params.set('page', page.toString())
    if (filterLabels.newRelease) params.set('newRelease', 'true')
    if (filterLabels.bestSeller) params.set('bestSeller', 'true')
    if (filterLabels.onSale) params.set('onSale', 'true')
    if (filterLabels.inStock) params.set('inStock', 'true')
    if (authorFilter) params.set('author', authorFilter)
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [selectedCategory, priceRange, sortBy, page, filterLabels, authorFilter, pathname, router])

  // Price validation
  useEffect(() => {
    if (priceRange[0] > priceRange[1]) {
      setPriceError('ಕನಿಷ್ಠ ಬೆಲೆ ಗರಿಷ್ಠಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು')
    } else {
      setPriceError('')
    }
  }, [priceRange])

  // Use SWR-based data fetching hook with caching
  const { 
    books, 
    total: totalBooks, 
    totalPages, 
    isLoading: loading, 
    isValidating 
  } = useBooks({
    categoryId: selectedCategory || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 2000 ? priceRange[1] : undefined,
    sortBy,
    page,
    limit: 12,
    inStock: filterLabels.inStock || undefined,
    isNewRelease: filterLabels.newRelease || undefined,
    isBestSeller: filterLabels.bestSeller || undefined,
    isOnSale: filterLabels.onSale || undefined,
    author: authorFilter || undefined
  })

  // Sync to URL when filters change
  useEffect(() => {
    if (priceRange[0] > priceRange[1]) return // Skip if price is invalid
    syncToUrl()
  }, [selectedCategory, priceRange, filterLabels, sortBy, page, authorFilter, syncToUrl])

  // Reset page when filters change (but not when page itself changes)
  const prevFiltersRef = useCallback(() => {
    return `${selectedCategory}-${priceRange.join('-')}-${JSON.stringify(filterLabels)}-${sortBy}-${authorFilter}`
  }, [selectedCategory, priceRange, filterLabels, sortBy, authorFilter])
  
  const [prevFilters, setPrevFilters] = useState(prevFiltersRef())
  
  useEffect(() => {
    const currentFilters = prevFiltersRef()
    if (currentFilters !== prevFilters) {
      setPage(1)
      setPrevFilters(currentFilters)
    }
  }, [prevFiltersRef, prevFilters])
  
  const handleApplyFilters = () => {
    setShowFilters(false)
  }
  
  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 2000])
    setSortBy('newest')
    setAuthorFilter('')
    setFilterLabels({
      newRelease: false,
      bestSeller: false,
      onSale: false,
      inStock: false
    })
  }

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 2000 || 
    filterLabels.newRelease || filterLabels.bestSeller || filterLabels.onSale || filterLabels.inStock || authorFilter

  // Pagination with jump and prefetching
  const handlePrefetch = useCallback((targetPage: number) => {
    if (targetPage > 0 && targetPage <= totalPages && targetPage !== page) {
      prefetchBooks({
        categoryId: selectedCategory || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 2000 ? priceRange[1] : undefined,
        sortBy,
        page: targetPage,
        limit: 12,
        inStock: filterLabels.inStock || undefined,
        isNewRelease: filterLabels.newRelease || undefined,
        isBestSeller: filterLabels.bestSeller || undefined,
        isOnSale: filterLabels.onSale || undefined,
        author: authorFilter || undefined
      })
    }
  }, [selectedCategory, priceRange, sortBy, filterLabels, authorFilter, totalPages, page])

  const renderPagination = () => {
    if (totalPages <= 1) return null
    
    const pages: (number | string)[] = []
    const showEllipsisStart = page > 3
    const showEllipsisEnd = page < totalPages - 2
    
    // Always show first page
    pages.push(1)
    
    if (showEllipsisStart) pages.push('...')
    
    // Show pages around current
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) pages.push(i)
    }
    
    if (showEllipsisEnd) pages.push('...')
    
    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages)
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {/* Previous Button with prefetch */}
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
          onMouseEnter={() => handlePrefetch(page - 1)}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <ChevronLeft size={16} /> ಹಿಂದೆ
        </button>
        
        {pages.map((p, idx) => (
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => setPage(p)}
              onMouseEnter={() => handlePrefetch(p)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: p === page ? 'none' : '1px solid var(--color-border)',
                background: p === page ? 'var(--color-primary)' : 'white',
                color: p === page ? 'white' : 'var(--color-text)',
                fontWeight: p === page ? 600 : 400,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ) : (
            <span key={idx} style={{ padding: '0 0.25rem', color: 'var(--color-text-muted)' }}>...</span>
          )
        ))}
        
        {/* Next Button with prefetch */}
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
          onMouseEnter={() => handlePrefetch(page + 1)}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          ಮುಂದೆ <ChevronRight size={16} />
        </button>
        
        {/* Revalidating indicator */}
        {isValidating && !loading && (
          <div style={{ 
            marginLeft: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.75rem'
          }}>
            <Loader2 size={14} className="animate-spin" />
            <span>ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...</span>
          </div>
        )}
      </div>
    )
  }

  // Filter Sidebar Component (reused for desktop & mobile)
  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Categories */}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
          ವಿಭಾಗ
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name={`category-${isMobile ? 'mobile' : 'desktop'}`}
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
                name={`category-${isMobile ? 'mobile' : 'desktop'}`}
                checked={selectedCategory === cat.id}
                onChange={() => setSelectedCategory(cat.id)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: '0.9375rem' }}>{cat.name}</span>
              {cat.bookCount > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({cat.bookCount})</span>
              )}
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
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
            min={0}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="₹2000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
            className="input"
            style={{ width: '100px', padding: '0.5rem' }}
            min={0}
          />
        </div>
        {priceError && (
          <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={12} /> {priceError}
          </p>
        )}
      </div>
      
      {/* Labels */}
      <div>
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
    </div>
  )
  
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
              ನಮ್ಮ ಸಮೃದ್ಧ ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ
            </p>
          </div>
        </div>
        
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem'
          }} className="books-layout">
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
                {hasActiveFilters && (
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
                )}
              </div>
              
              <FilterSidebar />
              
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
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
                    {loading ? '...' : `${totalBooks} ಪುಸ್ತಕಗಳು`}
                  </span>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <X size={14} /> ಫಿಲ್ಟರ್ ತೆಗೆ
                    </button>
                  )}
                  
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
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onQuickView={() => setQuickViewBook(book)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {renderPagination()}
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Modal - COMPLETE */}
        {showFilters && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }} onClick={(e) => e.target === e.currentTarget && setShowFilters(false)}>
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
              
              <FilterSidebar isMobile={true} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  ತೆಗೆ
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  ಅನ್ವಯಿಸಿ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewBook && (
          <QuickViewModal 
            book={quickViewBook} 
            onClose={() => setQuickViewBook(null)} 
          />
        )}
      </main>
      <Footer />
      <ScrollToTop />

      <style jsx>{`
        @media (max-width: 768px) {
          .books-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
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
