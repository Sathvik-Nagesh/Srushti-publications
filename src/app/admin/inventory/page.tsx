'use client'

import { useState, useEffect } from 'react'
import { Package, AlertTriangle, RefreshCcw, Plus, Minus, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Book {
  id: string
  title: string
  titleEn?: string
  coverImage: string
  stockQuantity: number
  lowStockAlert: number
  salesCount: number
  category?: { name: string }
}

interface InventorySummary {
  totalBooks: number
  outOfStock: number
  lowStock: number
  healthyStock: number
}

export default function AdminInventoryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [summary, setSummary] = useState<InventorySummary>({ totalBooks: 0, outOfStock: 0, lowStock: 0, healthyStock: 0 })
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState<number>(0)

  const fetchInventory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/inventory?filter=${filter}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setBooks(data.data)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      toast.error('ಸ್ಟಾಕ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [filter])

  const handleUpdateStock = async (bookId: string, newStock: number) => {
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, stockQuantity: newStock })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        setEditingId(null)
        fetchInventory()
      } else {
        toast.error(data.error || 'ಅಪ್ಡೇಟ್ ವಿಫಲ')
      }
    } catch (error) {
      toast.error('ಅಪ್ಡೇಟ್ ವಿಫಲ')
    }
  }

  const handleQuickAdjust = async (bookId: string, action: 'add' | 'subtract', quantity: number = 10) => {
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, action, quantity })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        fetchInventory()
      } else {
        toast.error(data.error || 'ಅಪ್ಡೇಟ್ ವಿಫಲ')
      }
    } catch (error) {
      toast.error('ಅಪ್ಡೇಟ್ ವಿಫಲ')
    }
  }

  const getStockStatus = (book: Book) => {
    if (book.stockQuantity === 0) {
      return { label: 'ಸ್ಟಾಕ್ ಖಾಲಿ', color: '#ef4444', bg: '#ef444420' }
    }
    if (book.stockQuantity <= book.lowStockAlert) {
      return { label: 'ಕಡಿಮೆ ಸ್ಟಾಕ್', color: '#f59e0b', bg: '#f59e0b20' }
    }
    return { label: 'ಸ್ಟಾಕ್ ಇದೆ', color: '#10b981', bg: '#10b98120' }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            📦 ಸ್ಟಾಕ್ ನಿರ್ವಹಣೆ
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಪುಸ್ತಕಗಳ ಸ್ಟಾಕ್ ಮಟ್ಟವನ್ನು ಮಾನಿಟರ್ ಮಾಡಿ ಮತ್ತು ನವೀಕರಿಸಿ
          </p>
        </div>
        
        <button
          onClick={fetchInventory}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCcw size={18} />
          ರಿಫ್ರೆಶ್
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div
          onClick={() => setFilter('out_of_stock')}
          style={{
            background: filter === 'out_of_stock' ? '#ef444420' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'out_of_stock' ? '2px solid #ef4444' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
            {summary.outOfStock}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಸ್ಟಾಕ್ ಖಾಲಿ
          </div>
        </div>
        
        <div
          onClick={() => setFilter('low_stock')}
          style={{
            background: filter === 'low_stock' ? '#f59e0b20' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'low_stock' ? '2px solid #f59e0b' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            {summary.lowStock}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಕಡಿಮೆ ಸ್ಟಾಕ್
          </div>
        </div>
        
        <div
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' ? '#10b98120' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'all' ? '2px solid #10b981' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
            {summary.healthyStock}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಸ್ಟಾಕ್ ಇದೆ
          </div>
        </div>
        
        <div style={{
          background: 'var(--color-cream-light)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {summary.totalBooks}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಒಟ್ಟು ಪುಸ್ತಕಗಳು
          </div>
        </div>
      </div>

      {/* Books List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      ) : books.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <Package size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>
            ಪುಸ್ತಕಗಳಿಲ್ಲ
          </p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>ಪುಸ್ತಕ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>ಸ್ಟಾಕ್</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>ಅಲರ್ಟ್</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>ಮಾರಾಟ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>ಸ್ಥಿತಿ</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>ಕ್ರಿಯೆಗಳು</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => {
                  const status = getStockStatus(book)
                  const isEditing = editingId === book.id
                  
                  return (
                    <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 40,
                            height: 50,
                            background: 'var(--color-cream-light)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            {book.coverImage ? (
                              <img 
                                src={book.coverImage} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Package size={20} style={{ color: 'var(--color-text-muted)' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{book.title}</div>
                            {book.category && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                {book.category.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                            className="input"
                            style={{ width: '80px', textAlign: 'center', padding: '0.5rem' }}
                            min={0}
                            autoFocus
                          />
                        ) : (
                          <span style={{ 
                            fontWeight: 700, 
                            fontSize: '1.125rem',
                            color: book.stockQuantity === 0 ? '#ef4444' : 'inherit'
                          }}>
                            {book.stockQuantity}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                        {book.lowStockAlert}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                        {book.salesCount}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          background: status.bg,
                          color: status.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleUpdateStock(book.id, editStock)}
                              className="btn btn-primary"
                              style={{ padding: '0.5rem' }}
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem' }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleQuickAdjust(book.id, 'subtract', 1)}
                              className="btn btn-ghost"
                              style={{ padding: '0.5rem' }}
                              title="1 ಕಡಿಮೆ"
                            >
                              <Minus size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(book.id)
                                setEditStock(book.stockQuantity)
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              ಎಡಿಟ್
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(book.id, 'add', 10)}
                              className="btn btn-ghost"
                              style={{ padding: '0.5rem' }}
                              title="+10"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alert for low stock */}
      {summary.outOfStock > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#ef444415',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #ef444430',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.25rem' }}>
              {summary.outOfStock} ಪುಸ್ತಕಗಳ ಸ್ಟಾಕ್ ಖಾಲಿಯಾಗಿದೆ!
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
              ಗ್ರಾಹಕರು ಇವುಗಳನ್ನು ಖರೀದಿಸಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಟಾಕ್ ತುಂಬಿಸಿ.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
