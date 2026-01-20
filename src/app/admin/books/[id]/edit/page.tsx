'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen, Tag, Package, Trash2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

interface Category { id: string; name: string; nameEn?: string }

const mockCategories: Category[] = [
  { id: '1', name: 'ಸಾಹಿತ್ಯ' }, { id: '2', name: 'ಶೈಕ್ಷಣಿಕ' }, { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು' },
  { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ' }, { id: '5', name: 'ಇತರೆ' }
]

// Mock books database
const mockBooksDB = [
  {
    id: '1', title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', titleEn: 'Malegalalli Madumagalu', author: 'ಕುವೆಂಪು', authorEn: 'Kuvempu',
    description: 'ಕುವೆಂಪು ಅವರ ಅದ್ಭುತ ಕಾದಂಬರಿ', descriptionEn: 'A wonderful novel by Kuvempu',
    categoryId: '1', mrp: '450', sellingPrice: '399', stockQuantity: '25', lowStockAlert: '10',
    isbn: '978-81-7286-123-4', pages: '560', publicationYear: '2023', edition: '15ನೇ ಆವೃತ್ತಿ',
    language: 'ಕನ್ನಡ', weight: '650', dimensions: '22 x 14 x 3.5 cm', coverImage: '', coverImagePublicId: '',
    isNewRelease: true, isBestSeller: true, isOnSale: true, isFeatured: true, isActive: true
  },
  {
    id: '2', title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', titleEn: 'Karnataka History', author: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್', authorEn: 'Dr. Suryanath Kamat',
    description: 'ಕರ್ನಾಟಕದ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ', descriptionEn: 'Complete history of Karnataka',
    categoryId: '2', mrp: '550', sellingPrice: '495', stockQuantity: '15', lowStockAlert: '5',
    isbn: '978-81-7286-456-7', pages: '420', publicationYear: '2022', edition: '10ನೇ ಆವೃತ್ತಿ',
    language: 'ಕನ್ನಡ', weight: '550', dimensions: '21 x 14 x 2.5 cm', coverImage: '', coverImagePublicId: '',
    isNewRelease: false, isBestSeller: true, isOnSale: false, isFeatured: true, isActive: true
  },
  {
    id: '3', title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು', titleEn: 'Panchatantra Stories', author: 'ವಿಷ್ಣುಶರ್ಮ', authorEn: 'Vishnusharma',
    description: 'ಮಕ್ಕಳಿಗಾಗಿ ನೀತಿ ಕಥೆಗಳು', descriptionEn: 'Moral stories for children',
    categoryId: '3', mrp: '199', sellingPrice: '149', stockQuantity: '50', lowStockAlert: '10',
    isbn: '978-81-7286-789-0', pages: '180', publicationYear: '2023', edition: '5ನೇ ಆವೃತ್ತಿ',
    language: 'ಕನ್ನಡ', weight: '300', dimensions: '20 x 16 x 1.5 cm', coverImage: '', coverImagePublicId: '',
    isNewRelease: true, isBestSeller: false, isOnSale: true, isFeatured: false, isActive: true
  },
  {
    id: '4', title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ', titleEn: 'KAS Guide', author: 'ಶ್ರೀಕಾಂತ್ ಎನ್', authorEn: 'Srikanth N',
    description: 'ಕೆಎಎಸ್ ಪರೀಕ್ಷೆಗೆ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ', descriptionEn: 'Complete guide for KAS exam',
    categoryId: '4', mrp: '799', sellingPrice: '699', stockQuantity: '0', lowStockAlert: '5',
    isbn: '978-81-7286-012-3', pages: '800', publicationYear: '2024', edition: '2024 ಆವೃತ್ತಿ',
    language: 'ಕನ್ನಡ', weight: '900', dimensions: '25 x 18 x 4 cm', coverImage: '', coverImagePublicId: '',
    isNewRelease: false, isBestSeller: true, isOnSale: true, isFeatured: true, isActive: true
  }
]

const defaultBook = {
  id: '', title: '', titleEn: '', author: '', authorEn: '',
  description: '', descriptionEn: '', categoryId: '', mrp: '', sellingPrice: '', stockQuantity: '', lowStockAlert: '',
  isbn: '', pages: '', publicationYear: '', edition: '', language: 'ಕನ್ನಡ', weight: '', dimensions: '', coverImage: '', coverImagePublicId: '',
  isNewRelease: false, isBestSeller: false, isOnSale: false, isFeatured: false, isActive: true
}

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [categories] = useState<Category[]>(mockCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState(defaultBook)

  useEffect(() => {
    // Find the book by ID from mock database
    const book = mockBooksDB.find(b => b.id === id)
    if (book) {
      setFormData(book)
    } else {
      toast.error('ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ')
      router.push('/admin/books')
    }
    setIsLoading(false)
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
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
      toast.error('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ'); return
    }
    setIsSubmitting(true)
    try {
      // In real app: await fetch(`/api/books/${id}`, { method: 'PATCH', body: JSON.stringify(formData) })
      await new Promise(r => setTimeout(r, 1000))
      toast.success('ಪುಸ್ತಕ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!')
      router.push('/admin/books')
    } catch { toast.error('ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ') }
    finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!confirm('ಈ ಪುಸ್ತಕವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?')) return
    try {
      // await fetch(`/api/books/${id}`, { method: 'DELETE' })
      toast.success('ಪುಸ್ತಕ ಅಳಿಸಲಾಗಿದೆ')
      router.push('/admin/books')
    } catch { toast.error('ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ') }
  }

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/books" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}><ArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>ಪುಸ್ತಕ ಸಂಪಾದಿಸಿ</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', margin: 0 }}>{formData.title}</p>
          </div>
        </div>
        <button onClick={handleDelete} className="btn" style={{ background: '#fee2e2', color: 'var(--color-error)' }}><Trash2 size={18} /> ಅಳಿಸಿ</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} /> ಮೂಲ ಮಾಹಿತಿ</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ) *</label><input name="title" value={formData.title} onChange={handleChange} className="input" required /></div>
                  <div><label className="label">Title (English)</label><input name="titleEn" value={formData.titleEn} onChange={handleChange} className="input" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ಲೇಖಕ (ಕನ್ನಡ) *</label><input name="author" value={formData.author} onChange={handleChange} className="input" required /></div>
                  <div><label className="label">Author (English)</label><input name="authorEn" value={formData.authorEn} onChange={handleChange} className="input" /></div>
                </div>
                <div><label className="label">ವಿವರಣೆ *</label><textarea name="description" value={formData.description} onChange={handleChange} className="input" rows={4} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="label">ವಿಭಾಗ *</label><select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input select" required><option value="">ಆಯ್ಕೆಮಾಡಿ</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
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

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>📖 ಪುಸ್ತಕ ವಿವರಗಳು</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div><label className="label">ISBN</label><input name="isbn" value={formData.isbn} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಪುಟಗಳು</label><input type="number" name="pages" value={formData.pages} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಪ್ರಕಟಣೆ ವರ್ಷ</label><input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಆವೃತ್ತಿ</label><input name="edition" value={formData.edition} onChange={handleChange} className="input" /></div>
                <div><label className="label">ತೂಕ (ಗ್ರಾಂ)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಆಯಾಮಗಳು</label><input name="dimensions" value={formData.dimensions} onChange={handleChange} className="input" /></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={18} /> ಬೆಲೆ</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="label">MRP (₹) *</label><input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="input" required /></div>
                <div><label className="label">ಮಾರಾಟ ಬೆಲೆ (₹) *</label><input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="input" required /></div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> ಸ್ಟಾಕ್</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="label">ಸ್ಟಾಕ್ ಪ್ರಮಾಣ</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ</label><input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} className="input" /></div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>🏷️ ಲೇಬಲ್‌ಗಳು</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[{ name: 'isNewRelease', label: 'ಹೊಸ ಬಿಡುಗಡೆ' }, { name: 'isBestSeller', label: 'ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್' }, { name: 'isOnSale', label: 'ಆಫರ್' }, { name: 'isFeatured', label: 'ಫೀಚರ್ಡ್' }, { name: 'isActive', label: 'ಸಕ್ರಿಯ' }].map(item => (
                  <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" name={item.name} checked={(formData as any)[item.name]} onChange={handleChange} style={{ accentColor: 'var(--color-primary)' }} /><span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {isSubmitting ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : <><Save size={18} /> ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

