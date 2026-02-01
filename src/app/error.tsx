'use client'

import { useEffect } from 'react'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
    
    // Report to Sentry if configured
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error)
    }
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
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
          background: '#fef3c7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <AlertTriangle size={40} color="#d97706" />
        </div>
        
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          ಏನೋ ತಪ್ಪಾಗಿದೆ
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#1f2937',
          marginBottom: '0.5rem',
          fontWeight: 500
        }}>
          Something went wrong
        </p>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          ಕ್ಷಮಿಸಿ, ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.
          <br />
          <span style={{ fontSize: '0.85rem' }}>
            An unexpected error occurred. Please try again.
          </span>
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
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
            ಮರುಪ್ರಯತ್ನಿಸಿ
          </button>
          
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            <Home size={18} />
            ಮುಖಪುಟ
          </a>
        </div>
        
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
    </div>
  )
}
