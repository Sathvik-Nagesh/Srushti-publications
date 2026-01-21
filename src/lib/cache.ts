// LRU Cache utility for cross-request caching
// Per Vercel best practices: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
import { LRUCache } from 'lru-cache'

// Types for cached data
interface CacheOptions {
  max?: number
  ttl?: number
}

// Default cache with 1000 items and 5 minute TTL
const defaultOptions: CacheOptions = {
  max: 1000,
  ttl: 5 * 60 * 1000 // 5 minutes
}

// Create a generic cache factory
export function createCache<T>(options: CacheOptions = {}) {
  const opts = { ...defaultOptions, ...options }
  return new LRUCache<string, T>({
    max: opts.max!,
    ttl: opts.ttl!,
  })
}

// Book cache - for frequently accessed books
export const bookCache = createCache<any>({
  max: 500,
  ttl: 10 * 60 * 1000 // 10 minutes
})

// Category cache - categories don't change often
export const categoryCache = createCache<any>({
  max: 100,
  ttl: 30 * 60 * 1000 // 30 minutes
})

// Settings cache - site settings rarely change
export const settingsCache = createCache<any>({
  max: 10,
  ttl: 60 * 60 * 1000 // 1 hour
})

// Helper function with auto-cache pattern
export async function withCache<T>(
  cache: LRUCache<string, T>,
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key)
  if (cached) {
    return cached
  }
  
  const data = await fetcher()
  cache.set(key, data)
  return data
}

// Example usage:
// const book = await withCache(bookCache, `book:${slug}`, () => db.book.findUnique({ where: { slug } }))
