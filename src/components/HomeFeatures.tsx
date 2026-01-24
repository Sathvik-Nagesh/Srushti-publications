'use client'

import { 
  BookOpen, Star, TrendUp, Gift 
} from '@phosphor-icons/react'

export default function HomeFeatures() {
  return (
    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', display: 'block' }}>
          🌟 ನನ್ನನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?
        </h2>
        <p style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 3rem',
          color: 'var(--color-text-light)'
        }}>
          ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ ಕನ್ನಡ ಪುಸ್ತಕ ಪ್ರೇಮಿಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              icon: BookOpen,
              title: 'ಅಸಲಿ ಕನ್ನಡ ಪ್ರಕಾಶನ',
              description: 'ನಾವು ಸ್ವತಃ ಪುಸ್ತಕಗಳನ್ನು ಪ್ರಕಟಿಸುತ್ತೇವೆ. ಮೂಲ ಮತ್ತು ಗುಣಮಟ್ಟದ ಖಾತ್ರಿ.'
            },
            {
              icon: Star,
              title: 'ಉತ್ತಮ ಬೆಲೆಗಳು',
              description: 'ಪ್ರಕಾಶಕರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸುವ ಮೂಲಕ ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ.'
            },
            {
              icon: TrendUp,
              title: 'ವೇಗದ ವಿತರಣೆ',
              description: 'ಭಾರತದ ಎಲ್ಲೆಡೆ 5-7 ದಿನಗಳಲ್ಲಿ ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ.'
            },
            {
              icon: Gift,
              title: 'ವಿಶೇಷ ಆಫರ್‌ಗಳು',
              description: 'ನಿಯಮಿತ ರಿಯಾಯಿತಿಗಳು ಮತ್ತು ಹಬ್ಬದ ಆಫರ್‌ಗಳು.'
            }
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-light)',
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
