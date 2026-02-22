import type { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Search Kannada Books | ಹುಡುಕಾಟ',
  description:
    'Search for Kannada books by title, author, or category at Srushti Publications. Find translated literature, educational books, and children\'s books.',
  alternates: {
    canonical: `${BASE_URL}/search`,
  },
  robots: {
    index: false, // Search results pages should not be indexed
    follow: true,
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
