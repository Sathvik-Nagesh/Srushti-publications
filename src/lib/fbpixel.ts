/**
 * Facebook Pixel Event Tracking Utility
 * 
 * Usage:
 *   import { fbTrack } from '@/lib/fbpixel'
 *   fbTrack('AddToCart', { value: 299, currency: 'INR', content_name: 'Book Title' })
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}

type FbStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Search'
  | 'AddToWishlist'
  | 'Lead'
  | 'CompleteRegistration'

export function fbTrack(event: FbStandardEvent, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', event, params)
}

/** View a book page */
export function fbViewContent(book: { id: string; title: string; price: number }) {
  fbTrack('ViewContent', {
    content_ids: [book.id],
    content_name: book.title,
    content_type: 'product',
    value: book.price,
    currency: 'INR',
  })
}

/** Add to cart */
export function fbAddToCart(book: { id: string; title: string; price: number; quantity?: number }) {
  fbTrack('AddToCart', {
    content_ids: [book.id],
    content_name: book.title,
    content_type: 'product',
    value: book.price * (book.quantity ?? 1),
    currency: 'INR',
    num_items: book.quantity ?? 1,
  })
}

/** Begin checkout */
export function fbInitiateCheckout(totalValue: number, numItems: number, contentIds: string[]) {
  fbTrack('InitiateCheckout', {
    value: totalValue,
    currency: 'INR',
    num_items: numItems,
    content_ids: contentIds,
  })
}

/** Purchase complete */
export function fbPurchase(order: { total: number; items: { id: string }[] }) {
  fbTrack('Purchase', {
    value: order.total,
    currency: 'INR',
    content_ids: order.items.map(i => i.id),
    content_type: 'product',
    num_items: order.items.length,
  })
}

/** Search performed */
export function fbSearch(searchTerm: string) {
  fbTrack('Search', { search_string: searchTerm })
}

/** User registered */
export function fbCompleteRegistration() {
  fbTrack('CompleteRegistration', { currency: 'INR' })
}
