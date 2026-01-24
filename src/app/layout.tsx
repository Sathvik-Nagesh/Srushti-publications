import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import CookieConsent from '@/components/CookieConsent'
import WhatsAppButton from '@/components/WhatsAppButton'
import SocialProofPopup from '@/components/SocialProofPopup'
import SkipToContent from '@/components/SkipToContent'
import { ScreenReaderAnnouncer } from '@/components/AccessibilityUtils'
import { AuthProvider } from '@/contexts/AuthContext'
import { Noto_Sans_Kannada } from 'next/font/google'

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['latin', 'kannada'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kannada',
  display: 'swap',
})

import './globals.css'

export const metadata: Metadata = {
  title: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ | ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ',
  description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ. ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ - ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು.',
  keywords: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳು, kannada books, kannada literature, ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  authors: [{ name: 'Srushti Publications' }],
  openGraph: {
    title: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ | ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ',
    description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ.',
    type: 'website',
    locale: 'kn_IN',
    siteName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    description: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body>
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
            <AuthProvider>
              {children}
            </AuthProvider>
            
            {/* Global Components */}
            <WhatsAppButton />
            <CookieConsent />
            <SocialProofPopup />
          </ScreenReaderAnnouncer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
