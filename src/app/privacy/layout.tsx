import { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Privacy Policy | ಗೌಪ್ಯತಾ ನೀತಿ',
  description: 'Srushti Publications privacy policy. Learn how we collect, use, and protect your personal information. We never sell your data.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | Srushti Publications',
    description: 'How Srushti Publications collects, uses, and protects your personal information.',
    url: `${BASE_URL}/privacy`,
    type: 'website',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
