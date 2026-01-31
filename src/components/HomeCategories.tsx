'use client'

import Link from 'next/link'
import { ElementType } from 'react'
import { 
  BookBookmark, GraduationCap, Baby, BookOpen, Sparkle,
  CaretRight 
} from '@phosphor-icons/react'

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    books: number
  }
}

const iconMap: Record<string, ElementType> = {
  'literature': BookBookmark,
  'academic': GraduationCap,
  'children': Baby,
  'exam-guides': BookOpen,
  'others': Sparkle
}

const colorMap = [
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', // Purple
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Pink
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'  // Orange
]

export default function HomeCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            📂 ವಿಭಾಗಗಳು
          </h2>
          <Link href="/books" className="btn btn-ghost">
            ಎಲ್ಲಾ ನೋಡಿ <CaretRight size={18} />
          </Link>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.map((category, index) => {
            const Icon = iconMap[category.slug] || Sparkle
            return (
              <Link
                key={category.id}
                href={`/books?category=${category.id}`} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '2rem 1.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-sm)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="card"
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colorMap[index % colorMap.length],
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1rem',
                  color: 'white'
                }}>
                  <Icon size={28} />
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  {category.name}
                </h3>
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-light)'
                }}>
                  {category._count?.books || 0} ಪುಸ್ತಕಗಳು
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
