'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showSkeleton?: boolean
}

/**
 * Optimized Image Component
 * - Shows blur placeholder while loading
 * - Handles loading errors with fallback
 * - Lazy loads images
 * - Adds fade-in animation
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder-book.jpg',
  showSkeleton = true,
  className = '',
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    setImageSrc(fallbackSrc)
  }

  return (
    <div 
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 'inherit'
          }}
        />
      )}
      
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={{
          transition: 'opacity 0.3s ease, filter 0.3s ease',
          opacity: isLoading ? 0 : 1,
          filter: isLoading ? 'blur(10px)' : 'blur(0)'
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

/**
 * Book Cover Image Component
 * Specialized for book cover images with proper aspect ratio
 */
export function BookCoverImage({
  src,
  title,
  className = '',
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw"
}: {
  src: string
  title: string
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={`book-cover-wrapper ${className}`}
      style={{
        position: 'relative',
        aspectRatio: '3 / 4',
        overflow: 'hidden',
        backgroundColor: 'var(--color-cream-light)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Skeleton */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-cream-light)'
          }}
        >
          <div style={{
            width: '60%',
            height: '60%',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
      )}
      
      <Image
        src={hasError ? '/placeholder-book.jpg' : src}
        alt={`${title} - ಪುಸ್ತಕದ ಮುಖಪುಟ`}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease, transform 0.4s ease',
          opacity: isLoading ? 0 : 1
        }}
        className="book-cover-image"
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .book-cover-image:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

/**
 * Lazy Section Component
 * Uses Intersection Observer to lazy load sections
 */
export function LazySection({ 
  children, 
  className = '',
  threshold = 0.1
}: { 
  children: React.ReactNode
  className?: string
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  
  const setRef = (node: HTMLElement | null) => {
    if (!node) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    
    observer.observe(node)
  }
  
  return (
    <div
      ref={setRef}
      className={`lazy-section ${className} ${isVisible ? 'is-visible' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      }}
    >
      {isVisible ? children : null}
    </div>
  )
}
