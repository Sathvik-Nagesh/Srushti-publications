'use client'

import { useState } from 'react'
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
  Upload
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data
const mockBooks = [
  {
    id: '1',
    title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು',
    author: 'ಕುವೆಂಪು',
    category: 'ಸಾಹಿತ್ಯ',
    mrp: 450,
    sellingPrice: 399,
    stockQuantity: 25,
    isNewRelease: true,
    isBestSeller: true,
    isOnSale: true,
    isActive: true,
    salesCount: 150
  },
  {
    id: '2',
    title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
    author: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್',
    category: 'ಶೈಕ್ಷಣಿಕ',
    mrp: 550,
    sellingPrice: 495,
    stockQuantity: 15,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: false,
    isActive: true,
    salesCount: 200
  },
  {
    id: '3',
    title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು',
    author: 'ವಿಷ್ಣುಶರ್ಮ',
    category: 'ಮಕ್ಕಳು',
    mrp: 199,
    sellingPrice: 149,
    stockQuantity: 50,
    isNewRelease: true,
    isBestSeller: false,
    isOnSale: true,
    isActive: true,
    salesCount: 80
  },
  {
    id: '4',
    title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ',
    author: 'ಶ್ರೀಕಾಂತ್ ಎನ್',
    category: 'ಪರೀಕ್ಷಾ',
    mrp: 799,
    sellingPrice: 699,
    stockQuantity: 0,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: true,
    isActive: true,
    salesCount: 300
  }
]

export default function AdminBooksPage() {
  const [books, setBooks] = useState(mockBooks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  
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
  
  const handleDeleteBook = (bookId: string) => {
    if (confirm('ಈ ಪುಸ್ತಕವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?')) {
      setBooks(books.filter(b => b.id !== bookId))
    }
  }
  
  const handleToggleActive = (bookId: string) => {
    setBooks(books.map(b => 
      b.id === bookId ? { ...b, isActive: !b.isActive } : b
    ))
  }
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || book.category === filterCategory
    return matchesSearch && matchesCategory
  })
  
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
            <option value="ಸಾಹಿತ್ಯ">ಸಾಹಿತ್ಯ</option>
            <option value="ಶೈಕ್ಷಣಿಕ">ಶೈಕ್ಷಣಿಕ</option>
            <option value="ಮಕ್ಕಳು">ಮಕ್ಕಳು</option>
            <option value="ಪರೀಕ್ಷಾ">ಪರೀಕ್ಷಾ</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm">
            <Download size={16} />
            ರಫ್ತು
          </button>
          <button className="btn btn-outline btn-sm">
            <Upload size={16} />
            ಆಮದು
          </button>
          <Link href="/admin/books/new" className="btn btn-primary">
            <Plus size={18} />
            ಹೊಸ ಪುಸ್ತಕ
          </Link>
        </div>
      </div>
      
      {/* Bulk Actions */}
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
          <button className="btn btn-sm btn-outline">ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ</button>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-alt)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedBooks.length === books.length}
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
            {filteredBooks.map((book) => (
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
                    {book.category}
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
                    onClick={() => handleToggleActive(book.id)}
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
                      href={`/books/${book.id}`}
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
                    <Link
                      href={`/admin/books/${book.id}/edit`}
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
                      onClick={() => handleDeleteBook(book.id)}
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
        
        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderTop: '1px solid var(--color-border)'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
            {filteredBooks.length} ಪುಸ್ತಕಗಳಲ್ಲಿ 1-{Math.min(10, filteredBooks.length)} ತೋರಿಸಲಾಗುತ್ತಿದೆ
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled
            >
              <ChevronLeft size={16} />
              ಹಿಂದೆ
            </button>
            <button className="btn btn-ghost btn-sm">
              ಮುಂದೆ
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
