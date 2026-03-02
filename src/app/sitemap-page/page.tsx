import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Site Map & Overview | Srushti Publications',
  description: 'Complete overview of Srushti Publications — Bengaluru\'s premier Kannada book publisher. Browse all categories, featured books, and learn about our Kannada translations of international bestsellers.',
  alternates: {
    canonical: `${BASE_URL}/sitemap-page`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function SitemapPage() {
  // Fetch categories and books server-side for crawlers
  let categories: { id: string; name: string; slug: string }[] = []
  let featuredBooks: { id: string; title: string; slug: string; author: string; sellingPrice: number }[] = []

  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    })
    featuredBooks = await prisma.book.findMany({
      where: { isActive: true },
      select: { id: true, title: true, slug: true, author: true, sellingPrice: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
  } catch (e) {
    console.error('Sitemap page DB error:', e)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ marginBottom: '3rem', borderBottom: '2px solid #d97706', paddingBottom: '2rem' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
          <img src="/logo.jpg" alt="Srushti Publications Logo" width={80} height={80} style={{ borderRadius: 8 }} />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1f2937' }}>
          Srushti Publications — ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4b5563', margin: 0, lineHeight: 1.7 }}>
          Bengaluru&apos;s leading Kannada publishing house specializing in translating world-renowned 
          international books into Kannada. We bring global bestsellers, acclaimed novels, and influential 
          non-fiction to Kannada readers — in their language.
        </p>
      </header>

      {/* About */}
      <section style={{ marginBottom: '3rem' }} aria-labelledby="about-heading">
        <h2 id="about-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706', marginBottom: '1rem' }}>
          About Us
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Founded', value: '2010' },
            { label: 'Specialization', value: 'Kannada Translations of International Books' },
            { label: 'Location', value: 'Vijayanagar, Bengaluru, Karnataka, India' },
            { label: 'Phone', value: '+91 98450 96668' },
            { label: 'Email', value: 'Use contact form' },
            { label: 'Languages', value: 'Kannada (ಕನ್ನಡ) & English' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fef3c7', padding: '1rem', borderRadius: 8, borderLeft: '4px solid #d97706' }}>
              <p style={{ fontSize: '0.75rem', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem', fontWeight: 600 }}>{label}</p>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Site Navigation */}
      <section style={{ marginBottom: '3rem' }} aria-labelledby="nav-heading">
        <h2 id="nav-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706', marginBottom: '1rem' }}>
          Site Navigation
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { href: '/', label: 'Homepage', desc: 'Featured books & new releases' },
            { href: '/books', label: 'All Books', desc: 'Complete Kannada book catalog' },
            { href: '/categories', label: 'Categories', desc: 'Browse by genre' },
            { href: '/about', label: 'About Us', desc: 'Our story and mission' },
            { href: '/contact', label: 'Contact Us', desc: 'Get in touch' },
            { href: '/faq', label: 'FAQ', desc: 'Common questions answered' },
            { href: '/shipping', label: 'Shipping Info', desc: 'Delivery times and charges' },
            { href: '/refund', label: 'Refund Policy', desc: 'Returns and refunds' },
            { href: '/privacy', label: 'Privacy Policy', desc: 'Data and privacy practices' },
            { href: '/terms', label: 'Terms & Conditions', desc: 'Legal terms of service' },
            { href: '/track-order', label: 'Track Order', desc: 'Check delivery status' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block', padding: '1rem',
                border: '1px solid #e5e7eb', borderRadius: 8,
                textDecoration: 'none', color: '#1f2937',
                transition: 'border-color 0.2s',
              }}
            >
              <span style={{ display: 'block', fontWeight: 600, color: '#d97706', marginBottom: '0.25rem' }}>{label}</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '3rem' }} aria-labelledby="categories-heading">
          <h2 id="categories-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706', marginBottom: '1rem' }}>
            Book Categories
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: 999,
                    color: '#92400e',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Books */}
      {featuredBooks.length > 0 && (
        <section style={{ marginBottom: '3rem' }} aria-labelledby="books-heading">
          <h2 id="books-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706', marginBottom: '1rem' }}>
            Recent Books ({featuredBooks.length}+ in catalog)
          </h2>
          <div style={{ columns: '2 300px', gap: '0.5rem' }}>
            {featuredBooks.map((book) => (
              <div key={book.id} style={{ breakInside: 'avoid', marginBottom: '0.5rem' }}>
                <Link
                  href={`/books/${book.slug}`}
                  style={{ color: '#1d4ed8', textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  {book.title}
                </Link>
                <span style={{ color: '#6b7280', fontSize: '0.8rem' }}> — {book.author} (₹{book.sellingPrice})</span>
              </div>
            ))}
          </div>
          <Link href="/books" style={{ display: 'inline-block', marginTop: '1rem', color: '#d97706', fontWeight: 600 }}>
            View all books →
          </Link>
        </section>
      )}

      {/* Key Selling Points */}
      <section style={{ marginBottom: '3rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '2rem' }} aria-labelledby="features-heading">
        <h2 id="features-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534', marginBottom: '1rem' }}>
          Why Buy From Srushti Publications?
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
          {[
            '🌍 World-renowned international books translated into Kannada',
            '📚 Only Srushti Publications originals — no 3rd party books',
            '🚚 Free shipping on orders above ₹500 in Karnataka',
            '💳 Secure payment via Razorpay — UPI, Cards, Net Banking, COD',
            '⭐ Premium quality printing and expert Kannada translations',
            '📦 Fast delivery — 2-3 days in Bengaluru, pan-India shipping',
            '↩️ 7-day return window for damaged or incorrect books',
          ].map((point) => (
            <li key={point} style={{ color: '#166534', fontWeight: 500 }}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Structured data for crawlers */}
      <footer style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>© {new Date().getFullYear()} Srushti Publications. All rights reserved.</p>
        <p>121, 13th Main Rd, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040 | +91 98450 96668</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link href="/sitemap.xml" style={{ color: '#d97706' }}>sitemap.xml</Link>
          {' · '}
          <Link href="/robots.txt" style={{ color: '#d97706' }}>robots.txt</Link>
          {' · '}
          <Link href="/llms.txt" style={{ color: '#d97706' }}>llms.txt</Link>
        </p>
      </footer>
    </div>
  )
}
