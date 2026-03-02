/**
 * Google Analytics 4 Event Tracking
 * 
 * Usage:
 *   import { trackEvent, trackPurchase, trackAddToCart } from '@/lib/analytics'
 *   trackAddToCart({ bookId: 'abc', bookTitle: 'My Book', price: 299 })
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** Fire a generic GA4 event */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return
  window.gtag('event', eventName, params)
}

/** Book viewed */
export function trackViewItem(book: {
  id: string
  title: string
  price: number
  category?: string
}) {
  trackEvent('view_item', {
    currency: 'INR',
    value: book.price,
    items: JSON.stringify([{
      item_id: book.id,
      item_name: book.title,
      item_category: book.category ?? 'Books',
      price: book.price,
      quantity: 1,
    }]),
  })
}

/** Book list viewed (e.g., /books page, category page) */
export function trackViewItemList(books: { id: string; title: string; price: number }[], listName: string) {
  trackEvent('view_item_list', {
    item_list_name: listName,
    items: JSON.stringify(books.map((b, i) => ({
      item_id: b.id,
      item_name: b.title,
      price: b.price,
      index: i,
    }))),
  })
}

/** Add to cart */
export function trackAddToCart(book: {
  id: string
  title: string
  price: number
  quantity?: number
}) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: book.price * (book.quantity ?? 1),
    items: JSON.stringify([{
      item_id: book.id,
      item_name: book.title,
      price: book.price,
      quantity: book.quantity ?? 1,
    }]),
  })
}

/** Remove from cart */
export function trackRemoveFromCart(book: { id: string; title: string; price: number }) {
  trackEvent('remove_from_cart', {
    currency: 'INR',
    value: book.price,
    items: JSON.stringify([{ item_id: book.id, item_name: book.title, price: book.price, quantity: 1 }]),
  })
}

/** Begin checkout */
export function trackBeginCheckout(totalValue: number, numItems: number) {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: totalValue,
    num_items: numItems,
  })
}

/** Purchase completed */
export function trackPurchase(order: {
  orderId: string
  total: number
  shipping: number
  items: { id: string; title: string; price: number; quantity: number }[]
}) {
  trackEvent('purchase', {
    transaction_id: order.orderId,
    currency: 'INR',
    value: order.total,
    shipping: order.shipping,
    items: JSON.stringify(order.items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity,
    }))),
  })
}

/** Search performed */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: searchTerm,
    ...(resultsCount !== undefined && { results_count: resultsCount }),
  })
}

/** User signed up */
export function trackSignUp(method: 'email' | 'google' = 'email') {
  trackEvent('sign_up', { method })
}

/** User logged in */
export function trackLogin(method: 'email' | 'google' = 'email') {
  trackEvent('login', { method })
}

/** Share book */
export function trackShare(bookId: string, bookTitle: string, method: string) {
  trackEvent('share', {
    method,
    content_type: 'book',
    item_id: bookId,
    content_id: bookTitle,
  })
}

/** Wishlist add */
export function trackAddToWishlist(book: { id: string; title: string; price: number }) {
  trackEvent('add_to_wishlist', {
    currency: 'INR',
    value: book.price,
    items: JSON.stringify([{ item_id: book.id, item_name: book.title, price: book.price }]),
  })
}

/** WhatsApp button clicked */
export function trackWhatsAppClick(source?: string) {
  trackEvent('whatsapp_click', { source: source ?? 'float_button' })
}
