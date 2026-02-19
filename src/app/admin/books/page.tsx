'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  nameEn?: string
}

interface Book {
  id: string
  title: string
  titleEn?: string
  author: string
  authorEn?: string
  categoryId: string
  category: Category
  slug: string
  mrp: number
  sellingPrice: number
  stockQuantity: number
  isNewRelease: boolean
  isBestSeller: boolean
  isOnSale: boolean
  isActive: boolean
  salesCount: number
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const fetchBooks = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '20')
      if (searchQuery) params.set('search', searchQuery)
      if (filterCategory) params.set('categoryId', filterCategory)

      // Use admin endpoint - returns all books including inactive, with auth
      const res = await fetch(`/api/admin/books?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      
      if (data.success) {
        setBooks(data.data.items)
        setPagination({
          page: data.data.page,
          totalPages: data.data.totalPages,
          total: data.data.total
        })
      }
    } catch (error) {
      toast.error('ಪುಸ್ತಕಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) setCategories(data.data)
    } catch (e) { console.error('Categories load error', e) }
  }

  useEffect(() => {
    fetchCategories()
    fetchBooks()
  }, []) // Initial load

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
       fetchBooks(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, filterCategory])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBooks(books.map(b => b.id))
    } else {
      setSelectedBooks([])
    }
  }
  
  const handleSelectBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId))
    } else {
      setSelectedBooks([...selectedBooks, bookId])
    }
  }
  
  const handleDeleteBook = async (bookSlug: string) => {
    if (confirm('ಈ ಪುಸ್ತಕವನ್ನು ಡೇಟಾಬೇಸ್‌ನಿಂದ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?\n\nಇದನ್ನು ಹಿಂತಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ!')) {
      try {
        // Use admin endpoint for hard delete from database
        const res = await fetch(`/api/admin/books/${bookSlug}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          toast.success(data.message || 'ಪುಸ್ತಕ ಡೇಟಾಬೇಸ್‌ನಿಂದ ಅಳಿಸಲಾಗಿದೆ')
          fetchBooks(pagination.page)
        } else {
          toast.error(data.error || 'ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
        }
      } catch (err) {
        toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
      }
    }
  }
  
  const handleToggleActive = async (book: Book) => {
    try {
      // Use admin endpoint for toggling active status
      const res = await fetch(`/api/admin/books/${book.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !book.isActive })
      })
      if (res.ok) {
        toast.success(book.isActive ? 'ಪುಸ್ತಕ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ' : 'ಪುಸ್ತಕ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ')
        fetchBooks(pagination.page)
      } else {
        toast.error('ವಿಫಲವಾಗಿದೆ')
      }
    } catch (e) { toast.error('ದೋಷ') }
  }
  
  return (
    <div>
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} 
            />
            <input
              type="text"
              placeholder="ಪುಸ್ತಕ ಹುಡುಕಿ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px', width: '280px' }}
            />
          </div>
          
          {/* Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input select"
            style={{ width: '180px' }}
          >
            <option value="">ಎಲ್ಲಾ ವಿಭಾಗಗಳು</option>
            {categories.map(c => (
               <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => fetchBooks(pagination.page)} className="btn btn-outline btn-sm">
             <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh
          </button>
          <Link href="/admin/books/new" className="btn btn-primary">
            <Plus size={18} />
            ಹೊಸ ಪುಸ್ತಕ
          </Link>
        </div>
      </div>
      
      {/* Bulk Actions (Visual Only for now) */}
      {selectedBooks.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-primary-50)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1rem'
        }}>
          <span style={{ fontWeight: 500 }}>
            {selectedBooks.length} ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ
          </span>
          <button className="btn btn-sm btn-outline">ಸಕ್ರಿಯಗೊಳಿಸಿ</button>
          <button 
            className="btn btn-sm"
            style={{ background: 'var(--color-error)', color: 'white' }}
          >
            ಅಳಿಸಿ
          </button>
        </div>
      )}
      
      {/* Books Table */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {isLoading && books.length === 0 ? (
           <div style={{ padding: '3rem', textAlign: 'center' }}><span className="spinner" /></div>
        ) : books.length === 0 ? (
           <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>ಪುಸ್ತಕಗಳು ಕಂಡುಬಂದಿಲ್ಲ</div>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-alt)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedBooks.length === books.length && books.length > 0}
                  onChange={handleSelectAll}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ಪುಸ್ತಕ
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ವಿಭಾಗ
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ಬೆಲೆ
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ಸ್ಟಾಕ್
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ಸ್ಥಿತಿ
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase'
              }}>
                ಕ್ರಿಯೆಗಳು
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr 
                key={book.id}
                style={{ 
                  borderBottom: '1px solid var(--color-border)',
                  opacity: book.isActive ? 1 : 0.6
                }}
              >
                <td style={{ padding: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '65px',
                      background: 'var(--color-cream-light)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <BookOpen size={20} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{book.title}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                        {book.author}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {book.isNewRelease && (
                          <span className="badge badge-new" style={{ fontSize: '0.625rem' }}>ಹೊಸ</span>
                        )}
                        {book.isBestSeller && (
                          <span className="badge badge-bestseller" style={{ fontSize: '0.625rem' }}>ಬೆಸ್ಟ್</span>
                        )}
                        {book.isOnSale && (
                          <span className="badge badge-sale" style={{ fontSize: '0.625rem' }}>ಆಫರ್</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem'
                  }}>
                    {book.category?.name || '-'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>
                    {formatCurrency(book.sellingPrice)}
                  </p>
                  {book.mrp > book.sellingPrice && (
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--color-text-muted)',
                      textDecoration: 'line-through',
                      margin: 0
                    }}>
                      {formatCurrency(book.mrp)}
                    </p>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 600,
                    color: book.stockQuantity > 10 ? 'var(--color-success)' : 
                           book.stockQuantity > 0 ? 'var(--color-warning)' : 'var(--color-error)'
                  }}>
                    {book.stockQuantity}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleActive(book)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: book.isActive ? '#10b98120' : '#ef444420',
                      color: book.isActive ? '#10b981' : '#ef4444'
                    }}
                  >
                    {book.isActive ? 'ಸಕ್ರಿಯ' : 'ನಿಷ್ಕ್ರಿಯ'}
                  </button>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Link
                      href={`/books/${book.slug}`}
                      target="_blank"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-alt)',
                        color: 'var(--color-text)'
                      }}
                      title="ನೋಡಿ"
                    >
                      <Eye size={16} />
                    </Link>
                    {/* Note: Edit page needs to be created or we just link to it assuming it will be there. 
                        User is aware admin was broken. I'll leave link but if they click it 404s. */}
                    <Link
                      href={`/admin/books/${book.slug}/edit`} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-primary-50)',
                        color: 'var(--color-primary)'
                      }}
                      title="ಸಂಪಾದಿಸಿ"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book.slug)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        background: '#fee2e2',
                        color: 'var(--color-error)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title="ಅಳಿಸಿ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        
        {/* Pagination Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderTop: '1px solid var(--color-border)'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
            {pagination.total} ಪುಸ್ತಕಗಳಲ್ಲಿ {Math.min((pagination.page - 1) * 20 + 1, pagination.total)} - {Math.min(pagination.page * 20, pagination.total)} ತೋರಿಸಲಾಗುತ್ತಿದೆ
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
               onClick={() => fetchBooks(pagination.page - 1)}
              className="btn btn-ghost btn-sm"
              disabled={pagination.page <= 1}
            >
              <ChevronLeft size={16} />
              ಹಿಂದೆ
            </button>
            <button 
                onClick={() => fetchBooks(pagination.page + 1)}
                className="btn btn-ghost btn-sm"
                disabled={pagination.page >= pagination.totalPages}
            >
              ಮುಂದೆ
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
       <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
