import type { Metadata } from 'next'

const BASE_URL = 'https://srushtipublications.com'

export const metadata: Metadata = {
  title: 'FAQ – Frequently Asked Questions | Srushti Publications',
  description:
    'Find answers to common questions about ordering, shipping, payments, returns, and Kannada books at Srushti Publications. ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು.',
  alternates: {
    canonical: `${BASE_URL}/faq`,
  },
  openGraph: {
    title: 'FAQ – Frequently Asked Questions | Srushti Publications',
    description:
      'Find answers to common questions about ordering, shipping, payments, returns, and Kannada books at Srushti Publications.',
    url: `${BASE_URL}/faq`,
  },
}

// FAQ structured data (FAQPage schema for rich results)
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I place an order at Srushti Publications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Select the book you want, click "Add to Cart", then go to the checkout page. Enter your address and payment details to complete the order.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods does Srushti Publications accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash on Delivery (COD). COD has an additional ₹40 charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does shipping take for Kannada books?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Karnataka: 3-5 days. Other states: 5-7 days. Remote areas may take an additional 2-3 days. Free shipping on orders above ₹500.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I return a book from Srushti Publications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can return damaged or incorrect books within 7 days of delivery. Refunds are processed within 5-7 business days after approval.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are all books from Srushti Publications authentic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We are an authorized publisher and all our books are 100% original. We primarily sell Kannada books — literature, educational, children\'s books, and exam guides.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Srushti Publications offer free shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, orders above ₹500 qualify for free shipping across India. Orders below ₹500 have a ₹50 shipping charge.',
      },
    },
  ],
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {children}
    </>
  )
}
