import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from '@/lib/auth-edge'

// GET /api/admin/auth/check - Verify if user is authenticated
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    const token = sessionCookie.value
    const [encodedPayload, signature] = token.split('.')
    
    if (!encodedPayload || !signature) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    const payload = atob(encodedPayload)
    const isValid = await verify(payload, signature)
    
    if (!isValid) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: JSON.parse(payload)
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
