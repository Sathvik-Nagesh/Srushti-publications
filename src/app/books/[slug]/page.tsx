'use client'

import { useState, use, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import QuantitySelector from '@/components/QuantitySelector'
import RecentlyViewed, { addToRecentlyViewed } from '@/components/RecentlyViewed'
import { useCartStore } from '@/lib/store'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  BookOpen, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Book } from '@/lib/types'

// Dynamic import for heavy component - loads on demand after hydration
const BookReviews = dynamic(() => import('@/components/BookReviews'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-xl)' }} />
})

export default function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  
  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/books/${resolvedParams.slug}`)
            const data = await res.json()
            
            if (data.success && data.data.book) {
                setBook(data.data.book)
                setRelatedBooks(data.data.relatedBooks || [])
            } else {
                toast.error('ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ')
                router.push('/books')
            }
        } catch (error) {
            console.error('Error fetching book:', error)
            toast.error('ದೋಷ ಉಂಟಾಗಿದೆ')
            router.push('/books')
        } finally {
            setLoading(false)
        }
    }
    
    if (resolvedParams.slug) {
        fetchBook()
    }
  }, [resolvedParams.slug, router])
  
  // Track recently viewed books
  useEffect(() => {
    if (book) {
      addToRecentlyViewed({
        id: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        price: book.sellingPrice,
        mrp: book.mrp
      })
    }
  }, [book])
  
  const handleAddToCart = () => {
    if (!book) return;
    
    if (book.stockQuantity <= 0) {
      toast.error('ಈ ಪುಸ್ತಕ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ')
      return
    }
    
    setIsAddingToCart(true)
    
    // Add to cart
    for (let i = 0; i < quantity; i++) {
      addItem(book as any)
    }
    
    toast.success(`${quantity} ಪುಸ್ತಕಗಳನ್ನು ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!`)
    
    setTimeout(() => setIsAddingToCart(false), 500)
  }
  
  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }
  
  const handleShare = async () => {
    if (!book) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `${book.title} - ${book.author}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href)
      toast.success('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!')
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <>
        <Header />
         <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid var(--color-primary-100)', 
                borderTopColor: 'var(--color-primary)', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
            }}></div>
            <h2>ಪುಸ್ತಕ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</h2>
          </div>
          <style jsx>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
          `}</style>
        </main>
        <Footer />
      </>
    )
  }
  
  if (!book) return null;

  const discountPercentage = calculateDiscountPercentage(book.mrp, book.sellingPrice)
  const isOutOfStock = book.stockQuantity <= 0
  const isLowStock = book.stockQuantity > 0 && book.stockQuantity <= (book.lowStockAlert || 10)

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Breadcrumb */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container" style={{ padding: '1rem' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <Link href="/books" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಪುಸ್ತಕಗಳು</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <Link href={book.category ? `/categories/${book.category.slug}` : '#'} style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>{book.category?.name || 'Category'}</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ color: 'var(--color-text)' }}>{book.title}</span>
            </nav>
          </div>
        </div>
        
        {/* Book Details */}
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Left - Book Image */}
              <div>
                <div style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                   {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 600px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <BookOpen size={100} style={{ color: 'var(--color-primary)', opacity: 0.4 }} />
                  )}
                  
                  {/* Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    zIndex: 10
                  }}>
                    {book.isNewRelease && (
                      <span className="badge badge-new">ಹೊಸ ಬಿಡುಗಡೆ</span>
                    )}
                    {book.isBestSeller && (
                      <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="badge badge-sale">{discountPercentage}% ರಿಯಾಯಿತಿ</span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1rem'
                }}>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                    onClick={() => toast.success('ಇಚ್ಛೆಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!')}
                  >
                    <Heart size={18} />
                    ಇಚ್ಛೆಪಟ್ಟಿ
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                    ಹಂಚಿಕೊಳ್ಳಿ
                  </button>
                </div>
              </div>
              
              {/* Right - Book Info */}
              <div>
                {/* Category */}
                 {book.category && (
                    <Link 
                        href={`/categories/${book.category.slug}`}
                        style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            background: 'var(--color-primary-50)',
                            color: 'var(--color-primary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            marginBottom: '1rem'
                        }}
                    >
                    {book.category.name}
                    </Link>
                )}
                
                {/* Title */}
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}>
                  {book.title}
                </h1>
                
                {/* Author */}
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: 'var(--color-text-light)',
                  marginBottom: '1.5rem'
                }}>
                  ಲೇಖಕ: <strong style={{ color: 'var(--color-text)' }}>{book.author}</strong>
                </p>
                
                {/* Price Section */}
                <div style={{
                  background: 'var(--color-cream-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {formatCurrency(book.sellingPrice)}
                    </span>
                    {book.mrp > book.sellingPrice && (
                      <>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          color: 'var(--color-text-muted)',
                          textDecoration: 'line-through'
                        }}>
                          {formatCurrency(book.mrp)}
                        </span>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--color-success)'
                        }}>
                          {discountPercentage}% ಉಳಿತಾಯ
                        </span>
                      </>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                    ಎಲ್ಲಾ ತೆರಿಗೆಗಳು ಸೇರಿವೆ
                  </p>
                </div>
                
                {/* Stock Status */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {isOutOfStock ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'var(--color-error)'
                    }}>
                      <AlertCircle size={20} />
                      <span style={{ fontWeight: 500 }}>ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ</span>
                    </div>
                  ) : isLowStock ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'var(--color-warning)'
                    }}>
                      <AlertCircle size={20} />
                      <span style={{ fontWeight: 500 }}>ಕೇವಲ {book.stockQuantity} ಬಾಕಿ!</span>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'var(--color-success)'
                    }}>
                      <Check size={20} />
                      <span style={{ fontWeight: 500 }}>ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ</span>
                    </div>
                  )}
                </div>
                
                {/* Quantity & Add to Cart */}
                {!isOutOfStock && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      fontWeight: 500
                    }}>
                      ಪ್ರಮಾಣ
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <QuantitySelector
                        quantity={quantity}
                        maxQuantity={book.stockQuantity}
                        onQuantityChange={setQuantity}
                      />
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="btn btn-outline btn-lg"
                    style={{ flex: 1 }}
                  >
                    <ShoppingCart size={20} />
                    ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                  >
                    ಈಗಲೇ ಖರೀದಿಸಿ
                  </button>
                </div>
                
                {/* Delivery Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Truck size={24} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', margin: 0 }}>ವೇಗದ ವಿತರಣೆ</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>5-7 ದಿನಗಳು</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield size={24} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', margin: 0 }}>ಸುರಕ್ಷಿತ ಪಾವತಿ</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>100% ಸುರಕ್ಷಿತ</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <RefreshCw size={24} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', margin: 0 }}>ಸುಲಭ ಮರುಪಾವತಿ</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: 0 }}>7 ದಿನಗಳು</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Book Details Tabs */}
            <div style={{
              marginTop: '2rem',
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                ಪುಸ್ತಕದ ವಿವರಗಳು
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {/* Description */}
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                    ವಿವರಣೆ
                  </h3>
                  <div style={{ 
                    color: 'var(--color-text-light)', 
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {book.description}
                  </div>
                </div>
                
                {/* Specifications */}
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                    ವಿಶೇಷತೆಗಳು
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        { label: 'ISBN', value: book.isbn },
                        { label: 'ಭಾಷೆ', value: book.language },
                        { label: 'ಪುಟಗಳು', value: book.pages },
                        { label: 'ಪ್ರಕಟಣೆ ವರ್ಷ', value: book.publicationYear },
                        { label: 'ಆವೃತ್ತಿ', value: book.edition },
                        { label: 'ತೂಕ', value: book.weight ? `${book.weight} ಗ್ರಾಂ` : '-' },
                        { label: 'ಆಯಾಮಗಳು', value: book.dimensions },
                      ].map((spec, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ 
                            padding: '0.75rem 0', 
                            color: 'var(--color-text-light)',
                            width: '40%'
                          }}>
                            {spec.label}
                          </td>
                          <td style={{ 
                            padding: '0.75rem 0', 
                            fontWeight: 500 
                          }}>
                            {spec.value || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="section">
          <div className="container">
            <BookReviews bookId={book.id} bookTitle={book.title} />
          </div>
        </section>
        
        {/* Related Books */}
        <section className="section" style={{ background: 'var(--color-cream-light)' }}>
          <div className="container">
            <h2 className="section-title">ಸಂಬಂಧಿತ ಪುಸ್ತಕಗಳು</h2>
            
            <div className="product-grid">
              {relatedBooks.map(book => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="book-card"
                >
                  <div className="book-card-image" style={{
                    background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                     {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 600px) 100vw, 33vw"
                        />
                      ) : (
                        <BookOpen size={50} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                      )}
                    <div className="book-card-badges">
                      {book.isNewRelease && <span className="badge badge-new">ಹೊಸ</span>}
                      {book.isBestSeller && <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '0.25rem'
                    }}>
                      {book.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-light)',
                      marginBottom: '0.75rem'
                    }}>
                      {book.author}
                    </p>
                    <div className="price-group">
                      <span className="price-current">{formatCurrency(book.sellingPrice)}</span>
                      {book.mrp > book.sellingPrice && (
                        <span className="price-original">{formatCurrency(book.mrp)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
