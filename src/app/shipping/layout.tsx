import { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Shipping Information | ಶಿಪ್ಪಿಂಗ್ ಮಾಹಿತಿ',
  description: 'Srushti Publications shipping details - Free shipping on orders above ₹500 in Karnataka. Delivery in 2-7 business days across India.',
  alternates: {
    canonical: `${BASE_URL}/shipping`,
  },
  openGraph: {
    title: 'Shipping Information | Srushti Publications',
    description: 'Free shipping on orders above ₹500 in Karnataka. Fast delivery across India.',
    url: `${BASE_URL}/shipping`,
    type: 'website',
  },
}

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
