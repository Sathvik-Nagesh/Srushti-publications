'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Shield, Lock, Eye, FileText, Mail, Phone } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: '4rem 0 3rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <Shield size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಗೌಪ್ಯತಾ ನೀತಿ
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Privacy Policy</p>
          </div>
        </section>

        {/* Content */}
        <section className="section">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                ಕೊನೆಯ ನವೀಕರಣ: ಜನವರಿ 2024
              </p>

              {/* Introduction */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                  ಪರಿಚಯ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ನಲ್ಲಿ, ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ನಾವು ಗೌರವಿಸುತ್ತೇವೆ ಮತ್ತು ರಕ್ಷಿಸುತ್ತೇವೆ. 
                  ಈ ಗೌಪ್ಯತಾ ನೀತಿಯು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವಾಗ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ಹೇಗೆ 
                  ಸಂಗ್ರಹಿಸುತ್ತೇವೆ, ಬಳಸುತ್ತೇವೆ ಮತ್ತು ರಕ್ಷಿಸುತ್ತೇವೆ ಎಂಬುದನ್ನು ವಿವರಿಸುತ್ತದೆ.
                </p>
              </section>

              {/* Information We Collect */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} style={{ color: 'var(--color-primary)' }} />
                  ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                  ನಾವು ಈ ಕೆಳಗಿನ ರೀತಿಯ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಬಹುದು:
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li><strong>ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ:</strong> ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆ, ವಿತರಣಾ ವಿಳಾಸ</li>
                  <li><strong>ಪಾವತಿ ಮಾಹಿತಿ:</strong> ಬಿಲ್ಲಿಂಗ್ ವಿಳಾಸ (ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ನಾವು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ)</li>
                  <li><strong>ಆರ್ಡರ್ ಮಾಹಿತಿ:</strong> ಖರೀದಿ ಇತಿಹಾಸ, ಆರ್ಡರ್ ವಿವರಗಳು</li>
                  <li><strong>ತಾಂತ್ರಿಕ ಮಾಹಿತಿ:</strong> IP ವಿಳಾಸ, ಬ್ರೌಸರ್ ಪ್ರಕಾರ, ಸಾಧನ ಮಾಹಿತಿ</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ಮಾಹಿತಿಯ ಬಳಕೆ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                  ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ನಾವು ಈ ಕೆಳಗಿನ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಳಸುತ್ತೇವೆ:
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಮತ್ತು ವಿತರಿಸಲು</li>
                  <li>ಆರ್ಡರ್ ಸ್ಥಿತಿ ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಕಳುಹಿಸಲು</li>
                  <li>ಗ್ರಾಹಕ ಬೆಂಬಲ ಒದಗಿಸಲು</li>
                  <li>ನಮ್ಮ ಸೇವೆಗಳನ್ನು ಸುಧಾರಿಸಲು</li>
                  <li>ಕಾನೂನು ಅವಶ್ಯಕತೆಗಳನ್ನು ಪೂರೈಸಲು</li>
                </ul>
              </section>

              {/* Data Security */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} style={{ color: 'var(--color-primary)' }} />
                  ಡೇಟಾ ಭದ್ರತೆ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲು ನಾವು ಉದ್ಯಮ-ಮಾನಕ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತೇವೆ. 
                  ಎಲ್ಲಾ ಪಾವತಿಗಳು SSL ಎನ್‌ಕ್ರಿಪ್ಷನ್ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿವೆ ಮತ್ತು Razorpay ಮೂಲಕ 
                  ಸಂಸ್ಕರಿಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ನಾವು ಎಂದಿಗೂ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.
                </p>
              </section>

              {/* Cookies */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ಕುಕೀಸ್
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ನಿಮ್ಮ ಬ್ರೌಸಿಂಗ್ ಅನುಭವವನ್ನು ಸುಧಾರಿಸಲು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಕುಕೀಸ್ ಅನ್ನು ಬಳಸುತ್ತದೆ. 
                  ಕುಕೀಸ್ ನಿಮ್ಮ ಕಾರ್ಟ್, ಲಾಗಿನ್ ಸ್ಥಿತಿ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ. 
                  ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳ ಮೂಲಕ ನೀವು ಕುಕೀಸ್ ಅನ್ನು ನಿರ್ವಹಿಸಬಹುದು.
                </p>
              </section>

              {/* Third Party Sharing */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ಮೂರನೇ ವ್ಯಕ್ತಿಗಳೊಂದಿಗೆ ಹಂಚಿಕೆ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                  ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ನಾವು ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ. 
                  ಆದಾಗ್ಯೂ, ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳನ್ನು ವಿತರಿಸಲು ಶಿಪ್ಪಿಂಗ್ ಪಾಲುದಾರರೊಂದಿಗೆ ಮತ್ತು 
                  ಪಾವತಿಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು Razorpay ಜೊತೆ ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತೇವೆ.
                </p>
              </section>

              {/* Your Rights */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ನಿಮ್ಮ ಹಕ್ಕುಗಳು
                </h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li>ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಪ್ರವೇಶಿಸುವ ಹಕ್ಕು</li>
                  <li>ತಪ್ಪು ಮಾಹಿತಿಯನ್ನು ಸರಿಪಡಿಸುವ ಹಕ್ಕು</li>
                  <li>ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ವಿನಂತಿಸುವ ಹಕ್ಕು</li>
                  <li>ಮಾರ್ಕೆಟಿಂಗ್ ಸಂವಹನಗಳಿಂದ ಹೊರಗುಳಿಯುವ ಹಕ್ಕು</li>
                </ul>
              </section>

              {/* Contact */}
              <section style={{
                background: 'var(--color-cream-light)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginTop: '2rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ಸಂಪರ್ಕಿಸಿ
                </h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                  ಈ ಗೌಪ್ಯತಾ ನೀತಿಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                    <a href="mailto:srushtinagesh@gmail.com" style={{ color: 'var(--color-primary)' }}>
                      srushtinagesh@gmail.com
                    </a>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                    <a href="tel:+919845096668" style={{ color: 'var(--color-primary)' }}>
                      +91 98450 96668
                    </a>
                  </p>
                </div>
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
