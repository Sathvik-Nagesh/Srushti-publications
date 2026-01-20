import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { BookOpen, Users, Award, Heart, MapPin, Calendar, Target, Eye, Truck } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)', padding: '4rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>ನನ್ನ ಬಗ್ಗೆ</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', maxWidth: '700px', margin: '0 auto' }}>
              ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಜ್ಞಾನವನ್ನು ಎಲ್ಲರಿಗೂ ತಲುಪಿಸುವ ನನ್ನ ಪ್ರಯಾಣ
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem' }}>ನನ್ನ ಕಥೆ</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.3 }}>ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು</h2>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  ನಾನು ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ಅನ್ನು 2010 ರಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿದೆ, ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಸಾಹಿತ್ಯದ ಮೇಲಿನ ನನ್ನ ಪ್ರೀತಿಯಿಂದ. ನನ್ನ ಗುರಿ ಸರಳವಾಗಿತ್ತು - ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಕನ್ನಡ ಪುಸ್ತಕಗಳನ್ನು ಎಲ್ಲರಿಗೂ ಕೈಗೆಟುಕುವ ಬೆಲೆಯಲ್ಲಿ ತಲುಪಿಸುವುದು.
                </p>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  ಇಂದು, 200+ ಪುಸ್ತಕಗಳನ್ನು ಪ್ರಕಟಿಸಿ, ನಾನು ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸಾವಿರಾರು ಓದುಗರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದ್ದೇನೆ. ಪ್ರತಿಯೊಂದು ಪುಸ್ತಕವೂ ನನ್ನ ಪ್ರೀತಿ ಮತ್ತು ಶ್ರದ್ಧೆಯ ಫಲ.
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', borderRadius: 'var(--radius-2xl)', padding: '3rem', color: 'white', textAlign: 'center' }}>
                <BookOpen size={60} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                <h3 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>14+</h3>
                <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>ವರ್ಷಗಳ ಅನುಭವ</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: 'var(--color-bg-alt)', padding: '4rem 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {[
                { icon: BookOpen, value: '200+', label: 'ಪ್ರಕಟಿತ ಪುಸ್ತಕಗಳು' },
                { icon: Users, value: '50+', label: 'ಲೇಖಕರು' },
                { icon: Award, value: '5000+', label: 'ಸಂತೃಪ್ತ ಓದುಗರು' },
                { icon: MapPin, value: '500+', label: 'ನಗರಗಳಿಗೆ ವಿತರಣೆ' }
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

        {/* Delivery Info */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>🚚 ವಿತರಣೆ ಮಾಹಿತಿ</h2>
              <p style={{ color: 'var(--color-text-light)' }}>ನಾನು ಭಾರತದಾದ್ಯಂತ ತ್ವರಿತ ವಿತರಣೆ ಒದಗಿಸುತ್ತೇನೆ</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Truck size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>ಮೆಟ್ರೋ ನಗರಗಳು</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>2-3 ದಿನಗಳು</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>ಬೆಂಗಳೂರು, ಮುಂಬೈ, ದೆಹಲಿ, ಚೆನ್ನೈ, ಕೋಲ್ಕತಾ, ಹೈದರಾಬಾದ್</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Truck size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>ಇತರ ಸ್ಥಳಗಳು</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>5-6 ದಿನಗಳು</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>ಭಾರತದ ಎಲ್ಲಾ ಪಿನ್‌ಕೋಡ್‌ಗಳಿಗೆ ವಿತರಣೆ</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                <Award size={36} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>ಉಚಿತ ಶಿಪ್ಪಿಂಗ್</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>₹500+</p>
                <p style={{ opacity: 0.9, fontSize: '0.875rem', margin: 0 }}>₹500 ಮೇಲಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್</p>
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
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ನನ್ನ ಗುರಿ</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಸಂಸ್ಕೃತಿಯನ್ನು ಉತ್ತೇಜಿಸುವುದು, ಗುಣಮಟ್ಟದ ಪುಸ್ತಕಗಳನ್ನು ಪ್ರಕಟಿಸುವುದು, ಮತ್ತು ಓದುಗರಿಗೆ ಅತ್ಯುತ್ತಮ ಓದುವ ಅನುಭವವನ್ನು ನೀಡುವುದು.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #8b5cf6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Eye size={28} style={{ color: '#8b5cf6' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ನನ್ನ ದೃಷ್ಟಿ</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  ಪ್ರತಿ ಕನ್ನಡಿಗನ ಮನೆಯಲ್ಲಿ ಕನ್ನಡ ಪುಸ್ತಕಗಳು ಇರಬೇಕು. ಡಿಜಿಟಲ್ ಯುಗದಲ್ಲಿಯೂ ಮುದ್ರಿತ ಪುಸ್ತಕಗಳ ಮಹತ್ವವನ್ನು ಉಳಿಸಿಕೊಳ್ಳುವುದು.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Heart size={28} style={{ color: '#10b981' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ನನ್ನ ಮೌಲ್ಯಗಳು</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                  ಗುಣಮಟ್ಟ, ಪ್ರಾಮಾಣಿಕತೆ, ಓದುಗರ ತೃಪ್ತಿ, ಮತ್ತು ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಮೇಲಿನ ಬದ್ಧತೆ - ಇವು ನನ್ನ ಮೂಲ ಮೌಲ್ಯಗಳು.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>ನನ್ನೊಂದಿಗೆ ಪ್ರಯಾಣ ಮಾಡಿ</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              ನನ್ನ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಜಗತ್ತಿಗೆ ಕಾಲಿಡಿ
            </p>
            <Link href="/books" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)' }}>
              <BookOpen size={20} /> ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
