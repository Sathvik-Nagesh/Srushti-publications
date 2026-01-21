'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import BookCardSkeleton from '@/components/BookCardSkeleton'
import BookCard from '@/components/BookCard'
import { BookOpen, Filter, ChevronDown, X, Grid, List, SlidersHorizontal } from 'lucide-react'
import type { Book, Category } from '@/lib/types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('kn-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Mock data - will be replaced with API calls
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು',
    slug: 'malegalli-madhumagalu',
    author: 'ಕುವೆಂಪು',
    description: 'ಕುವೆಂಪು ಅವರ ಅತ್ಯುತ್ತಮ ಕಾದಂಬರಿ',
    coverImage: '/books/book1.jpg',
    additionalImages: [],
    mrp: 450,
    sellingPrice: 399,
    stockQuantity: 25,
    lowStockAlert: 10,
    language: 'ಕನ್ನಡ',
    isNewRelease: true,
    isBestSeller: true,
    isOnSale: true,
    isFeatured: true,
    isActive: true,
    salesCount: 150,
    viewCount: 500,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '1',
    category: { id: '1', name: 'ಸಾಹಿತ್ಯ', slug: 'literature', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() }
  },
  {
    id: '2',
    title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
    slug: 'karnataka-itihasa',
    author: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್',
    description: 'ಕರ್ನಾಟಕದ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ',
    coverImage: '/books/book2.jpg',
    additionalImages: [],
    mrp: 550,
    sellingPrice: 495,
    stockQuantity: 15,
    lowStockAlert: 10,
    language: 'ಕನ್ನಡ',
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: false,
    isFeatured: false,
    isActive: true,
    salesCount: 200,
    viewCount: 800,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '2',
    category: { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', slug: 'academic', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() }
  },
  {
    id: '3',
    title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು',
    slug: 'panchatantra-kathegalu',
    author: 'ವಿಷ್ಣುಶರ್ಮ',
    description: 'ಮಕ್ಕಳಿಗಾಗಿ ಪಂಚತಂತ್ರ ಕಥೆಗಳು',
    coverImage: '/books/book3.jpg',
    additionalImages: [],
    mrp: 199,
    sellingPrice: 149,
    stockQuantity: 50,
    lowStockAlert: 10,
    language: 'ಕನ್ನಡ',
    isNewRelease: true,
    isBestSeller: false,
    isOnSale: true,
    isFeatured: false,
    isActive: true,
    salesCount: 80,
    viewCount: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '3',
    category: { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', slug: 'children', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() }
  },
  {
    id: '4',
    title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ',
    slug: 'kas-margadarshi',
    author: 'ಶ್ರೀಕಾಂತ್ ಎನ್',
    description: 'ಕೆಎಎಸ್ ಪರೀಕ್ಷೆಗೆ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ',
    coverImage: '/books/book4.jpg',
    additionalImages: [],
    mrp: 799,
    sellingPrice: 699,
    stockQuantity: 30,
    lowStockAlert: 10,
    language: 'ಕನ್ನಡ',
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: true,
    isFeatured: true,
    isActive: true,
    salesCount: 300,
    viewCount: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '4',
    category: { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', slug: 'exam-guides', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() }
  }
]

const mockCategories: Category[] = [
  { id: '1', name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: 'ಇತರೆ', nameEn: 'Others', slug: 'others', isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date() }
]

function BooksContent() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [categories] = useState<Category[]>(mockCategories)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  const [filterLabels, setFilterLabels] = useState({
    newRelease: false,
    bestSeller: false,
    onSale: false,
    inStock: false
  })
  
  // Get filter from URL params
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
  
  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...mockBooks]
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(b => b.categoryId === selectedCategory)
    }
    
    // Price range filter
    filtered = filtered.filter(b => 
      b.sellingPrice >= priceRange[0] && b.sellingPrice <= priceRange[1]
    )
    
    // Label filters
    if (filterLabels.newRelease) {
      filtered = filtered.filter(b => b.isNewRelease)
    }
    if (filterLabels.bestSeller) {
      filtered = filtered.filter(b => b.isBestSeller)
    }
    if (filterLabels.onSale) {
      filtered = filtered.filter(b => b.isOnSale)
    }
    if (filterLabels.inStock) {
      filtered = filtered.filter(b => b.stockQuantity > 0)
    }
    
    // Sort
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice)
        break
      case 'popular':
        filtered.sort((a, b) => b.salesCount - a.salesCount)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    
    setBooks(filtered)
  }, [selectedCategory, priceRange, filterLabels, sortBy])
  
  const handleApplyFilters = () => {
    setShowFilters(false)
  }
  
  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 1000])
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
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  color: 'var(--color-text)'
                }}>
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
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  color: 'var(--color-text)'
                }}>
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
                    placeholder="₹1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="input"
                    style={{ width: '100px', padding: '0.5rem' }}
                  />
                </div>
              </div>
              
              {/* Labels */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  color: 'var(--color-text)'
                }}>
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
                    {books.length} ಪುಸ್ತಕಗಳು ಕಂಡುಬಂದಿವೆ
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
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      handleApplyFilters()
                    }}
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
                <div className="product-grid">
                  {books.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
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
              
              {/* Same filter content as sidebar */}
              {/* Categories */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>ವಿಭಾಗ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
