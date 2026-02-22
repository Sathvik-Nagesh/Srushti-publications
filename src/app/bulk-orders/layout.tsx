import type { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'Bulk Orders – Schools, Libraries & Bookstores | Srushti Publications',
  description:
    'Place bulk Kannada book orders for schools, colleges, libraries, and bookstores. Special discounts, free shipping across Karnataka, and GST billing available. Contact Srushti Publications.',
  alternates: {
    canonical: `${BASE_URL}/bulk-orders`,
  },
  openGraph: {
    title: 'Bulk Book Orders – Srushti Publications',
    description:
      'Special rates for schools, colleges, libraries, and bookstores. Bulk Kannada book orders with discounts, free shipping, and GST billing.',
    url: `${BASE_URL}/bulk-orders`,
  },
}

export default function BulkOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
