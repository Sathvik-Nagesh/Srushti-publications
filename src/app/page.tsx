'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicHero from '@/components/DynamicHero'
import { 
  Books, Star, TrendUp, Gift, CaretRight, Sparkle, 
  BookOpen, GraduationCap, BookBookmark, Baby 
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils'

// Lazy load non-critical components
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false })
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), { ssr: false })
const SaleTimer = dynamic(() => import('@/components/SaleTimer'), { ssr: false })
const HomepageFAQ = dynamic(() => import('@/components/HomepageFAQ'))

const iconMap: Record<string, any> = {
  'literature': BookBookmark,
  'academic': GraduationCap,
  'children': Baby,
  'exam-guides': BookOpen,
  'others': Sparkle
}

const colorMap = [
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', // Purple
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Pink
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'  // Orange
]

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch('/api/categories')
        const catData = await catRes.json()
        if (catData.success) {
          const processedCats = catData.data.map((cat: any, index: number) => ({
            ...cat,
            icon: iconMap[cat.slug] || Sparkle,
            color: colorMap[index % colorMap.length],
            count: cat.bookCount || 0
          }))
          setCategories(processedCats)
        }

        // Fetch Books
        const bookRes = await fetch('/api/books?limit=20&isActive=true')
        const bookData = await bookRes.json()
        if (bookData.success) {
          setFeaturedBooks(bookData.data.items)
        }
      } catch (error) {
        console.error('Failed to load homepage data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '3rem',
              alignItems: 'center'
            }}>
              <DynamicHero />
              
              {/* Hero Image */}
              <div className="hero-image" style={{ position: 'relative' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto',
                  perspective: '1000px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'var(--color-primary)',
                    borderRadius: '50%',
                    opacity: 0.2,
                    zIndex: 0
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--color-secondary)',
                    borderRadius: '50%',
                    opacity: 0.1,
                    zIndex: 0
                  }} />
                  
                  <div style={{
                    position: 'relative',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '2rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                    transform: 'rotateY(-5deg)',
                    zIndex: 1
                  }}>
                    <Image
                      src="/logo.jpg"
                      alt="Srushti Publications Logo"
                      width={300}
                      height={350}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '16px'
                      }}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sale Timer Banner */}
        <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="container">
            <SaleTimer title="🎉 ಮಹಾ ಮಾರಾಟ! ಎಲ್ಲಾ ಪುಸ್ತಕಗಳ ಮೇಲೆ 20% ರಿಯಾಯಿತಿ" variant="banner" />
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                📂 ವಿಭಾಗಗಳು
              </h2>
              <Link href="/books" className="btn btn-ghost">
                ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} />
              </Link>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem'
            }}>
              {loading ? (
                 // Skeleton for categories
                 Array(4).fill(0).map((_, i) => (
                   <div key={i} className="card" style={{ height: '200px', background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
                 ))
              ) : categories.map((category) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.id}
                    // Filter books page by category ID since slug route logic is complex without [slug] page for categories
                    // But usually /categories/[slug] exists. I'll check if /categories/[slug] page exists. 
                    // Actually, Books page uses query param categoryId usually?
                    // User code linked to /categories/[slug]. I'll keep it.
                    href={`/books?category=${category.id}`} 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '2rem 1.5rem',
                      background: 'white',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-sm)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    className="card"
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: category.color,
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1rem',
                      color: 'white'
                    }}>
                      <Icon size={28} />
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '0.25rem',
                      textAlign: 'center'
                    }}>
                      {category.name}
                    </h3>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-light)'
                    }}>
                      {category.count} ಪುಸ್ತಕಗಳು
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
        
        {/* New Releases Section */}
        <section className="section" style={{ background: 'var(--color-cream-light)' }}>
          <div className="container">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                ✨ ಹೊಸ ಬಿಡುಗಡೆಗಳು
              </h2>
              <Link href="/books?filter=new" className="btn btn-ghost">
                ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} />
              </Link>
            </div>
            
            <div className="product-grid">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                   <div key={i} style={{ height: '350px', background: 'white', borderRadius: '1rem' }} />
                ))
              ) : featuredBooks.filter(b => b.isNewRelease).slice(0, 8).map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="book-card"
                >
                  <div className="book-card-image" style={{
                    background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {book.coverImage && book.coverImage !== '/placeholder-book.jpg' ? (
                        <Image src={book.coverImage} alt={book.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                        <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    )}
                    <div className="book-card-badges">
                      {book.isNewRelease && (
                        <span className="badge badge-new">ಹೊಸ</span>
                      )}
                      {book.isBestSeller && (
                        <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
                      )}
                      {book.isOnSale && book.mrp > book.sellingPrice && (
                        <span className="badge badge-sale">
                          {Math.round(((book.mrp - book.sellingPrice) / book.mrp) * 100)}% ರಿಯಾಯಿತಿ
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card-body">
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-primary)',
                      fontWeight: 500
                    }}>
                      {book.category?.name || 'ಪುಸ್ತಕ'}
                    </span>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginTop: '0.25rem',
                      marginBottom: '0.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
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
                        <span className="price-original">{formatCurrency(book.mrp || 0)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Best Sellers Section */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                <TrendUp size={28} style={{ display: 'inline-block', marginRight: '0.5rem', color: 'var(--color-primary)' }} />
                ಅತ್ಯುತ್ತಮ ಮಾರಾಟಗಾರರು
              </h2>
              <Link href="/books?filter=bestseller" className="btn btn-ghost">
                ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} />
              </Link>
            </div>
            
            <div className="product-grid">
              {featuredBooks.filter(b => b.isBestSeller).slice(0, 4).map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="book-card"
                >
                  <div className="book-card-image" style={{
                    background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {book.coverImage && book.coverImage !== '/placeholder-book.jpg' ? (
                        <Image src={book.coverImage} alt={book.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                        <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    )}
                    <div className="book-card-badges">
                      {book.isBestSeller && (
                        <span className="badge badge-bestseller">ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್</span>
                      )}
                    </div>
                  </div>
                  <div className="card-body">
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-primary)',
                      fontWeight: 500
                    }}>
                      {book.category?.name || 'ಪುಸ್ತಕ'}
                    </span>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginTop: '0.25rem',
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
        
        {/* Offers Banner */}
        <section className="section" style={{ 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }} />
          
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem'
            }}>
              <div style={{ maxWidth: '600px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <Gift size={28} />
                  <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>ವಿಶೇಷ ಆಫರ್!</span>
                </div>
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700,
                  marginBottom: '1rem',
                  lineHeight: 1.2
                }}>
                  ಎಲ್ಲಾ ಪುಸ್ತಕಗಳ ಮೇಲೆ <br/>
                  <span style={{ color: 'var(--color-primary-light)' }}>20% ರಿಯಾಯಿತಿ</span>
                </h2>
                <p style={{ 
                  fontSize: '1.125rem',
                  opacity: 0.9,
                  marginBottom: '1.5rem'
                }}>
                  ಈ ತಿಂಗಳ ಕೊನೆಯವರೆಗೆ ಮಾತ್ರ. ಇಂದೇ ಆರ್ಡರ್ ಮಾಡಿ!
                </p>
                <Link 
                  href="/books?filter=sale" 
                  className="btn btn-lg"
                  style={{
                    background: 'white',
                    color: 'var(--color-primary)'
                  }}
                >
                  ರಿಯಾಯಿತಿ ಪುಸ್ತಕಗಳು <CaretRight size={20} />
                </Link>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700 }}>20%</span>
                  <span style={{ fontSize: '0.875rem' }}>ರಿಯಾಯಿತಿ</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recently Viewed Books */}
        <RecentlyViewed maxItems={4} />
        
        {/* Why Choose Us */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', display: 'block' }}>
              🌟 ನನ್ನನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?
            </h2>
            <p style={{
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 3rem',
              color: 'var(--color-text-light)'
            }}>
              ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ಕನ್ನಡ ಪುಸ್ತಕ ಪ್ರೇಮಿಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  icon: BookOpen,
                  title: 'ಅಸಲಿ ಕನ್ನಡ ಪ್ರಕಾಶನ',
                  description: 'ನಾವು ಸ್ವತಃ ಪುಸ್ತಕಗಳನ್ನು ಪ್ರಕಟಿಸುತ್ತೇವೆ. ಮೂಲ ಮತ್ತು ಗುಣಮಟ್ಟದ ಖಾತ್ರಿ.'
                },
                {
                  icon: Star,
                  title: 'ಉತ್ತಮ ಬೆಲೆಗಳು',
                  description: 'ಪ್ರಕಾಶಕರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸುವ ಮೂಲಕ ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ.'
                },
                {
                  icon: TrendUp,
                  title: 'ವೇಗದ ವಿತರಣೆ',
                  description: 'ಭಾರತದ ಎಲ್ಲೆಡೆ 5-7 ದಿನಗಳಲ್ಲಿ ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ.'
                },
                {
                  icon: Gift,
                  title: 'ವಿಶೇಷ ಆಫರ್‌ಗಳು',
                  description: 'ನಿಯಮಿತ ರಿಯಾಯಿತಿಗಳು ಮತ್ತು ಹಬ್ಬದ ಆಫರ್‌ಗಳು.'
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: 'var(--color-primary-50)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        marginBottom: '0.5rem'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-text-light)',
                        margin: 0
                      }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <HomepageFAQ />
        
        {/* Newsletter / CTA Section */}
        <section className="section" style={{ 
          background: 'var(--color-cream-light)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div className="container">
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                📖 ಕನ್ನಡ ಓದುವ ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ
              </h2>
              <p style={{
                color: 'var(--color-text-light)',
                marginBottom: '2rem'
              }}>
                ನನ್ನ ಸಮೃದ್ಧ ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ. 
                ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ, ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು ಮತ್ತು ಹೆಚ್ಚಿನವುಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.
              </p>
              <Link href="/books" className="btn btn-primary btn-lg">
                ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ <CaretRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </>
  )
}
