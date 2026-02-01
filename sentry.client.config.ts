import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions
    
    // Session Replay - only for production
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Environment
    environment: process.env.NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    
    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      'Failed to fetch',
      'NetworkError',
      'AbortError',
      'ChunkLoadError',
    ],
    
    // Don't send errors in development (optional)
    enabled: process.env.NODE_ENV === 'production',
    
    beforeSend(event) {
      // Don't send errors from bots/crawlers
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent
        if (/bot|crawler|spider|crawling/i.test(userAgent)) {
          return null
        }
      }
      return event
    },
  })
}
