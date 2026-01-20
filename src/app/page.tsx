'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import RecentlyViewed from '@/components/RecentlyViewed'
import SaleTimer from '@/components/SaleTimer'
import DynamicHero from '@/components/DynamicHero'
import DynamicCategories from '@/components/DynamicCategories'
import HomepageFAQ from '@/components/HomepageFAQ'
import { Books, Star, TrendUp, Gift, CaretRight, Sparkle, BookOpen, GraduationCap, BookBookmark, Baby } from '@phosphor-icons/react'

// Mock data for initial display - will be replaced with API calls
const featuredBooks = [
  {
    id: '1',
    title: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು',
    slug: 'malegalli-madhumagalu',
    author: 'ಕುವೆಂಪು',
    coverImage: '/books/book1.jpg',
    mrp: 450,
    sellingPrice: 399,
    isNewRelease: true,
    isBestSeller: true,
    isOnSale: true,
    category: { name: 'ಸಾಹಿತ್ಯ' }
  },
  {
    id: '2',
    title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
    slug: 'karnataka-itihasa',
    author: 'ಡಾ. ಸೂರ್ಯನಾಥ ಕಾಮತ್',
    coverImage: '/books/book2.jpg',
    mrp: 550,
    sellingPrice: 495,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: false,
    category: { name: 'ಶೈಕ್ಷಣಿಕ' }
  },
  {
    id: '3',
    title: 'ಪಂಚತಂತ್ರ ಕಥೆಗಳು',
    slug: 'panchatantra-kathegalu',
    author: 'ವಿಷ್ಣುಶರ್ಮ',
    coverImage: '/books/book3.jpg',
    mrp: 199,
    sellingPrice: 149,
    isNewRelease: true,
    isBestSeller: false,
    isOnSale: true,
    category: { name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು' }
  },
  {
    id: '4',
    title: 'ಕೆಎಎಸ್ ಮಾರ್ಗದರ್ಶಿ',
    slug: 'kas-margadarshi',
    author: 'ಶ್ರೀಕಾಂತ್ ಎನ್',
    coverImage: '/books/book4.jpg',
    mrp: 799,
    sellingPrice: 699,
    isNewRelease: false,
    isBestSeller: true,
    isOnSale: true,
    category: { name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ' }
  }
]

const categories = [
  { 
    id: '1', 
    name: 'ಶೈಕ್ಷಣಿಕ', 
    nameEn: 'Academic', 
    slug: 'academic',  
    icon: GraduationCap,
    color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    count: 45
  },
  { 
    id: '2', 
    name: 'ಸಾಹಿತ್ಯ', 
    nameEn: 'Literature', 
    slug: 'literature',  
    icon: BookBookmark,
    color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    count: 65
  },
  { 
    id: '3', 
    name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', 
    nameEn: 'Children', 
    slug: 'children',  
    icon: Baby,
    color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    count: 40
  },
  { 
    id: '4', 
    name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', 
    nameEn: 'Exam Guides', 
    slug: 'exam-guides',  
    icon: BookOpen,
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    count: 30
  },
  { 
    id: '5', 
    name: 'ಇತರೆ', 
    nameEn: 'Others', 
    slug: 'others',  
    icon: Sparkle,
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    count: 20
  }
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('kn-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function HomePage() {
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
                  {/* Decorative elements */}
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
                  
                  {/* Main logo display */}
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
              <Link href="/categories" className="btn btn-ghost">
                ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} />
              </Link>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem'
            }}>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
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
              {featuredBooks.map((book) => (
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
                    <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
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
                      {book.category.name}
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
                        <span className="price-original">{formatCurrency(book.mrp)}</span>
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
              {featuredBooks.filter(b => b.isBestSeller).map((book) => (
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
                    <BookOpen size={60} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
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
                      {book.category.name}
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
