'use client'

import Link from 'next/link'
import { Books } from '@phosphor-icons/react'
import { siteConfig } from '@/config/site'

export default function DynamicHero() {
  const { hero, stats } = siteConfig

  return (
    <div className="hero-content">
      <span className="hero-tagline">
        {hero.tagline}
      </span>
      <h1 className="hero-title">
        <span style={{ display: 'block', fontSize: '0.5em', fontWeight: 500, opacity: 0.85, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
          Srushti Publications
        </span>
        {hero.title.includes('ಪಬ್ಲಿಕೇಷನ್ಸ್') ? (
          <>
            {hero.title.split('ಪಬ್ಲಿಕೇಷನ್ಸ್')[0]}
            <span>ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
          </>
        ) : (
          hero.title
        )}
      </h1>
      <p className="hero-description">
        {hero.description}
      </p>
      <p style={{ 
        fontSize: '0.95rem', 
        color: 'var(--color-text-light)', 
        marginTop: '-0.5rem',
        marginBottom: '0.5rem'
      }}>
        Buy Kannada books online — translated literature, educational books &amp; children&apos;s books. Free shipping on ₹500+
      </p>
      <div className="hero-actions">
        <Link href={hero.buttonLink} className="btn btn-primary btn-lg">
          <Books size={22} weight="bold" />
          {hero.buttonText}
        </Link>
        <Link href="/books?filter=new" className="btn btn-outline btn-lg">
          ಹೊಸ ಬಿಡುಗಡೆಗಳು
        </Link>
      </div>
      
      {/* Stats */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginTop: '3rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            {stats.books}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            ಪುಸ್ತಕಗಳು
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            {stats.authors}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            ಲೇಖಕರು
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            {stats.years}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
             ವರ್ಷಗಳ ಸೇವೆ
          </div>
        </div>
      </div>
    </div>
  )
}
