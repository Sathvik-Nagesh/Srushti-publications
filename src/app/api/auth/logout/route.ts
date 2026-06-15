import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// POST /api/auth/logout - Logout customer
export async function POST(request: NextRequest) {
  // Rate limiting to prevent logout spamming/DoS
  const ip = getClientIp(request)
  const rateCheck = checkRateLimit(`logout:${ip}`, { windowMs: 60000, maxRequests: 5 })
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    )
  }

  const response = NextResponse.json({
    success: true,
    message: 'ಲಾಗ್ ಔಟ್ ಆಗಿದೆ'
  })

  response.cookies.delete('customer_session')
  
  return response
}
