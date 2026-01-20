'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { RefreshCw, Package, Clock, CheckCircle, XCircle, AlertTriangle, Mail, Phone } from 'lucide-react'

export default function RefundPolicyPage() {
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
            <RefreshCw size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಮರುಪಾವತಿ ನೀತಿ
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Refund & Return Policy</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
              
              {/* Return Window */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} style={{ color: 'var(--color-primary)' }} /> ರಿಟರ್ನ್ ಅವಧಿ
                </h2>
                <div style={{ background: 'var(--color-success)10', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-success)30' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-success)', margin: 0 }}>
                    ✓ ವಿತರಣೆಯಿಂದ 7 ದಿನಗಳ ಒಳಗೆ ರಿಟರ್ನ್ ಮಾಡಬಹುದು
                  </p>
                </div>
              </section>

              {/* Eligible Cases */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} style={{ color: 'var(--color-success)' }} /> ಮರುಪಾವತಿಗೆ ಅರ್ಹ ಸಂದರ್ಭಗಳು
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ದೋಷಪೂರಿತ ಪುಸ್ತಕಗಳು',
                    'ತಪ್ಪು ಪುಸ್ತಕ ವಿತರಿಸಲಾಗಿದೆ',
                    'ಪುಟಗಳು ಕಾಣೆಯಾಗಿವೆ ಅಥವಾ ಮುದ್ರಣ ದೋಷಗಳು',
                    'ಆರ್ಡರ್ ಮಾಡಿದ್ದಕ್ಕಿಂತ ಬೇರೆ ಐಟಂ ಬಂದಿದೆ'
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Non-Eligible Cases */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <XCircle size={20} style={{ color: 'var(--color-error)' }} /> ಮರುಪಾವತಿಗೆ ಅರ್ಹವಲ್ಲ
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'ಬಳಕೆದಾರರಿಂದ ಹಾನಿಗೊಳಗಾದ ಪುಸ್ತಕಗಳು',
                    'ಮನಸ್ಸು ಬದಲಾವಣೆ ಅಥವಾ ತಪ್ಪು ಆರ್ಡರ್',
                    '7 ದಿನಗಳ ನಂತರ ವಿನಂತಿ',
                    'ಮೂಲ ಪ್ಯಾಕೇಜಿಂಗ್ ಇಲ್ಲದ ಪುಸ್ತಕಗಳು'
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)' }}>
                      <XCircle size={16} style={{ color: 'var(--color-error)' }} /> {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Process */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={20} style={{ color: 'var(--color-primary)' }} /> ರಿಟರ್ನ್ ಪ್ರಕ್ರಿಯೆ
                </h2>
                <ol style={{ paddingLeft: '1.5rem', lineHeight: 2.2, color: 'var(--color-text-light)' }}>
                  <li><strong>ಸಂಪರ್ಕಿಸಿ:</strong> ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ</li>
                  <li><strong>ವಿವರಗಳು:</strong> ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಮತ್ತು ಸಮಸ್ಯೆಯ ಫೋಟೋ ಕಳುಹಿಸಿ</li>
                  <li><strong>ಅನುಮೋದನೆ:</strong> ನಾವು 24-48 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ</li>
                  <li><strong>ರಿಟರ್ನ್:</strong> ಪುಸ್ತಕವನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ</li>
                  <li><strong>ಮರುಪಾವತಿ:</strong> ಪುಸ್ತಕ ಸ್ವೀಕರಿಸಿದ 5-7 ದಿನಗಳಲ್ಲಿ</li>
                </ol>
              </section>

              {/* Refund Methods */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>ಮರುಪಾವತಿ ವಿಧಾನ</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: 'var(--color-text-light)' }}>
                  <li><strong>ಆನ್‌ಲೈನ್ ಪಾವತಿ:</strong> ಮೂಲ ಪಾವತಿ ವಿಧಾನಕ್ಕೆ ಮರುಪಾವತಿ</li>
                  <li><strong>COD:</strong> ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ವರ್ಗಾವಣೆ</li>
                </ul>
              </section>

              {/* Note */}
              <section style={{ background: 'var(--color-warning)10', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-warning)30', marginBottom: '2rem' }}>
                <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: 0, color: 'var(--color-text-light)' }}>
                  <AlertTriangle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                  <span>ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕವನ್ನು ಮರುಪಾವತಿಸಲಾಗುವುದಿಲ್ಲ, ಹಾನಿಗೊಳಗಾದ/ತಪ್ಪು ಐಟಂಗಳ ಸಂದರ್ಭದಲ್ಲಿ ಮಾತ್ರ.</span>
                </p>
              </section>

              {/* Contact */}
              <section style={{ background: 'var(--color-cream-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>ರಿಟರ್ನ್ ವಿನಂತಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                    <a href="mailto:returns@srushtipublication.com" style={{ color: 'var(--color-primary)' }}>returns@srushtipublication.com</a>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                    <a href="tel:+919876543210" style={{ color: 'var(--color-primary)' }}>+91 98765 43210</a>
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
