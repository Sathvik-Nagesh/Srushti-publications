'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen, Tag, Package, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

interface Category { id: string; name: string; nameEn?: string }

interface BookFormData {
  id: string
  title: string
  titleEn: string
  slug: string
  author: string
  authorEn: string
  description: string
  descriptionEn: string
  categoryId: string
  mrp: string
  sellingPrice: string
  stockQuantity: string
  lowStockAlert: string
  isbn: string
  pages: string
  publicationYear: string
  edition: string
  language: string
  weight: string
  dimensions: string
  coverImage: string
  coverImagePublicId: string
  isNewRelease: boolean
  isBestSeller: boolean
  isOnSale: boolean
  isFeatured: boolean
  isActive: boolean
}

const defaultBook: BookFormData = {
  id: '', title: '', titleEn: '', slug: '', author: '', authorEn: '',
  description: '', descriptionEn: '', categoryId: '', mrp: '', sellingPrice: '', stockQuantity: '', lowStockAlert: '',
  isbn: '', pages: '', publicationYear: '', edition: '', language: 'ಕನ್ನಡ', weight: '', dimensions: '', coverImage: '', coverImagePublicId: '',
  isNewRelease: false, isBestSeller: false, isOnSale: false, isFeatured: false, isActive: true
}

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<BookFormData>(defaultBook)

  // Fetch book data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories')
        const catData = await catRes.json()
        if (catData.success) {
          setCategories(catData.data)
        }

        // Fetch book by ID
        const bookRes = await fetch(`/api/admin/books/${id}`)
        const bookData = await bookRes.json()
        
        if (bookData.success && bookData.data) {
          const book = bookData.data
          setFormData({
            id: book.id,
            title: book.title || '',
            titleEn: book.titleEn || '',
            slug: book.slug || '',
            author: book.author || '',
            authorEn: book.authorEn || '',
            description: book.description || '',
            descriptionEn: book.descriptionEn || '',
            categoryId: book.categoryId || '',
            mrp: book.mrp?.toString() || '',
            sellingPrice: book.sellingPrice?.toString() || '',
            stockQuantity: book.stockQuantity?.toString() || '',
            lowStockAlert: book.lowStockAlert?.toString() || '',
            isbn: book.isbn || '',
            pages: book.pages?.toString() || '',
            publicationYear: book.publicationYear?.toString() || '',
            edition: book.edition || '',
            language: book.language || 'ಕನ್ನಡ',
            weight: book.weight?.toString() || '',
            dimensions: book.dimensions || '',
            coverImage: book.coverImage || '',
            coverImagePublicId: book.coverImagePublicId || '',
            isNewRelease: book.isNewRelease || false,
            isBestSeller: book.isBestSeller || false,
            isOnSale: book.isOnSale || false,
            isFeatured: book.isFeatured || false,
            isActive: book.isActive !== false
          })
        } else {
          toast.error('ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ')
          router.push('/admin/books')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('ಡೇಟಾ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
    toast.success('ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author || !formData.categoryId || !formData.mrp || !formData.sellingPrice) {
      toast.error('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          titleEn: formData.titleEn || null,
          author: formData.author,
          authorEn: formData.authorEn || null,
          description: formData.description,
          descriptionEn: formData.descriptionEn || null,
          categoryId: formData.categoryId,
          mrp: parseFloat(formData.mrp),
          sellingPrice: parseFloat(formData.sellingPrice),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          lowStockAlert: parseInt(formData.lowStockAlert) || 5,
          isbn: formData.isbn || null,
          pages: formData.pages ? parseInt(formData.pages) : null,
          publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
          edition: formData.edition || null,
          language: formData.language,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dimensions: formData.dimensions || null,
          coverImage: formData.coverImage,
          isNewRelease: formData.isNewRelease,
          isBestSeller: formData.isBestSeller,
          isOnSale: formData.isOnSale,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('ಪುಸ್ತಕ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!')
        router.push('/admin/books')
      } else {
        throw new Error(data.error || 'Update failed')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('ಈ ಪುಸ್ತಕವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?')) return
    
    try {
      const response = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        toast.success('ಪುಸ್ತಕ ಅಳಿಸಲಾಗಿದೆ')
        router.push('/admin/books')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/books" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>ಪುಸ್ತಕ ಸಂಪಾದಿಸಿ</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', margin: 0 }}>{formData.title}</p>
          </div>
        </div>
        <button onClick={handleDelete} className="btn" style={{ background: '#fee2e2', color: 'var(--color-error)' }}>
          <Trash2 size={18} /> ಅಳಿಸಿ
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Cover Image Section */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📷 ಮುಖಪುಟ ಚಿತ್ರ
            </h2>
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

          {/* Basic Info */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} /> ಮೂಲ ಮಾಹಿತಿ
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="label">ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ) *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="ಪುಸ್ತಕದ ಹೆಸರು" required />
                </div>
                <div className="form-group">
                  <label className="label">Title (English)</label>
                  <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="input" placeholder="Book title in English" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="label">ಲೇಖಕ (ಕನ್ನಡ) *</label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} className="input" placeholder="ಲೇಖಕರ ಹೆಸರು" required />
                </div>
                <div className="form-group">
                  <label className="label">Author (English)</label>
                  <input type="text" name="authorEn" value={formData.authorEn} onChange={handleChange} className="input" placeholder="Author name in English" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">ವಿವರಣೆ</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows={4} placeholder="ಪುಸ್ತಕದ ವಿವರಣೆ..." />
              </div>
              <div className="form-group">
                <label className="label">ವರ್ಗ *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input" required>
                  <option value="">ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={20} /> ಬೆಲೆ ಮತ್ತು ಸ್ಟಾಕ್
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="label">MRP (₹) *</label>
                <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="input" placeholder="450" required />
              </div>
              <div className="form-group">
                <label className="label">ಮಾರಾಟ ಬೆಲೆ (₹) *</label>
                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="input" placeholder="399" required />
              </div>
              <div className="form-group">
                <label className="label">ಸ್ಟಾಕ್ ಪ್ರಮಾಣ</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="input" placeholder="25" />
              </div>
              <div className="form-group">
                <label className="label">ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ</label>
                <input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} className="input" placeholder="5" />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} /> ಪುಸ್ತಕ ವಿವರಗಳು
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="label">ISBN</label>
                <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="input" placeholder="978-81-7286-123-4" />
              </div>
              <div className="form-group">
                <label className="label">ಪುಟಗಳು</label>
                <input type="number" name="pages" value={formData.pages} onChange={handleChange} className="input" placeholder="560" />
              </div>
              <div className="form-group">
                <label className="label">ಪ್ರಕಟಣೆ ವರ್ಷ</label>
                <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="input" placeholder="2024" />
              </div>
              <div className="form-group">
                <label className="label">ಆವೃತ್ತಿ</label>
                <input type="text" name="edition" value={formData.edition} onChange={handleChange} className="input" placeholder="1ನೇ ಆವೃತ್ತಿ" />
              </div>
              <div className="form-group">
                <label className="label">ತೂಕ (ಗ್ರಾಂ)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input" placeholder="650" />
              </div>
              <div className="form-group">
                <label className="label">ಆಯಾಮಗಳು</label>
                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="input" placeholder="22 x 14 x 3 cm" />
              </div>
            </div>
          </div>

          {/* Flags */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>🏷️ ಲೇಬಲ್‌ಗಳು</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {[
                { name: 'isActive', label: 'ಸಕ್ರಿಯ' },
                { name: 'isNewRelease', label: 'ಹೊಸ ಬಿಡುಗಡೆ' },
                { name: 'isBestSeller', label: 'ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್' },
                { name: 'isOnSale', label: 'ಮಾರಾಟದಲ್ಲಿ' },
                { name: 'isFeatured', label: 'ಮುಖ್ಯಾಂಶ' }
              ].map(flag => (
                <label key={flag.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name={flag.name}
                    checked={formData[flag.name as keyof BookFormData] as boolean}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                  />
                  <span>{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/books" className="btn btn-ghost">ರದ್ದುಮಾಡಿ</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <><div className="spinner" style={{ width: 18, height: 18 }} /> ಉಳಿಸಲಾಗುತ್ತಿದೆ...</> : <><Save size={18} /> ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ</>}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
