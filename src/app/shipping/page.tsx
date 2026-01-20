'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Truck, MapPin, Clock, Package, CheckCircle, AlertTriangle, Phone, Mail } from 'lucide-react'

export default function ShippingPage() {
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
            <Truck size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಶಿಪ್ಪಿಂಗ್ ಮಾಹಿತಿ
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Shipping Information</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            
            {/* Free Shipping Banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                🎉 ಕರ್ನಾಟಕದಲ್ಲಿ ₹500+ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್!
              </h2>
              <p style={{ opacity: 0.9, margin: 0 }}>ಇತರ ರಾಜ್ಯಗಳಲ್ಲಿ ₹1000+ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್</p>
            </div>

            {/* Shipping Charges */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} style={{ color: 'var(--color-primary)' }} />
                ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕಗಳು
              </h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-cream-light)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>ಪ್ರದೇಶ</th>
                      <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)' }}>ಆರ್ಡರ್ ಮೊತ್ತ</th>
                      <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)' }}>ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>ಕರ್ನಾಟಕ</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹500+</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-success)', fontWeight: 600 }}>ಉಚಿತ</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>ಕರ್ನಾಟಕ</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹500 ಕೆಳಗೆ</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹50</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>ಇತರ ರಾಜ್ಯಗಳು</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹1000+</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)', color: 'var(--color-success)', fontWeight: 600 }}>ಉಚಿತ</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>ಇತರ ರಾಜ್ಯಗಳು</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹1000 ಕೆಳಗೆ</td>
                      <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>₹80</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Time */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                ವಿತರಣಾ ಸಮಯ
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <MapPin size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>ಬೆಂಗಳೂರು</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>2-3 ದಿನ</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <MapPin size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>ಕರ್ನಾಟಕ (ಇತರ)</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>3-5 ದಿನ</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <MapPin size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>ದಕ್ಷಿಣ ಭಾರತ</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>5-7 ದಿನ</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <MapPin size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>ಉತ್ತರ/ಪೂರ್ವ ಭಾರತ</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>7-10 ದಿನ</p>
                </div>
              </div>
              
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                * ಕಾರ್ಯ ದಿನಗಳು (ಭಾನುವಾರ ಮತ್ತು ರಜಾದಿನಗಳನ್ನು ಹೊರತುಪಡಿಸಿ)
              </p>
            </div>

            {/* Delivery Process */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                📦 ವಿತರಣೆ ಪ್ರಕ್ರಿಯೆ
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { step: 1, title: 'ಆರ್ಡರ್ ದೃಢೀಕರಣ', desc: 'ಆರ್ಡರ್ ಮಾಡಿದ ಕೂಡಲೇ ಇಮೇಲ್ ದೃಢೀಕರಣ' },
                  { step: 2, title: 'ಪ್ಯಾಕಿಂಗ್', desc: 'ಪುಸ್ತಕಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತದೆ' },
                  { step: 3, title: 'ಶಿಪ್ಮೆಂಟ್', desc: 'ಕೊರಿಯರ್ ಪಾಲುದಾರರಿಗೆ ಹಸ್ತಾಂತರ' },
                  { step: 4, title: 'ಟ್ರ್ಯಾಕಿಂಗ್', desc: 'ಟ್ರ್ಯಾಕಿಂಗ್ ಲಿಂಕ್ ಇಮೇಲ್ ಮಾಡಲಾಗುತ್ತದೆ' },
                  { step: 5, title: 'ವಿತರಣೆ', desc: 'ನಿಮ್ಮ ಬಾಗಿಲಿಗೆ ಸುರಕ್ಷಿತ ವಿತರಣೆ' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, margin: 0 }}>{item.title}</h4>
                      <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '0.875rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div style={{ background: 'var(--color-warning)10', border: '1px solid var(--color-warning)30', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
                ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.9, color: 'var(--color-text-light)' }}>
                <li>ದೂರದ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ 2-3 ದಿನಗಳು ಬೇಕಾಗಬಹುದು</li>
                <li>ಹಬ್ಬಗಳ ಸಮಯದಲ್ಲಿ ವಿಳಂಬ ಆಗಬಹುದು</li>
                <li>ಆರ್ಡರ್ ಶಿಪ್ ಆದ ನಂತರ ವಿಳಾಸ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ</li>
                <li>ಕೊರಿಯರ್ ಪರಿಶೀಲನೆಯಿಲ್ಲದೆ ಪ್ಯಾಕೇಜ್ ಸ್ವೀಕರಿಸಬೇಡಿ</li>
              </ul>
            </div>

            {/* Contact for shipping queries */}
            <div style={{ background: 'var(--color-cream-light)', padding: '2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                ಶಿಪ್ಪಿಂಗ್ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳು?
              </h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+919845096668" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Phone size={18} /> +91 98450 96668
                </a>
                <a href="mailto:srushtinagesh@gmail.com" className="btn btn-outline" style={{ gap: '0.5rem' }}>
                  <Mail size={18} /> ಇಮೇಲ್ ಕಳುಹಿಸಿ
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
