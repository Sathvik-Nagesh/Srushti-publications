import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Image
              src="/logo.jpg"
              alt="ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್"
              width={60}
              height={60}
              className="footer-brand-logo"
              style={{ borderRadius: '8px' }}
            />
            <p className="footer-brand-text">
              ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳ ಪ್ರಕಾಶಕರು. 
              ನನ್ನ ಗುರಿಯು ಕನ್ನಡ ಭಾಷೆಯ ಪ್ರಚಾರ ಮತ್ತು ಜ್ಞಾನ ಹಂಚಿಕೆ.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'white',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'white',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'white',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'white',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="footer-title">ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು</h3>
            <ul className="footer-links">
              <li><Link href="/books" className="footer-link">ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು</Link></li>
              <li><Link href="/books?filter=new" className="footer-link">ಹೊಸ ಬಿಡುಗಡೆಗಳು</Link></li>
              <li><Link href="/books?filter=bestseller" className="footer-link">ಅತ್ಯುತ್ತಮ ಮಾರಾಟಗಾರರು</Link></li>
              <li><Link href="/faq" className="footer-link">FAQ / ಸಹಾಯ</Link></li>
              <li><Link href="/shipping" className="footer-link">ಶಿಪ್ಪಿಂಗ್ ಮಾಹಿತಿ</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="footer-title">ವಿಭಾಗಗಳು</h3>
            <ul className="footer-links">
              <li><Link href="/categories/academic" className="footer-link">ಶೈಕ್ಷಣಿಕ</Link></li>
              <li><Link href="/categories/literature" className="footer-link">ಸಾಹಿತ್ಯ</Link></li>
              <li><Link href="/categories/children" className="footer-link">ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು</Link></li>
              <li><Link href="/categories/exam" className="footer-link">ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ</Link></li>
              <li><Link href="/categories/others" className="footer-link">ಇತರೆ</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="footer-title">ಸಂಪರ್ಕಿಸಿ</h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:srushtinagesh@gmail.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} />
                  srushtinagesh@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} />
                  +91 98450 96668
                </a>
              </li>
              <li>
                <span className="footer-link" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '4px' }} />
                  ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ, ಭಾರತ - 560001
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="trust-badge-content">
              <h4>ಸುರಕ್ಷಿತ ಪಾವತಿ</h4>
              <p>100% ಸುರಕ್ಷಿತ ಆನ್‌ಲೈನ್ ಪಾವತಿ</p>
            </div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className="trust-badge-content">
              <h4>ವೇಗದ ವಿತರಣೆ</h4>
              <p>ಭಾರತದಾದ್ಯಂತ 5-7 ದಿನಗಳಲ್ಲಿ</p>
            </div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div className="trust-badge-content">
              <h4>ಕನ್ನಡ ಪ್ರಕಾಶಕರು</h4>
              <p>ಅಸಲಿ ಕನ್ನಡ ಪುಸ್ತಕಗಳು</p>
            </div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="trust-badge-content">
              <h4>24/7 ಬೆಂಬಲ</h4>
              <p>ಸಹಾಯಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸಿ</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" className="footer-link">ಗೌಪ್ಯತಾ ನೀತಿ</Link>
            <Link href="/terms" className="footer-link">ನಿಯಮಗಳು</Link>
            <Link href="/refund" className="footer-link">ಮರುಪಾವತಿ ನೀತಿ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
