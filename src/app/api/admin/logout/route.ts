import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  // Rate limiting to prevent abuse
  const ip = getClientIp(request)
  const rateCheck = checkRateLimit(`admin_logout:${ip}`, { windowMs: 60000, maxRequests: 10 })
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const response = NextResponse.json({ success: true })

  // Clear the cookie by setting it to expire immediately
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  })

  return response
}
