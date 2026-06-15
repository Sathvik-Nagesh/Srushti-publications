import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  // Rate limiting to prevent logout spamming/DoS
  const ip = getClientIp(request)
  const rateCheck = checkRateLimit(`admin_logout:${ip}`, { windowMs: 60000, maxRequests: 5 })
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
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
