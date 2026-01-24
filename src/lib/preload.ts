'use client'

import { useCallback, useRef } from 'react'

/**
 * Preload utilities for user intent optimization
 * Per Vercel best practices: bundle-preload
 * 
 * Preload heavy bundles before they're needed to reduce perceived latency.
 * Impact: MEDIUM (reduces perceived latency)
 */

// Map to track what's already been preloaded
const preloadedModules = new Set<string>()

/**
 * Preload a dynamic import on hover/focus
 * 
 * Usage:
 * <button onMouseEnter={() => preloadModule(() => import('./HeavyComponent'))}>
 *   Open Editor
 * </button>
 */
export function preloadModule(importFn: () => Promise<any>, id?: string) {
  const moduleId = id || importFn.toString()
  
  if (typeof window === 'undefined' || preloadedModules.has(moduleId)) {
    return
  }
  
  preloadedModules.add(moduleId)
  void importFn()
}

/**
 * Hook to preload on hover/focus
 * 
 * Usage:
 * const { preloadProps } = usePreload(() => import('./monaco-editor'))
 * return <button {...preloadProps}>Open Editor</button>
 */
export function usePreload(importFn: () => Promise<any>, moduleId?: string) {
  const hasPreloaded = useRef(false)
  
  const preload = useCallback(() => {
    if (hasPreloaded.current || typeof window === 'undefined') {
      return
    }
    hasPreloaded.current = true
    void importFn()
  }, [importFn])
  
  return {
    preload,
    preloadProps: {
      onMouseEnter: preload,
      onFocus: preload,
      onTouchStart: preload,
    }
  }
}

/**
 * Preload a Next.js page on hover
 * 
 * Usage with next/link - already handles prefetch, but for custom buttons:
 * <button onMouseEnter={() => preloadPage('/checkout')}>
 *   Go to Checkout
 * </button>
 */
export function preloadPage(href: string) {
  if (typeof window === 'undefined') return
  
  // Use type assertion to avoid global interface conflict
  const buildId = (window as any).__NEXT_DATA__?.buildId ?? 'development'
  const prefetchUrl = `/_next/data/${buildId}${href}.json`
  
  // Create a prefetch link
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = prefetchUrl
  link.as = 'fetch'
  link.crossOrigin = 'anonymous'
  
  document.head.appendChild(link)
}

/**
 * Preload an image
 */
export function preloadImage(src: string) {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  
  document.head.appendChild(link)
}
