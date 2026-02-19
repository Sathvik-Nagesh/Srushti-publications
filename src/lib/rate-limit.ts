/**
 * Simple in-memory rate limiter (per-IP, per-route)
 * Supabase Best Practice: Prevent connection exhaustion & abuse
 * For production at scale, use Redis (Upstash) instead.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Map: `${ip}:${route}` → entry
const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Max requests per window */
  limit: number
  /** Window in seconds */
  windowSecs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Check if a request is within rate limits.
 * @param ip - Client IP address
 * @param route - Route identifier (e.g. 'orders/create')
 * @param options - Rate limit configuration
 */
export function checkRateLimit(
  ip: string,
  route: string,
  options: RateLimitOptions
): RateLimitResult {
  const key = `${ip}:${route}`
  const now = Date.now()
  const windowMs = options.windowSecs * 1000

  let entry = store.get(key)

  // If no entry or window expired, reset
  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { allowed: true, remaining: options.limit - 1, resetAt: new Date(entry.resetAt) }
  }

  entry.count++

  if (entry.count > options.limit) {
    return { allowed: false, remaining: 0, resetAt: new Date(entry.resetAt) }
  }

  return {
    allowed: true,
    remaining: options.limit - entry.count,
    resetAt: new Date(entry.resetAt),
  }
}

/**
 * Get client IP from Next.js request headers (works on Vercel)
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
