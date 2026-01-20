'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { BookOpen, ChevronRight, Sparkles, GraduationCap, Baby, FileText, MoreHorizontal } from 'lucide-react'

const categories = [
  { id: '1', name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature', description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಕೃತಿಗಳು - ಕಾದಂಬರಿ, ಕವನ, ನಾಟಕ', bookCount: 85, icon: Sparkles, color: '#8b5cf6' },
  { id: '2', name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic', description: 'ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳು - ಇತಿಹಾಸ, ವಿಜ್ಞಾನ, ಗಣಿತ', bookCount: 45, icon: GraduationCap, color: '#3b82f6' },
  { id: '3', name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children', description: 'ಮಕ್ಕಳಿಗಾಗಿ ಕಥೆಗಳು, ನೀತಿ ಕಥೆಗಳು', bookCount: 35, icon: Baby, color: '#f59e0b' },
  { id: '4', name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides', description: 'ಕೆಎಎಸ್, ಐಎಎಸ್, ಬ್ಯಾಂಕ್ ಪರೀಕ್ಷೆಗಳಿಗೆ', bookCount: 25, icon: FileText, color: '#10b981' },
  { id: '5', name: 'ಇತರೆ', nameEn: 'Others', slug: 'others', description: 'ಆತ್ಮಕಥೆ, ಪ್ರವಾಸ ಕಥನ, ಇತರೆ', bookCount: 10, icon: MoreHorizontal, color: '#6b7280' }
]

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Page Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)', padding: '3rem 0' }}>
          <div className="container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ color: 'var(--color-text)' }}>ವಿಭಾಗಗಳು</span>
            </nav>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>📂 ಪುಸ್ತಕ ವಿಭಾಗಗಳು</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem' }}>ನಿಮ್ಮ ಆಸಕ್ತಿಯ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ</p>
          </div>
        </div>

        <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  style={{
                    display: 'block', background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem',
                    boxShadow: 'var(--shadow-sm)', textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.3s ease', border: '2px solid transparent'
                  }}
                  className="category-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
                      background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Icon size={28} style={{ color: cat.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{cat.nameEn}</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-light)', marginBottom: '1rem', lineHeight: 1.5 }}>{cat.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          <BookOpen size={16} /> {cat.bookCount} ಪುಸ್ತಕಗಳು
                        </span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.875rem' }}>ನೋಡಿ →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* All Books Link */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/books" className="btn btn-primary btn-lg">
              <BookOpen size={20} /> ಎಲ್ಲಾ ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />

      <style jsx global>{`
        .category-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: var(--color-primary) !important;
        }
      `}</style>
    </>
  )
}
