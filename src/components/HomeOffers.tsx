'use client'

import Link from 'next/link'
import { Gift, CaretRight } from '@phosphor-icons/react'

export default function HomeOffers() {
  return (
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
  )
}
