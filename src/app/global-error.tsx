'use client'

import { useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

/**
 * Global error handler - catches errors in root layout
 * This is the last line of defense for unhandled errors
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console and error reporting service
    console.error('Critical global error:', error)
    
    // Report to Sentry if configured
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: { severity: 'critical' }
      })
    }
  }, [error])

  return (
    <html>
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <AlertTriangle size={40} color="#dc2626" />
          </div>
          
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            ಗಂಭೀರ ದೋಷ
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            color: '#1f2937',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            Critical Error
          </p>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '2rem',
            fontSize: '0.9rem'
          }}>
            ಕ್ಷಮಿಸಿ, ಗಂಭೀರ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ಮರುಲೋಡ್ ಮಾಡಿ.
            <br />
            <span style={{ fontSize: '0.85rem' }}>
              A critical error occurred. Please reload the page.
            </span>
          </p>
          
          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <RefreshCw size={18} />
            ಮರುಲೋಡ್ ಮಾಡಿ (Reload)
          </button>
          
          {error.digest && (
            <p style={{ 
              marginTop: '1.5rem', 
              fontSize: '0.75rem', 
              color: '#9ca3af' 
            }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
