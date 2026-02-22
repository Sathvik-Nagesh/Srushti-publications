import type { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Buy Kannada Books Online | ಪುಸ್ತಕಗಳು – Srushti Publications',
  description:
    'Browse and buy Kannada books online from Srushti Publications. Explore translated literature, educational books, children\'s books, bestsellers, and new releases. Free shipping on ₹500+.',
  alternates: {
    canonical: `${BASE_URL}/books`,
  },
  openGraph: {
    title: 'Buy Kannada Books Online – Srushti Publications',
    description:
      'Explore our collection of 200+ Kannada books. Literature, educational, children\'s books and more. Free shipping on orders above ₹500.',
    url: `${BASE_URL}/books`,
    images: [
      {
        url: `${BASE_URL}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'Srushti Publications - Kannada Books Collection',
      },
    ],
  },
}

// Breadcrumb structured data
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Books',
      item: `${BASE_URL}/books`,
    },
  ],
}

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}
