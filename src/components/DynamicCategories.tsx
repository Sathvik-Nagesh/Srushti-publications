'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { GraduationCap, Books, Baby, BookOpen, Sparkle, CaretRight } from '@phosphor-icons/react'

// This would normally come from an API
const allBooks = [
  { id: '1', categorySlug: 'literature' },
  { id: '2', categorySlug: 'academic' },
  { id: '3', categorySlug: 'children' },
  { id: '4', categorySlug: 'exam-guides' },
  { id: '5', categorySlug: 'literature' },
  { id: '6', categorySlug: 'academic' },
  { id: '7', categorySlug: 'literature' },
  { id: '8', categorySlug: 'children' },
  // Add more mock books...
]

const categories = [
  { 
    id: '1', 
    name: 'ಶೈಕ್ಷಣಿಕ', 
    nameEn: 'Academic', 
    slug: 'academic',  
    Icon: GraduationCap,
    color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  { 
    id: '2', 
    name: 'ಸಾಹಿತ್ಯ', 
    nameEn: 'Literature', 
    slug: 'literature',  
    Icon: Books,
    color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  },
  { 
    id: '3', 
    name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', 
    nameEn: 'Children', 
    slug: 'children',  
    Icon: Baby,
    color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
  },
  { 
    id: '4', 
    name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', 
    nameEn: 'Exam Guides', 
    slug: 'exam-guides',  
    Icon: BookOpen,
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  { 
    id: '5', 
    name: 'ಇತರೆ', 
    nameEn: 'Others', 
    slug: 'others',  
    Icon: Sparkle,
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  }
]

// Calculate book count per category dynamically
function getBookCount(slug: string): number {
  return allBooks.filter(book => book.categorySlug === slug).length
}

export default function DynamicCategories() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="section">
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>ವಿಭಾಗಗಳು</h2>
          <Link 
            href="/categories" 
            className="btn btn-ghost"
            style={{ gap: '0.25rem' }}
          >
            ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} weight="bold" />
          </Link>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {categories.map((cat) => {
            const Icon = cat.Icon
            const count = mounted ? getBookCount(cat.slug) : 0
            
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                className="category-card-hover"
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={28} weight="bold" style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    marginBottom: '0.25rem' 
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--color-text-muted)', 
                    margin: 0 
                  }}>
                    {count > 0 ? `${count} ಪುಸ್ತಕಗಳು` : cat.nameEn}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
