import { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Terms & Conditions | ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
  description: 'Terms and Conditions for Srushti Publications online bookstore. Read about our ordering, payment, delivery, and return policies.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  openGraph: {
    title: 'Terms & Conditions | Srushti Publications',
    description: 'Terms and Conditions for Srushti Publications online bookstore.',
    url: `${BASE_URL}/terms`,
    type: 'website',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
