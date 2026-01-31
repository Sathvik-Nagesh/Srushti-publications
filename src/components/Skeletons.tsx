'use client'

import { useEffect, useState } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

// Base Skeleton with shimmer animation
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {}
}: SkeletonProps) {
  return (
    <div 
      className={`skeleton-shimmer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
    />
  )
}

// Book Card Skeleton
export function BookCardSkeleton() {
  return (
    <div 
      className="book-card"
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Image Skeleton */}
      <div style={{ aspectRatio: '0.75', position: 'relative' }}>
        <Skeleton height="100%" borderRadius="0" />
      </div>
      
      {/* Content Skeleton */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Category */}
        <Skeleton width="60px" height="14px" />
        
        {/* Title */}
        <Skeleton width="100%" height="20px" />
        <Skeleton width="80%" height="20px" />
        
        {/* Author */}
        <Skeleton width="50%" height="16px" style={{ marginTop: '0.25rem' }} />
        
        {/* Price */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Skeleton width="80px" height="24px" />
          <Skeleton width="60px" height="18px" />
        </div>
      </div>
    </div>
  )
}

// Books Grid Skeleton (multiple cards)
export function BooksGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <BookCardSkeleton key={idx} />
      ))}
    </div>
  )
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      padding: '1.5rem'
    }}>
      <Skeleton width="60px" height="60px" borderRadius="50%" style={{ margin: '0 auto' }} />
      <Skeleton width="80%" height="20px" style={{ margin: '1rem auto 0.5rem' }} />
      <Skeleton width="50%" height="16px" style={{ margin: '0 auto' }} />
    </div>
  )
}

// Filter Sidebar Skeleton
export function FilterSidebarSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category Filter */}
      <div>
        <Skeleton width="100px" height="20px" style={{ marginBottom: '1rem' }} />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Skeleton width="20px" height="20px" borderRadius="var(--radius-sm)" />
            <Skeleton width="120px" height="18px" />
          </div>
        ))}
      </div>
      
      {/* Price Filter */}
      <div>
        <Skeleton width="80px" height="20px" style={{ marginBottom: '1rem' }} />
        <Skeleton width="100%" height="40px" />
      </div>
      
      {/* Labels Filter */}
      <div>
        <Skeleton width="100px" height="20px" style={{ marginBottom: '1rem' }} />
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Skeleton width="20px" height="20px" borderRadius="var(--radius-sm)" />
            <Skeleton width="100px" height="18px" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div style={{
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      background: 'linear-gradient(135deg, #f5f1eb 0%, #ebe5d9 100%)',
      padding: '2rem'
    }}>
      <Skeleton width="200px" height="32px" />
      <Skeleton width="60%" height="48px" />
      <Skeleton width="80%" height="24px" />
      <Skeleton width="150px" height="48px" borderRadius="var(--radius-full)" style={{ marginTop: '1rem' }} />
    </div>
  )
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      border: '1px solid var(--color-border)'
    }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Skeleton width="48px" height="48px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton width="120px" height="18px" style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="100px" height="16px" />
        </div>
      </div>
      <Skeleton width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="80%" height="16px" />
    </div>
  )
}

// Add shimmer keyframes to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
  if (!document.head.querySelector('[data-skeleton-shimmer]')) {
    style.setAttribute('data-skeleton-shimmer', 'true')
    document.head.appendChild(style)
  }
}
