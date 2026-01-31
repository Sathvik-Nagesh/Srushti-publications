import Link from 'next/link'
import { WifiOff, RefreshCw, Home } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-cream-light) 0%, white 100%)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '400px' }}>
        {/* Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 2rem',
          background: 'var(--color-primary-50)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <WifiOff size={60} style={{ color: 'var(--color-primary)' }} />
        </div>
        
        {/* Title */}
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          color: 'var(--color-text)'
        }}>
          ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ
        </h1>
        
        {/* Description */}
        <p style={{ 
          color: 'var(--color-text-light)', 
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          ನಿಮ್ಮ ಸಾಧನವು ಇಂಟರ್ನೆಟ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ ಎಂದು ತೋರುತ್ತದೆ. 
          ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.
        </p>
        
        {/* Cached Content Notice */}
        <div style={{
          background: 'var(--color-cream)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-light)'
        }}>
          💡 ಕೆಲವು ಪುಟಗಳು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರಬಹುದು
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            <RefreshCw size={18} />
            ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ
          </button>
          
          <Link href="/" className="btn btn-outline">
            <Home size={18} />
            ಮುಖಪುಟ
          </Link>
        </div>
        
        {/* Tips */}
        <div style={{ marginTop: '3rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
            ಸಲಹೆಗಳು:
          </h3>
          <ul style={{ 
            color: 'var(--color-text-light)', 
            fontSize: '0.875rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>ನಿಮ್ಮ WiFi ಅಥವಾ ಮೊಬೈಲ್ ಡೇಟಾ ಆನ್ ಆಗಿದೆಯೇ ಪರಿಶೀಲಿಸಿ</li>
            <li style={{ marginBottom: '0.5rem' }}>ಏರೋಪ್ಲೇನ್ ಮೋಡ್ ಆಫ್ ಆಗಿದೆಯೇ ಪರಿಶೀಲಿಸಿ</li>
            <li style={{ marginBottom: '0.5rem' }}>ನಿಮ್ಮ ರೂಟರ್ ಅನ್ನು ಮರುಪ್ರಾರಂಭಿಸಿ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
