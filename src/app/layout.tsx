import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import CookieConsent from '@/components/CookieConsent'
import WhatsAppButton from '@/components/WhatsAppButton'
import CompareWidget from '@/components/CompareWidget'
import SkipToContent from '@/components/SkipToContent'
import { ScreenReaderAnnouncer } from '@/components/AccessibilityUtils'
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper'
import { AuthProvider } from '@/contexts/AuthContext'
import { ServiceWorkerProvider } from '@/lib/hooks/useServiceWorker'
import { Noto_Sans_Kannada } from 'next/font/google'
import { siteConfig } from '@/config/site'

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['latin', 'kannada'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kannada',
  display: 'swap',
})

import './globals.css'

const BASE_URL = 'https://srushtipublications.com'

// ─── Structured Data: Organization ─────────────────────────────────────────
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Srushti Publications',
  alternateName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.jpg`,
    width: 512,
    height: 512,
  },
  description: 'Srushti Publications is a leading Kannada book publisher offering translated literature, educational books, and children\'s books online. Serving readers across India since 2010.',
  foundingDate: '2010',
  founder: {
    '@type': 'Person',
    name: 'Nagesh',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'kn'],
    },
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'kn'],
    }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '121, 13th Main Road, M.C. Layout',
    addressLocality: 'Vijayanagar, Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560040',
    addressCountry: 'IN',
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
  ].filter(Boolean),
}

// ─── Structured Data: LocalBusiness ─────────────────────────────────────────
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Srushti Publications',
  alternateName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  image: `${BASE_URL}/logo.jpg`,
  url: BASE_URL,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '121, 13th Main Road, M.C. Layout',
    addressLocality: 'Vijayanagar, Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560040',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '18:00',
  },
  priceRange: '₹',
  servesCuisine: undefined,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Kannada Books',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Translated Literature',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Educational Books',
      },
      {
        '@type': 'OfferCatalog',
        name: "Children's Books",
      }
    ]
  }
}

// ─── Structured Data: WebSite with SearchAction ─────────────────────────────
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Srushti Publications',
  alternateName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  url: BASE_URL,
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['kn', 'en'],
}

// ─── Structured Data: WebPage (homepage) ────────────────────────────────────
const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: 'Srushti Publications – Buy Kannada Books Online | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  description: 'Buy Kannada books online from Srushti Publications. Browse translated literature, educational books, children\'s books, and more. Free shipping on orders above ₹500. Trusted publisher since 2010.',
  isPartOf: {
    '@id': `${BASE_URL}/#website`,
  },
  about: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: ['kn', 'en'],
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Srushti Publications – Buy Kannada Books Online | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    template: '%s | Srushti Publications',
  },
  description:
    'Buy Kannada books online from Srushti Publications. Browse translated literature, educational books, children\'s books, and more. ಕನ್ನಡ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ. Free shipping on orders above ₹500.',
  keywords: [
    'Srushti Publications',
    'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    'Kannada books',
    'ಕನ್ನಡ ಪುಸ್ತಕಗಳು',
    'Kannada literature',
    'ಕನ್ನಡ ಸಾಹಿತ್ಯ',
    'buy Kannada books online',
    'Kannada translated books',
    'ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳು',
    'Kannada children books',
    'Kannada educational books',
    'Karnataka books',
    'srushtipublications',
  ],
  authors: [{ name: 'Srushti Publications', url: BASE_URL }],
  creator: 'Srushti Publications',
  publisher: 'Srushti Publications',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Srushti Publications – Buy Kannada Books Online | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    description:
      'Buy Kannada books online. Browse translated literature, educational, and children\'s books. ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು.',
    type: 'website',
    locale: 'kn_IN',
    siteName: 'Srushti Publications',
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'Srushti Publications - Kannada Books Online Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Srushti Publications – Buy Kannada Books Online',
    description:
      'ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ | Buy Kannada translated books, literature, and educational books online.',
    images: [`${BASE_URL}/logo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  category: 'Books & Literature',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className={notoSansKannada.variable}>
      <head>
        <link rel="icon" href="/logo.jpg" />
        <meta name="theme-color" content="#d97706" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect for Google Fonts (used by Next.js font optimization) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* WebSite structured data with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* WebPage structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
        {/* Accessibility: Skip to main content link */}
        <SkipToContent />
        
        <NextIntlClientProvider messages={messages}>
          <ScreenReaderAnnouncer>
            <Toaster
              position="bottom-right"
              containerStyle={{
                bottom: 80, // Above WhatsApp button
                right: 20,
                zIndex: 9999
              }}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#1f2937',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontFamily: 'var(--font-kannada)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <ServiceWorkerProvider>
              <AuthProvider>
                <ErrorBoundaryWrapper>
                  {children}
                </ErrorBoundaryWrapper>
              </AuthProvider>
            </ServiceWorkerProvider>
            
            {/* Global Components */}
            <CompareWidget />
            <WhatsAppButton />
            <CookieConsent />
          </ScreenReaderAnnouncer>
        </NextIntlClientProvider>
        
        {/* Vercel Analytics - Only active in production on Vercel */}
        <Analytics />
      </body>
    </html>
  )
}
