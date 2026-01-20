'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen, Image as ImageIcon, Tag, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

interface Category {
  id: string
  name: string
  nameEn?: string
}

const mockCategories: Category[] = [
  { id: '1', name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature' },
  { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic' },
  { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children' },
  { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides' },
  { id: '5', name: 'ಇತರೆ', nameEn: 'Others' }
]

export default function NewBookPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '', titleEn: '', author: '', authorEn: '', description: '', descriptionEn: '',
    categoryId: '', mrp: '', sellingPrice: '', stockQuantity: '', lowStockAlert: '10',
    isbn: '', pages: '', publicationYear: new Date().getFullYear().toString(), edition: '',
    language: 'ಕನ್ನಡ', weight: '', dimensions: '', coverImage: '', coverImagePublicId: '',
    isNewRelease: false, isBestSeller: false, isOnSale: false, isFeatured: false, isActive: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (url: string, publicId?: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: url,
      coverImagePublicId: publicId || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.author || !formData.categoryId || !formData.mrp || !formData.sellingPrice) {
      toast.error('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mrp: parseFloat(formData.mrp),
          sellingPrice: parseFloat(formData.sellingPrice),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          lowStockAlert: parseInt(formData.lowStockAlert) || 10,
          pages: formData.pages ? parseInt(formData.pages) : null,
          publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('ಪುಸ್ತಕ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!')
        router.push('/admin/books')
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      toast.error('ಪುಸ್ತಕ ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/books" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>ಹೊಸ ಪುಸ್ತಕ ಸೇರಿಸಿ</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', margin: 0 }}>ಪುಸ್ತಕದ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} /> ಮೂಲ ಮಾಹಿತಿ</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ) *</label><input name="title" value={formData.title} onChange={handleChange} className="input" placeholder="ಪುಸ್ತಕದ ಹೆಸರು" required /></div>
                  <div><label className="label">Title (English)</label><input name="titleEn" value={formData.titleEn} onChange={handleChange} className="input" placeholder="Book title in English" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಲೇಖಕ (ಕನ್ನಡ) *</label><input name="author" value={formData.author} onChange={handleChange} className="input" placeholder="ಲೇಖಕರ ಹೆಸರು" required /></div>
                  <div><label className="label">Author (English)</label><input name="authorEn" value={formData.authorEn} onChange={handleChange} className="input" placeholder="Author name in English" /></div>
                </div>
                <div><label className="label">ವಿವರಣೆ (ಕನ್ನಡ) *</label><textarea name="description" value={formData.description} onChange={handleChange} className="input" placeholder="ಪುಸ್ತಕದ ವಿವರಣೆ..." rows={4} required /></div>
                <div><label className="label">Description (English)</label><textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} className="input" placeholder="Book description in English..." rows={3} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ವಿಭಾಗ *</label><select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input select" required><option value="">ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="label">ಭಾಷೆ</label><input name="language" value={formData.language} onChange={handleChange} className="input" /></div>
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={18} /> ಪುಸ್ತಕ ಮುಖಪುಟ</h2>
              <ImageUpload
                value={formData.coverImage}
                onChange={handleImageUpload}
                onRemove={() => handleImageUpload('')}
                folder="books"
                aspectRatio="book"
                label="ಮುಖಪುಟ ಚಿತ್ರ"
                helpText="ಶಿಫಾರಸು: 600x800 ಪಿಕ್ಸೆಲ್. JPEG, PNG, WebP. ಗರಿಷ್ಠ 5MB."
              />
            </div>

            {/* Book Details */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>📖 ಪುಸ್ತಕ ವಿವರಗಳು</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div><label className="label">ISBN</label><input name="isbn" value={formData.isbn} onChange={handleChange} className="input" placeholder="978-XX-XXXX-XXX-X" /></div>
                <div><label className="label">ಪುಟಗಳು</label><input type="number" name="pages" value={formData.pages} onChange={handleChange} className="input" placeholder="250" /></div>
                <div><label className="label">ಪ್ರಕಟಣೆ ವರ್ಷ</label><input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಆವೃತ್ತಿ</label><input name="edition" value={formData.edition} onChange={handleChange} className="input" placeholder="1ನೇ ಆವೃತ್ತಿ" /></div>
                <div><label className="label">ತೂಕ (ಗ್ರಾಂ)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input" placeholder="350" /></div>
                <div><label className="label">ಆಯಾಮಗಳು</label><input name="dimensions" value={formData.dimensions} onChange={handleChange} className="input" placeholder="22 x 14 x 3 cm" /></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Pricing */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={18} /> ಬೆಲೆ</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="label">MRP (₹) *</label><input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="input" placeholder="450" required /></div>
                <div><label className="label">ಮಾರಾಟ ಬೆಲೆ (₹) *</label><input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="input" placeholder="399" required /></div>
                {formData.mrp && formData.sellingPrice && parseFloat(formData.mrp) > parseFloat(formData.sellingPrice) && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-success)', margin: 0 }}>
                    ✓ {Math.round(((parseFloat(formData.mrp) - parseFloat(formData.sellingPrice)) / parseFloat(formData.mrp)) * 100)}% ರಿಯಾಯಿತಿ
                  </p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> ಸ್ಟಾಕ್</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="label">ಸ್ಟಾಕ್ ಪ್ರಮಾಣ *</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="input" placeholder="50" required /></div>
                <div><label className="label">ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ</label><input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} className="input" placeholder="10" /></div>
              </div>
            </div>

            {/* Labels */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>🏷️ ಲೇಬಲ್‌ಗಳು</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'isNewRelease', label: 'ಹೊಸ ಬಿಡುಗಡೆ' },
                  { name: 'isBestSeller', label: 'ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್' },
                  { name: 'isOnSale', label: 'ಆಫರ್‌ನಲ್ಲಿದೆ' },
                  { name: 'isFeatured', label: 'ಫೀಚರ್ಡ್' },
                  { name: 'isActive', label: 'ಸಕ್ರಿಯ' }
                ].map(item => (
                  <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" name={item.name} checked={(formData as any)[item.name]} onChange={handleChange} style={{ accentColor: 'var(--color-primary)' }} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {isSubmitting ? 'ಸೇರಿಸಲಾಗುತ್ತಿದೆ...' : <><Save size={18} /> ಪುಸ್ತಕ ಸೇರಿಸಿ</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
