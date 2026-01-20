'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { SkeletonBookGrid } from '@/components/LoadingSpinner'
import { BookOpen, Grid, List, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Book, Category } from '@/lib/types'

const mockCategories: Record<string, Category> = {
  'literature': { id: '1', name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature', description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಕೃತಿಗಳು', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  'academic': { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic', description: 'ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳು', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  'children': { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children', description: 'ಮಕ್ಕಳಿಗಾಗಿ ಪುಸ್ತಕಗಳು', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  'exam-guides': { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides', description: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  'others': { id: '5', name: 'ಇತರೆ', nameEn: 'Others', slug: 'others', description: 'ಇತರ ಪುಸ್ತಕಗಳು', isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date() }
}

const mockBooks: Book[] = [
  { id: '1', title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', slug: 'malegalli-madhumagalu', author: 'ಕುವೆಂಪು', description: '', coverImage: '', additionalImages: [], mrp: 450, sellingPrice: 399, stockQuantity: 25, lowStockAlert: 10, language: 'ಕನ್ನಡ', isNewRelease: true, isBestSeller: true, isOnSale: true, isFeatured: true, isActive: true, salesCount: 150, viewCount: 500, createdAt: new Date(), updatedAt: new Date(), categoryId: '1' },
  { id: '2', title: 'ಕಾನೂರು ಹೆಗ್ಗಡತಿ', slug: 'kanuru-heggadathi', author: 'ಕುವೆಂಪು', description: '', coverImage: '', additionalImages: [], mrp: 350, sellingPrice: 299, stockQuantity: 20, lowStockAlert: 10, language: 'ಕನ್ನಡ', isNewRelease: false, isBestSeller: true, isOnSale: false, isFeatured: false, isActive: true, salesCount: 120, viewCount: 400, createdAt: new Date(), updatedAt: new Date(), categoryId: '1' },
  { id: '3', title: 'ಚೋಮನ ದುಡಿ', slug: 'chomana-dudi', author: 'ಶಿವರಾಮ ಕಾರಂತ', description: '', coverImage: '', additionalImages: [], mrp: 280, sellingPrice: 249, stockQuantity: 35, lowStockAlert: 10, language: 'ಕನ್ನಡ', isNewRelease: true, isBestSeller: false, isOnSale: true, isFeatured: false, isActive: true, salesCount: 80, viewCount: 300, createdAt: new Date(), updatedAt: new Date(), categoryId: '1' },
  { id: '4', title: 'ಸಂಸ್ಕಾರ', slug: 'samskara', author: 'ಅನಂತಮೂರ್ತಿ', description: '', coverImage: '', additionalImages: [], mrp: 320, sellingPrice: 289, stockQuantity: 40, lowStockAlert: 10, language: 'ಕನ್ನಡ', isNewRelease: false, isBestSeller: true, isOnSale: false, isFeatured: true, isActive: true, salesCount: 200, viewCount: 600, createdAt: new Date(), updatedAt: new Date(), categoryId: '1' }
]

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [books, setBooks] = useState<Book[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCategory(mockCategories[slug] || null)
      setBooks(mockBooks)
      setLoading(false)
    }, 300)
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)', padding: '2rem 0' }}>
          <div className="container"><SkeletonBookGrid count={8} /></div>
        </main>
        <Footer />
      </>
    )
  }

  if (!category) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)', padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1>ವಿಭಾಗ ಕಂಡುಬಂದಿಲ್ಲ</h1>
            <Link href="/books" className="btn btn-primary" style={{ marginTop: '1rem' }}>ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Category Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)', padding: '3rem 0' }}>
          <div className="container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <Link href="/books" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಪುಸ್ತಕಗಳು</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ color: 'var(--color-text)' }}>{category.name}</span>
            </nav>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>📚 {category.name}</h1>
            {category.description && <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem' }}>{category.description}</p>}
          </div>
        </div>

        <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-light)' }}>{books.length} ಪುಸ್ತಕಗಳು</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input select" style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem' }}>
                <option value="newest">ಹೊಸವು ಮೊದಲು</option>
                <option value="price_asc">ಬೆಲೆ: ಕಡಿಮೆ → ಹೆಚ್ಚು</option>
                <option value="price_desc">ಬೆಲೆ: ಹೆಚ್ಚು → ಕಡಿಮೆ</option>
                <option value="popular">ಜನಪ್ರಿಯ</option>
              </select>
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem', background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--color-text)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem', background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--color-text)', border: 'none', cursor: 'pointer', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}><List size={18} /></button>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)' }}>
              <BookOpen size={60} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3>ಈ ವಿಭಾಗದಲ್ಲಿ ಪುಸ್ತಕಗಳಿಲ್ಲ</h3>
              <Link href="/books" className="btn btn-primary" style={{ marginTop: '1rem' }}>ಎಲ್ಲಾ ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ</Link>
            </div>
          ) : (
            <div className="product-grid">
              {books.map(book => (
                <Link key={book.id} href={`/books/${book.slug}`} className="book-card">
                  <div className="book-card-image" style={{ background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    <div className="book-card-badges">
                      {book.isNewRelease && <span className="badge badge-new">ಹೊಸ</span>}
                      {book.isBestSeller && <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>}
                      {book.isOnSale && book.mrp > book.sellingPrice && <span className="badge badge-sale">{Math.round(((book.mrp - book.sellingPrice) / book.mrp) * 100)}% ರಿಯಾಯಿತಿ</span>}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>{book.author}</p>
                    <div className="price-group">
                      <span className="price-current">{formatCurrency(book.sellingPrice)}</span>
                      {book.mrp > book.sellingPrice && <span className="price-original">{formatCurrency(book.mrp)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
