'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load below-fold components for faster initial page load
// These components are not visible on first paint, so we can defer loading

const HomeFeatures = dynamic(() => import('@/components/HomeFeatures'), {
  loading: () => <div style={{ minHeight: '300px' }} />,
})

const HomeOffers = dynamic(() => import('@/components/HomeOffers'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed'), {
  loading: () => null,
  ssr: false // Client-only since it uses localStorage
})

const SaleTimer = dynamic(() => import('@/components/SaleTimer'), {
  loading: () => null,
  ssr: false // Client-only since it updates in real-time
})

const HomepageFAQ = dynamic(() => import('@/components/HomepageFAQ'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

// Export lazy-loaded components for use in server components
export function LazyHomeFeatures() {
  return (
    <Suspense fallback={<div style={{ minHeight: '300px' }} />}>
      <HomeFeatures />
    </Suspense>
  )
}

export function LazyHomeOffers() {
  return (
    <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
      <HomeOffers />
    </Suspense>
  )
}

export function LazyRecentlyViewed({ maxItems }: { maxItems?: number }) {
  return (
    <Suspense fallback={null}>
      <RecentlyViewed maxItems={maxItems} />
    </Suspense>
  )
}

export function LazySaleTimer() {
  return (
    <Suspense fallback={null}>
      <SaleTimer />
    </Suspense>
  )
}

export function LazyHomepageFAQ() {
  return (
    <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
      <HomepageFAQ />
    </Suspense>
  )
}
