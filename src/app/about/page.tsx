import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { BookOpen, Users, Award, Heart, MapPin, Calendar, Target, Eye, Truck } from 'lucide-react'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'About Srushti Publications | ನಮ್ಮ ಬಗ್ಗೆ – Kannada Book Publisher',
  description:
    'Learn about Srushti Publications — a trusted Kannada book publisher since 2010. We publish 200+ Kannada translated literature, educational books, and children\'s books. Based in Bengaluru, serving readers across India.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: 'About Srushti Publications | Kannada Book Publisher Since 2010',
    description:
      'Srushti Publications publishes 200+ quality Kannada books — literature, educational, and children\'s books. Trusted publisher based in Bengaluru, Karnataka.',
    url: `${BASE_URL}/about`,
    images: [
      {
        url: `${BASE_URL}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'About Srushti Publications - Kannada Book Publisher',
      },
    ],
  },
}

// Breadcrumb JSON-LD
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: `${BASE_URL}/about`,
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)', padding: '4rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            {/* Breadcrumb navigation */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>/</span>
              <span style={{ color: 'var(--color-text)' }}>About</span>
            </nav>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>About Srushti Publications | ನಮ್ಮ ಬಗ್ಗೆ</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', maxWidth: '700px', margin: '0 auto' }}>
              Bringing Kannada literature and knowledge to every reader since 2010. We are a trusted Kannada book publisher based in Bengaluru, Karnataka.
            </p>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', maxWidth: '700px', margin: '1rem auto 0' }}>
              ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಜ್ಞಾನವನ್ನು ಎಲ್ಲರಿಗೂ ತಲುಪಿಸುವ ನಮ್ಮ ಪ್ರಯಾಣ
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem' }}>Our Story | ನಮ್ಮ ಕಥೆ</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.3 }}>The World of Kannada Translated Books | ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು</h2>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Srushti Publications was founded in 2010 with a deep love for the Kannada language and its rich literary heritage. Our mission has always been simple — to bring high-quality Kannada books to readers at affordable prices, across India.
                </p>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  ನಾನು ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ಅನ್ನು 2010 ರಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿದೆ, ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಸಾಹಿತ್ಯದ ಮೇಲಿನ ನನ್ನ ಪ್ರೀತಿಯಿಂದ. ನನ್ನ ಗುರಿ ಸರಳವಾಗಿತ್ತು - ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಕನ್ನಡ ಪುಸ್ತಕಗಳನ್ನು ಎಲ್ಲರಿಗೂ ಕೈಗೆಟುಕುವ ಬೆಲೆಯಲ್ಲಿ ತಲುಪಿಸುವುದು.
                </p>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  Today, with over 200 published books and 50+ acclaimed authors, we serve thousands of readers across Karnataka and India. Every book we publish carries our commitment to quality and passion for Kannada literature.
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', borderRadius: 'var(--radius-2xl)', padding: '3rem', color: 'white', textAlign: 'center' }}>
                <BookOpen size={60} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                <h3 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>14+</h3>
                <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Years of Publishing Excellence | ವರ್ಷಗಳ ಅನುಭವ</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: 'var(--color-bg-alt)', padding: '4rem 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {[
                { icon: BookOpen, value: '200+', label: 'Published Books | ಪ್ರಕಟಿತ ಪುಸ್ತಕಗಳು' },
                { icon: Users, value: '50+', label: 'Authors | ಲೇಖಕರು' },
                { icon: Award, value: '5000+', label: 'Happy Readers | ಸಂತೃಪ್ತ ಓದುಗರು' },
                { icon: MapPin, value: '500+', label: 'Cities Served | ನಗರಗಳಿಗೆ ವಿತರಣೆ' }
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Icon size={40} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{stat.value}</h3>
                    <p style={{ color: 'var(--color-text-light)', margin: 0 }}>{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why Kannada Books Matter */}
        <section className="section">
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Why Kannada Books Matter | ಕನ್ನಡ ಪುಸ್ತಕಗಳು ಏಕೆ ಮುಖ್ಯ
              </h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                Kannada is one of the oldest living languages in India with a rich literary tradition spanning over 2,000 years. 
                In a world dominated by English content, preserving and promoting Kannada literature ensures that future generations 
                stay connected to their cultural roots. At Srushti Publications, we believe every home in Karnataka should have 
                access to quality Kannada books.
              </p>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, fontSize: '1rem', marginTop: '1rem' }}>
                ಕನ್ನಡ ಭಾರತದ ಅತ್ಯಂತ ಹಳೆಯ ಜೀವಂತ ಭಾಷೆಗಳಲ್ಲಿ ಒಂದಾಗಿದ್ದು, 2,000 ವರ್ಷಗಳಿಗಿಂತ ಹೆಚ್ಚಿನ ಸಮೃದ್ಧ ಸಾಹಿತ್ಯ ಪರಂಪರೆಯನ್ನು ಹೊಂದಿದೆ. 
                ಪ್ರತಿ ಕರ್ನಾಟಕದ ಮನೆಯಲ್ಲಿ ಗುಣಮಟ್ಟದ ಕನ್ನಡ ಪುಸ್ತಕಗಳಿರಬೇಕು ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>🚚 Delivery Information | ವಿತರಣೆ ಮಾಹಿತಿ</h2>
              <p style={{ color: 'var(--color-text-light)' }}>Fast and reliable delivery across India | ಭಾರತದಾದ್ಯಂತ ತ್ವರಿತ ವಿತರಣೆ</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Truck size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Metro Cities | ಮೆಟ್ರೋ ನಗರಗಳು</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>2-3 Days</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>Bengaluru, Mumbai, Delhi, Chennai, Kolkata, Hyderabad</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Truck size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Other Locations | ಇತರ ಸ್ಥಳಗಳು</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>5-6 Days</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>Delivery to all PIN codes across India</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Award size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Free Shipping | ಉಚಿತ ಶಿಪ್ಪಿಂಗ್</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>₹500+</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>Free shipping on orders above ₹500</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section style={{ background: 'var(--color-bg-alt)', padding: '4rem 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Target size={28} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Our Mission | ನಮ್ಮ ಗುರಿ</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  To promote the Kannada language and culture by publishing quality books and providing readers with the best reading experience. 
                  ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಸಂಸ್ಕೃತಿಯನ್ನು ಉತ್ತೇಜಿಸುವುದು, ಗುಣಮಟ್ಟದ ಪುಸ್ತಕಗಳನ್ನು ಪ್ರಕಟಿಸುವುದು.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #8b5cf6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Eye size={28} style={{ color: '#8b5cf6' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Our Vision | ನಮ್ಮ ದೃಷ್ಟಿ</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  Every Kannadiga home should have Kannada books. Even in the digital age, preserving the importance of printed books. 
                  ಪ್ರತಿ ಕನ್ನಡಿಗನ ಮನೆಯಲ್ಲಿ ಕನ್ನಡ ಪುಸ್ತಕಗಳು ಇರಬೇಕು.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Heart size={28} style={{ color: '#10b981' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Our Values | ನಮ್ಮ ಮೌಲ್ಯಗಳು</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  Quality, authenticity, reader satisfaction, and commitment to Kannada literature — these are our core values. 
                  ಗುಣಮಟ್ಟ, ಪ್ರಾಮಾಣಿಕತೆ, ಓದುಗರ ತೃಪ್ತಿ, ಮತ್ತು ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಮೇಲಿನ ಬದ್ಧತೆ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Publisher Credibility */}
        <section className="section">
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Why Choose Srushti Publications? | ಏಕೆ ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್?
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>✅ Authentic Publisher</h3>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    We are an authorized publisher — all our books are 100% original and printed with premium quality materials. 
                    Every book is directly published by us, ensuring authenticity.
                  </p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>📦 Secure Packaging</h3>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Each book is carefully packed with bubble wrap and sturdy packaging to ensure it reaches you in perfect condition. 
                    Your satisfaction is our priority.
                  </p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>💰 Best Prices</h3>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    As a direct publisher, we offer the best prices without middlemen. Free shipping on orders above ₹500. 
                    Quality Kannada books at affordable prices.
                  </p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>🔒 Secure Payments</h3>
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    We use Razorpay for 100% secure payments. Accept UPI, Credit/Debit cards, Net Banking, and Cash on Delivery. 
                    SSL encrypted transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Start Your Kannada Reading Journey | ಕನ್ನಡ ಓದುವ ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Browse our collection of Kannada books and discover the world of Kannada literature.
            </p>
            <Link href="/books" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)' }}>
              <BookOpen size={20} /> Browse Books
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
