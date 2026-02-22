import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { BookOpen, ChevronRight, Sparkles, GraduationCap, Baby, FileText, MoreHorizontal, MessageCircle, Star } from 'lucide-react'
import prisma from '@/lib/prisma'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Book Categories | ಪುಸ್ತಕ ವಿಭಾಗಗಳು – Srushti Publications',
  description:
    'Browse Kannada book categories at Srushti Publications — Literature, Educational, Children\'s Books, Exam Guides, and more. Find the perfect Kannada book for you.',
  alternates: {
    canonical: `${BASE_URL}/categories`,
  },
  openGraph: {
    title: 'Book Categories – Srushti Publications',
    description:
      'Explore Kannada book categories: Literature, Educational, Children\'s Books, Exam Guides. Browse by category to find your next read.',
    url: `${BASE_URL}/categories`,
  },
}

const iconMap: Record<string, any> = {
  'literature': Sparkles,
  'academic': GraduationCap,
  'children': Baby,
  'exam-guides': FileText,
  'others': MoreHorizontal,
  'history': BookOpen,
  'science': Star,
  'fiction': MessageCircle
}

const colorMap = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#6b7280', // Gray
  '#ef4444', // Red
  '#ec4899', // Pink
  '#06b6d4'  // Cyan
]

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { books: true }
      }
    }
  })

  return categories.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || `${cat.name} ವಿಭಾಗದ ಪುಸ್ತಕಗಳು`, // Fallback description
    bookCount: cat._count.books,
    icon: iconMap[cat.slug] || BookOpen,
    color: colorMap[index % colorMap.length]
  }))
}

export default async function CategoriesPage() {
  const categories = await getCategories()

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
          {categories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.id}
                    href={`/books?category=${cat.id}`}
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
                        <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-light)', marginBottom: '1rem', lineHeight: 1.5, minHeight: '3em' }}>
                          {cat.description}
                        </div>
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
          ) : (
             <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
               <p>ಯಾವುದೇ ವಿಭಾಗಗಳು ಲಭ್ಯವಿಲ್ಲ.</p>
             </div>
          )}

          {/* All Books Link */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/books" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} /> ಎಲ್ಲಾ ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
