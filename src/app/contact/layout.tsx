import type { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Contact Srushti Publications | ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
  description:
    'Contact Srushti Publications for book orders, bulk orders, partnerships, or queries. Call +91 98450 96668 or email srushtinagesh@gmail.com. Located in Vijayanagar, Bengaluru, Karnataka.',
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Srushti Publications – Kannada Book Publisher',
    description:
      'Reach Srushti Publications for Kannada book orders, bulk orders, partnerships, or any queries. Phone: +91 98450 96668. Email: srushtinagesh@gmail.com.',
    url: `${BASE_URL}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
