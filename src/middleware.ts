import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/auth-edge'
import { kv } from '@vercel/kv'

// Rate limiting map - in production, use Redis
const rateLimit = new Map<string, { count: number; timestamp: number }>()

// Separate stricter rate limit for API write operations
const writeRateLimit = new Map<string, { count: number; timestamp: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute for GET
const MAX_WRITE_REQUESTS = 20 // 20 write requests per minute (POST/PUT/DELETE)

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,  // Path traversal
  /<script/i,  // XSS attempts
  /javascript:/i,  // XSS attempts
  /on\w+=/i,  // Event handler injection
  /union\s+select/i,  // SQL injection
  /select\s+.*\s+from/i,  // SQL injection
]

function getRateLimitKey(request: NextRequest): string {
  // Use Next.js platform IP if available (most secure)
  const req = request as any
  if (req.ip) return req.ip

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  return ip
}

function checkRateLimitMap(key: string, isWrite: boolean = false): boolean {
  const now = Date.now()
  const limitMap = isWrite ? writeRateLimit : rateLimit
  const maxRequests = isWrite ? MAX_WRITE_REQUESTS : MAX_REQUESTS
  const entry = limitMap.get(key)
  
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    limitMap.set(key, { count: 1, timestamp: now })
    return false
  }
  
  if (entry.count >= maxRequests) {
    return true
  }
  
  entry.count++
  return false
}

async function isRateLimited(key: string, isWrite: boolean = false): Promise<boolean> {
  // If KV is not configured, fallback to Map
  if (!process.env.KV_REST_API_URL) {
     return checkRateLimitMap(key, isWrite)
  }

  try {
    const maxRequests = isWrite ? MAX_WRITE_REQUESTS : MAX_REQUESTS
    const current = await kv.incr(key)
    if (current === 1) {
      await kv.expire(key, Math.ceil(RATE_LIMIT_WINDOW / 1000))
    }
    return current > maxRequests
  } catch (err) {
    // Graceful degradation
    return checkRateLimitMap(key, isWrite)
  }
}

// Check for suspicious requests
function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.nextUrl.toString()
  const userAgent = request.headers.get('user-agent') || ''
  
  // Check URL for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      console.warn(`Suspicious URL pattern detected: ${url}`)
      return true
    }
  }
  
  // Block requests with no user agent (usually bots)
  if (!userAgent && request.nextUrl.pathname.startsWith('/api')) {
    return true
  }
  
  return false
}

// Admin session check - verifies signed token
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  return verifyAdminSession(request)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method
  
  // Block suspicious requests early
  if (isSuspiciousRequest(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Core Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HSTS - Force HTTPS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Permissions Policy - Restrict browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  )
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://api.cloudinary.com https://vitals.vercel-insights.com https://*.sentry.io",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  )
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    const key = getRateLimitKey(request)
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
    
    if (await isRateLimited(key, isWriteOperation)) {
      const retryAfter = Math.ceil(RATE_LIMIT_WINDOW / 1000)
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString()
          } 
        }
      )
    }
    
    // Add cache headers for GET API requests (5 seconds stale-while-revalidate)
    if (method === 'GET' && !pathname.includes('/admin/')) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=30'
      )
    }
  }
  
  // Protect admin routes (pages and API)
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApiRoute = pathname.startsWith('/api/admin')

  if ((isAdminRoute || isAdminApiRoute) && pathname !== '/admin/login' && pathname !== '/api/admin/login') {
    if (!(await isAdminAuthenticated(request))) {
      // For API routes, return 401 JSON
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // For pages, redirect to login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

