import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import prisma from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import BookActions from '@/components/BookActions'
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils'
import BookImage from '@/components/BookImage'
import { 
  BookOpen, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
} from 'lucide-react'

// Dynamic import for heavy client components
const BookReviews = dynamic(() => import('@/components/BookReviews'), {
  loading: () => <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-xl)' }} />
})

// Enable ISR: Revalidate book detail page every hour
export const revalidate = 3600

// Generate static params for the most popular books to speed up build and initial hits
export async function generateStaticParams() {
  const books = await prisma.book.findMany({
    where: { isActive: true },
    select: { slug: true },
    take: 20, // Pre-build top 20 books
    orderBy: { viewCount: 'desc' }
  })
 
  return books.map((book) => ({
    slug: book.slug,
  }))
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  const book = await prisma.book.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImage: true, author: true }
  })

  if (!book) {
    return {
      title: 'ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ | Srushti Publications',
    }
  }

  return {
    title: `${book.title} by ${book.author} | Srushti Publications`,
    description: (book.description || '').substring(0, 160),
    openGraph: {
      title: book.title,
      description: (book.description || '').substring(0, 160),
      images: book.coverImage ? [book.coverImage] : [],
      type: 'book',
    },
  }
}

async function getBook(slug: string) {
  const book = await prisma.book.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  })

  if (!book) return null

  // NOTE: View count increment moved to client-side beacon to avoid:
  // 1. Blocking the page render
  // 2. Running on every ISR revalidation
  // 3. Incrementing for bot crawls
  // The client component BookActions can call /api/books/[slug]/view endpoint

  return book
}

async function getRelatedBooks(categoryId: string, currentBookId: string) {
  return await prisma.book.findMany({
    where: {
      categoryId: categoryId,
      id: { not: currentBookId },
      isActive: true
    },
    take: 4,
    orderBy: { salesCount: 'desc' }
  })
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    notFound()
  }

  const relatedBooks = await getRelatedBooks(book.categoryId, book.id)
  const discountPercentage = calculateDiscountPercentage(book.mrp, book.sellingPrice)

  // Product JSON-LD with enhanced data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: book.title,
    image: book.coverImage,
    description: book.description,
    sku: book.isbn || book.id,
    isbn: book.isbn || undefined,
    author: {
      '@type': 'Person',
      name: book.author
    },
    brand: {
      '@type': 'Brand',
      name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್'
    },
    category: book.category?.name,
    inLanguage: 'kn',
    numberOfPages: book.pages || undefined,
    offers: {
      '@type': 'Offer',
      url: `https://srushtipublications.com/books/${book.slug}`,
      priceCurrency: 'INR',
      price: book.sellingPrice.toFixed(2),
      availability: book.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್'
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }

  // Breadcrumb JSON-LD for navigation
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ಮುಖಪುಟ',
        item: 'https://srushtipublications.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ಪುಸ್ತಕಗಳು',
        item: 'https://srushtipublications.com/books'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: book.category?.name || 'Category',
        item: `https://srushtipublications.com/categories/${book.category?.slug || ''}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: book.title,
        item: `https://srushtipublications.com/books/${book.slug}`
      }
    ]
  }

  return (
    <>
      {/* Product structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
                   <BookImage 
                      src={book.coverImage}
                      alt={book.title}
                   />
                  
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
                
                {/* Interactive Actions (Client Component) */}
                <BookActions book={book as any} /> 
                
                {/* Delivery Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-lg)',
                  marginTop: '1.5rem'
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
            <Suspense fallback={<div className="spinner" />}>
                <BookReviews bookId={book.id} bookTitle={book.title} />
            </Suspense>
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
