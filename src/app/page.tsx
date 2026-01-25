import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicHero from '@/components/DynamicHero'
import HomeCategories from '@/components/HomeCategories'
import HomeFeatures from '@/components/HomeFeatures'
import HomeOffers from '@/components/HomeOffers'
import BookCard from '@/components/BookCard'
import prisma from '@/lib/prisma'
import ScrollToTop from '@/components/ScrollToTop'
import RecentlyViewed from '@/components/RecentlyViewed'
import SaleTimer from '@/components/SaleTimer'
import HomepageFAQ from '@/components/HomepageFAQ'

// Enable ISR: Revalidate home page every hour (3600 seconds)
export const revalidate = 3600

async function getHomePageData() {
  const [categories, featuredBooks] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { books: true }
        }
      }
    }),
    prisma.book.findMany({
      where: { isActive: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
  ])

  // Process categories for client component
  // We pass slug matching logic to the client component or just pass data
  const processedCats = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    _count: cat._count
  }))

  return { categories: processedCats, featuredBooks }
}

export default async function HomePage() {
  const { categories, featuredBooks } = await getHomePageData()

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
              
              {/* Hero Image - kept as server rendered or basic HTML */}
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
                  
                  {/* We can use a simple img tag or Next Image here directly */}
                  {/* Using an inline style block for the card effect */}
                  <div 
                    style={{
                      position: 'relative',
                      background: 'white',
                      borderRadius: '24px',
                      padding: '2rem',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                      transform: 'rotateY(-5deg)',
                      zIndex: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'relative', width: '300px', height: '350px' }}>
                      <Image
                        src="/logo.jpg"
                        alt="Srushti Publications Logo"
                        fill
                        style={{
                          objectFit: 'contain',
                          borderRadius: '16px',
                        }}
                        priority
                      />
                    </div>
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
        <HomeCategories categories={categories} />
        
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
              <Link href="/books?filter=new" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ಎಲ್ಲಾ ನೋಡಿ <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="product-grid">
              {featuredBooks.filter(b => b.isNewRelease).slice(0, 8).map((book) => (
                <BookCard key={book.id} book={book} />
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
              <h2 className="section-title" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={28} style={{ color: 'var(--color-primary)' }} />
                ಅತ್ಯುತ್ತಮ ಮಾರಾಟಗಾರರು
              </h2>
              <Link href="/books?filter=bestseller" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ಎಲ್ಲಾ ನೋಡಿ <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="product-grid">
              {featuredBooks.filter(b => b.isBestSeller).slice(0, 4).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Offers Banner */}
        <HomeOffers />
        
        {/* Recently Viewed Books */}
        <RecentlyViewed maxItems={4} />
        
        {/* Why Choose Us */}
        <HomeFeatures />

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
              <Link href="/books" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ <ArrowRight size={20} />
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

