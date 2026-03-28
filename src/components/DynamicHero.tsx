'use client'

import Link from 'next/link'
import { Books } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/config/site'

export default function DynamicHero() {
  const { stats } = siteConfig
  const tHero = useTranslations('hero')

  return (
    <div className="hero-content">
      <span className="hero-tagline">
        {tHero('tagline')}
      </span>
      <h1 className="hero-title">
        <span style={{ display: 'block', fontSize: '0.5em', fontWeight: 500, opacity: 0.85, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
          {tHero('title')}
        </span>
        {tHero('title').includes('ಪಬ್ಲಿಕೇಷನ್ಸ್') ? (
          <>
            {tHero('title').split('ಪಬ್ಲಿಕೇಷನ್ಸ್')[0]}
            <span>ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
          </>
        ) : (
          tHero('title')
        )}
      </h1>
      <p className="hero-description">
        {tHero('description')}
      </p>
      <div className="hero-actions">
        <Link href="/books" className="btn btn-primary btn-lg">
          <Books size={22} weight="bold" />
          {tHero('viewNewReleases')}
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
            {tHero('booksCount').split(' ')[0]}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            {tHero('booksCount').substring(tHero('booksCount').indexOf(' ') + 1)}
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            {tHero('authorsCount').split(' ')[0]}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
            {tHero('authorsCount').substring(tHero('authorsCount').indexOf(' ') + 1)}
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)' 
          }}>
            {tHero('customersCount').split(' ')[0]}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)' 
          }}>
             {tHero('customersCount').substring(tHero('customersCount').indexOf(' ') + 1)}
          </div>
        </div>
      </div>
    </div>
  )
}
