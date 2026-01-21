import { NextRequest, NextResponse } from 'next/server'
import { sign } from '@/lib/auth-edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check credentials
    // Use environment variables or fallback to hardcoded (for demo compatibility)
    // TODO: Remove fallback credentials in production
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@srushtipublication.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'SrushtiAdmin@2024'

    if (email === adminEmail && password === adminPassword) {
      // Create signed session token
      const payload = 'authenticated'
      const signature = await sign(payload)
      const token = `${payload}.${signature}`

      const response = NextResponse.json({ success: true })

      // Set HttpOnly cookie
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
