/**
 * Rate Limiter and Request Protection Utility
 * Prevents excessive database queries and protects against abuse
 */

import { NextRequest } from 'next/server'

/**
 * Get client IP address safely handling proxy headers
 */
export function getClientIp(request: Request | NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return 'unknown'
}

// Simple in-memory rate limiter (for development/single server)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number    // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60000,    // 1 minute
  maxRequests: 100     // 100 requests per minute
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up old entries (memory management)
  if (rateLimitMap.size > 10000) {
    const cutoff = now - config.windowMs
    for (const [key, value] of rateLimitMap) {
      if (value.resetTime < cutoff) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs }
  }

  if (record.count >= config.maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: record.resetTime - now 
    }
  }

  // Increment count
  record.count++
  return { 
    allowed: true, 
    remaining: config.maxRequests - record.count, 
    resetIn: record.resetTime - now 
  }
}

// Simple LRU cache for query results
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const queryCache = new Map<string, CacheEntry<unknown>>()
const MAX_CACHE_SIZE = 500

export function getCached<T>(key: string): T | null {
  const entry = queryCache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null

  const now = Date.now()
  if (now > entry.timestamp + entry.ttl) {
    queryCache.delete(key)
    return null
  }

  return entry.data
}

export function setCache<T>(key: string, data: T, ttlMs: number = 30000): void {
  // LRU eviction - remove oldest entries if cache is full
  if (queryCache.size >= MAX_CACHE_SIZE) {
    const keysToDelete: string[] = []
    let count = 0
    for (const k of queryCache.keys()) {
      if (count++ < 50) { // Remove 50 oldest entries
        keysToDelete.push(k)
      } else {
        break
      }
    }
    keysToDelete.forEach(k => queryCache.delete(k))
  }

  queryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  })
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    queryCache.clear()
    return
  }

  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) {
      queryCache.delete(key)
    }
  }
}

// Debounce utility for client-side
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Request deduplication - prevents duplicate concurrent requests
const pendingRequests = new Map<string, Promise<unknown>>()

export async function deduplicatedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) {
    return pending
  }

  const promise = fetcher().finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, promise)
  return promise
}

// API rate limit configurations for different endpoints
export const API_RATE_LIMITS = {
  search: { windowMs: 60000, maxRequests: 60 },    // 60 searches/min
  dashboard: { windowMs: 60000, maxRequests: 30 }, // 30 dashboard loads/min  
  adminWrite: { windowMs: 60000, maxRequests: 20 }, // 20 write ops/min
  general: { windowMs: 60000, maxRequests: 100 }   // 100 general requests/min
}
