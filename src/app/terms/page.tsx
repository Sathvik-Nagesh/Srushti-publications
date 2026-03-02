'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Scale, ShoppingBag, CreditCard, Truck, Ban } from 'lucide-react'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <section style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: '4rem 0 3rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <Scale size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Terms & Conditions</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>ಕೊನೆಯ ನವೀಕರಣ: ಮಾರ್ಚ್ 2026</p>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>ಒಪ್ಪಂದದ ಸ್ವೀಕಾರ</h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಮೂಲಕ, ನೀವು ಈ ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೀರಿ.
                </p>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} /> ಉತ್ಪನ್ನಗಳು
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು ಲಭ್ಯತೆಗೆ ಒಳಪಟ್ಟಿವೆ</li>
                  <li>ಬೆಲೆಗಳು ಬದಲಾವಣೆಗೆ ಒಳಪಟ್ಟಿವೆ ಮತ್ತು GST ಸೇರಿಸಲಾಗಿದೆ</li>
                  <li>ನಾವು ಯಾವುದೇ ಆರ್ಡರ್ ಅನ್ನು ನಿರಾಕರಿಸುವ ಹಕ್ಕನ್ನು ಕಾಯ್ದಿರಿಸಿಕೊಂಡಿದ್ದೇವೆ</li>
                </ul>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} style={{ color: 'var(--color-primary)' }} /> ಪಾವತಿ
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>UPI, ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು COD ಸ್ವೀಕರಿಸುತ್ತೇವೆ</li>
                  <li>ಎಲ್ಲಾ ಪಾವತಿಗಳು ಭಾರತೀಯ ರೂಪಾಯಿಗಳಲ್ಲಿ (INR)</li>
                  <li>ಪಾವತಿ ಸುರಕ್ಷತೆಗಾಗಿ Razorpay ಬಳಸಲಾಗುತ್ತದೆ</li>
                </ul>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} style={{ color: 'var(--color-primary)' }} /> ವಿತರಣೆ
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>ಕರ್ನಾಟಕದಲ್ಲಿ ₹500 ಮೇಲಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್</li>
                  <li>ಸಾಮಾನ್ಯ ವಿತರಣಾ ಸಮಯ: 3-7 ಕಾರ್ಯ ದಿನಗಳು</li>
                </ul>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ban size={20} style={{ color: 'var(--color-error)' }} /> ನಿಷೇಧಿತ ಬಳಕೆಗಳು
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>ವೆಬ್‌ಸೈಟ್‌ನ ಅನಧಿಕೃತ ಬಳಕೆ ನಿಷೇಧಿಸಲಾಗಿದೆ</li>
                  <li>ತಪ್ಪು ಮಾಹಿತಿ ಒದಗಿಸುವುದು ನಿಷೇಧಿಸಲಾಗಿದೆ</li>
                  <li>ನಮ್ಮ ವಿಷಯವನ್ನು ಅನುಮತಿಯಿಲ್ಲದೆ ಪುನರುತ್ಪಾದಿಸುವುದು ನಿಷೇಧಿಸಲಾಗಿದೆ</li>
                </ul>
              </section>

              <section style={{ background: 'var(--color-cream-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>ಆಡಳಿತ ಕಾನೂನು</h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ಈ ನಿಯಮಗಳು ಭಾರತದ ಕಾನೂನುಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲ್ಪಡುತ್ತವೆ. ವಿವಾದಗಳು ಬೆಂಗಳೂರು ನ್ಯಾಯಾಲಯಗಳ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಡುತ್ತವೆ.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
