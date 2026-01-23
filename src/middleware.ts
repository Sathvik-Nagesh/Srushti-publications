import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from '@/lib/auth-edge'

// Rate limiting map - in production, use Redis
const rateLimit = new Map<string, { count: number; timestamp: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'anonymous'
  return ip
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)
  
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(key, { count: 1, timestamp: now })
    return false
  }
  
  if (entry.count >= MAX_REQUESTS) {
    return true
  }
  
  entry.count++
  return false
}

// Admin session check - verifies signed token
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const adminSession = request.cookies.get('admin_session')
  if (!adminSession?.value) return false

  const parts = adminSession.value.split('.')
  if (parts.length !== 2) return false

  const [encodedPayload, signature] = parts
  
  try {
    const payload = atob(encodedPayload)
    return await verify(payload, signature)
  } catch (e) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.razorpay.com https://api.cloudinary.com;"
  )
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    const key = getRateLimitKey(request)
    if (isRateLimited(key)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  
  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!(await isAdminAuthenticated(request))) {
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
