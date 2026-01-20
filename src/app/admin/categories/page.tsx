'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const mockCategories = [
  { id: '1', name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature', description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಕೃತಿಗಳು', bookCount: 85, isActive: true, sortOrder: 1 },
  { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic', description: 'ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳು', bookCount: 45, isActive: true, sortOrder: 2 },
  { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children', description: 'ಮಕ್ಕಳಿಗಾಗಿ ಪುಸ್ತಕಗಳು', bookCount: 35, isActive: true, sortOrder: 3 },
  { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides', description: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ', bookCount: 25, isActive: true, sortOrder: 4 },
  { id: '5', name: 'ಇತರೆ', nameEn: 'Others', slug: 'others', description: 'ಇತರ ಪುಸ್ತಕಗಳು', bookCount: 10, isActive: false, sortOrder: 5 }
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null)
  const [formData, setFormData] = useState({ name: '', nameEn: '', description: '', isActive: true })

  const handleOpenModal = (category?: typeof mockCategories[0]) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, nameEn: category.nameEn || '', description: category.description || '', isActive: category.isActive })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', nameEn: '', description: '', isActive: true })
    }
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) { toast.error('ಹೆಸರು ಅಗತ್ಯವಿದೆ'); return }
    if (editingCategory) {
      setCategories(cats => cats.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c))
      toast.success('ವಿಭಾಗ ನವೀಕರಿಸಲಾಗಿದೆ!')
    } else {
      const newCat = { id: Date.now().toString(), ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-'), bookCount: 0, sortOrder: categories.length + 1 }
      setCategories([...categories, newCat])
      toast.success('ಹೊಸ ವಿಭಾಗ ಸೇರಿಸಲಾಗಿದೆ!')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('ಈ ವಿಭಾಗವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?')) {
      setCategories(cats => cats.filter(c => c.id !== id))
      toast.success('ವಿಭಾಗ ಅಳಿಸಲಾಗಿದೆ')
    }
  }

  const toggleActive = (id: string) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ವಿಭಾಗಗಳು ({categories.length})</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary"><Plus size={18} /> ಹೊಸ ವಿಭಾಗ</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
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
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{cat.bookCount}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button onClick={() => toggleActive(cat.id)} style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', background: cat.isActive ? '#10b98120' : '#ef444420', color: cat.isActive ? '#10b981' : '#ef4444' }}>
                    {cat.isActive ? 'ಸಕ್ರಿಯ' : 'ನಿಷ್ಕ್ರಿಯ'}
                  </button>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenModal(cat)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(cat.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: 'var(--color-error)', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingCategory ? 'ಉಳಿಸಿ' : 'ಸೇರಿಸಿ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
