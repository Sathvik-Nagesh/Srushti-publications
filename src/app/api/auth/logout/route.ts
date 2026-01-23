import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/logout - Logout customer
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'ಲಾಗ್ ಔಟ್ ಆಗಿದೆ'
  })

  response.cookies.delete('customer_session')
  
  return response
}
