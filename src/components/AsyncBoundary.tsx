'use client'

import { Suspense, ReactNode } from 'react'

interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
}

/**
 * Strategic Suspense Boundary wrapper
 * Per Vercel best practices: async-suspense-boundaries
 * 
 * Use this to wrap async components so the page shell renders immediately
 * while data loads. This improves perceived performance.
 * 
 * Impact: HIGH (faster initial paint)
 */
export function AsyncBoundary({ 
  children, 
  fallback,
  errorFallback 
}: AsyncBoundaryProps) {
  const defaultFallback = (
    <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

/**
 * Book Grid Suspense Boundary with skeleton
 */
export function BookGridSkeleton() {
  return (
    <div className="product-grid" style={{ gap: '1.5rem' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 20, borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton" style={{ height: 24, width: '40%', borderRadius: 'var(--radius-sm)' }} />
        </div>
      ))}
    </div>
  )
}

/**
 * Section Suspense Boundary 
 */
export function SectionSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="skeleton" style={{ 
      height, 
      borderRadius: 'var(--radius-xl)',
      width: '100%'
    }} />
  )
}

/**
 * Card List Skeleton
 */
export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ 
          height: 80, 
          borderRadius: 'var(--radius-lg)' 
        }} />
      ))}
    </div>
  )
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ 
          height: 56, 
          borderRadius: 'var(--radius-md)' 
        }} />
      ))}
    </div>
  )
}
