import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// POST /api/auth/logout - Logout customer
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request)
  const rateCheck = checkRateLimit(`logout:${ip}`, { windowMs: 60000, maxRequests: 10 })
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'ಹೆಚ್ಚು ಪ್ರಯತ್ನಗಳು. ದಯವಿಟ್ಟು 1 ನಿಮಿಷ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' },
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
