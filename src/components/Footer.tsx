'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { siteConfig } from '@/config/site'

const socialIconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'var(--color-primary)',
  color: 'white',
  transition: 'transform 0.2s ease'
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div style={{ position: 'relative', height: '60px', marginBottom: '1rem' }}>
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                style={{ 
                  height: '100%', 
                  width: 'auto',
                  borderRadius: '8px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="footer-brand-text">
              {siteConfig.tagline}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {siteConfig.social.facebook && (
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconStyle}
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
              )}
              {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconStyle}
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
              )}
              {siteConfig.social.twitter && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconStyle}
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
              )}
              {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconStyle}
                    aria-label="YouTube"
                  >
                    <Youtube size={18} />
                  </a>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="footer-title">ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು</h3>
            <ul className="footer-links">
              {siteConfig.nav.footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories - Simplified for hardcoding, or can fetch dynamic if needed, but lets stick to config approach for now */}
          <div>
            <h3 className="footer-title">ವಿಭಾಗಗಳು</h3>
            <ul className="footer-links">
                <li><Link href="/categories/literature" className="footer-link">ಸಾಹಿತ್ಯ</Link></li>
                <li><Link href="/categories/kannada-books" className="footer-link">ಕನ್ನಡ ಪುಸ್ತಕಗಳು</Link></li>
                <li><Link href="/categories/children" className="footer-link">ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು</Link></li>
                <li><Link href="/categories/history" className="footer-link">ಇತಿಹಾಸ</Link></li>
                <li><Link href="/categories" className="footer-link" style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>
                  ಎಲ್ಲವನ್ನೂ ನೋಡಿ &rarr;
                </Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="footer-title">ಸಂಪರ್ಕಿಸಿ</h3>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g,'')}`} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.contact.mapLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link" 
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}
                >
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '4px' }} />
                  {siteConfig.contact.address}
                </a>
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
            © {currentYear} {siteConfig.name}. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {siteConfig.nav.footer.legal.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                    {link.name}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
