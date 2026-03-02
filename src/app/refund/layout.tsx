import { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Refund & Return Policy | ಮರುಪಾವತಿ ನೀತಿ',
  description: 'Srushti Publications refund and return policy. Return within 7 days for damaged or incorrect books. Refund processed in 5-7 business days.',
  alternates: {
    canonical: `${BASE_URL}/refund`,
  },
  openGraph: {
    title: 'Refund & Return Policy | Srushti Publications',
    description: 'Return within 7 days for damaged or incorrect books. Refund processed in 5-7 business days.',
    url: `${BASE_URL}/refund`,
    type: 'website',
  },
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
