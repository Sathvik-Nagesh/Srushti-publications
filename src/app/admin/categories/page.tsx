'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  nameEn?: string
  slug: string
  description?: string
  bookCount: number
  isActive: boolean
  sortOrder: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', nameEn: '', description: '', isActive: true })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      // Add timestamp to prevent caching
      const res = await fetch(`/api/categories?t=${Date.now()}`)
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      } else {
        toast.error('ವಿಭಾಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ 
        name: category.name, 
        nameEn: category.nameEn || '', 
        description: category.description || '', 
        isActive: category.isActive 
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', nameEn: '', description: '', isActive: true })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) { toast.error('ಹೆಸರು ಅಗತ್ಯವಿದೆ'); return }
    
    setIsSubmitting(true)
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success(editingCategory ? 'ವಿಭಾಗ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'ಹೊಸ ವಿಭಾಗ ಸೇರಿಸಲಾಗಿದೆ!')
        setShowModal(false)
        fetchCategories()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'ಕಾರ್ಯ ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`'${name}' ವಿಭಾಗವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?`)) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
        const data = await res.json()
        
        if (data.success) {
          toast.success('ವಿಭಾಗ ಅಳಿಸಲಾಗಿದೆ')
          fetchCategories()
        } else {
          toast.error(data.error || 'ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
        }
      } catch (error) {
        toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
      }
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, isActive: !category.isActive })
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
        toast.success('ಸ್ಥಿತಿ ಬದಲಾಯಿಸಲಾಗಿದೆ')
      }
    } catch (error) {
      toast.error('ಬದಲಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ವಿಭಾಗಗಳು ({categories.length})</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchCategories} className="btn btn-outline" title="Refresh">
             <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary"><Plus size={18} /> ಹೊಸ ವಿಭಾಗ</button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <span className="spinner" />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
             ಯಾವುದೇ ವಿಭಾಗಗಳು ಇಲ್ಲ. ಹೊಸದನ್ನು ಸೇರಿಸಿ!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', width: '40px' }}>#</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ವಿಭಾಗ</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ವಿವರಣೆ</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಪುಸ್ತಕಗಳು</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಸ್ಥಿತಿ</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>ಕ್ರಿಯೆಗಳು</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: cat.isActive ? 1 : 0.6 }}>
                  <td style={{ padding: '1rem' }}><GripVertical size={16} style={{ color: 'var(--color-text-muted)', cursor: 'grab' }} /></td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{cat.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{cat.nameEn} • /{cat.slug}</p>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>{cat.description || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{cat.bookCount || 0}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => toggleActive(cat)} style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', background: cat.isActive ? '#10b98120' : '#ef444420', color: cat.isActive ? '#10b981' : '#ef4444' }}>
                      {cat.isActive ? 'ಸಕ್ರಿಯ' : 'ನಿಷ್ಕ್ರಿಯ'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(cat)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: 'var(--color-error)', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingCategory ? 'ವಿಭಾಗ ಸಂಪಾದಿಸಿ' : 'ಹೊಸ ವಿಭಾಗ'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="label">ಹೆಸರು (ಕನ್ನಡ) *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="ಸಾಹಿತ್ಯ" required /></div>
                <div><label className="label">Name (English)</label><input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="input" placeholder="Literature" /></div>
                <div><label className="label">ವಿವರಣೆ</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input" rows={3} placeholder="ವಿಭಾಗದ ವಿವರಣೆ..." /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: 'var(--color-primary)' }} /><span>ಸಕ್ರಿಯ</span></label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>ರದ್ದು</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {isSubmitting ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : (editingCategory ? 'ಉಳಿಸಿ' : 'ಸೇರಿಸಿ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
