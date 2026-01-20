export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 60,
            height: 60,
            border: '4px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }}
        />
        <p style={{ color: 'var(--color-text-light)' }}>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        className="skeleton"
        style={{
          aspectRatio: '3/4',
          width: '100%'
        }}
      />
      <div style={{ padding: '1.25rem' }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: 20, width: '100%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: 24, width: '50%' }} />
      </div>
    </div>
  )
}

export function SkeletonBookGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
