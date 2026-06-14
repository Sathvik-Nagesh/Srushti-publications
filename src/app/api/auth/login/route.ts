import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, generateSessionToken, verifyDummy } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// POST /api/auth/login - Customer login
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`login:${ip}`, { windowMs: 60000, maxRequests: 10 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ಹೆಚ್ಚು ಪ್ರಯತ್ನಗಳು. ದಯವಿಟ್ಟು 1 ನಿಮಿಷ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'ಇ-ಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯ' },
        { status: 400 }
      )
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!customer) {
      // Sentinel: Prevent timing attacks (user enumeration)
      await verifyDummy(password)
      return NextResponse.json(
        { success: false, error: 'ತಪ್ಪು ಇ-ಮೇಲ್ ಅಥವಾ ಪಾಸ್ವರ್ಡ್' },
        { status: 401 }
      )
    }

    // Customer might not have password (guest converted)
    if (!customer.passwordHash) {
      // Sentinel: Prevent timing attacks (user enumeration)
      await verifyDummy(password)
      return NextResponse.json(
        { success: false, error: 'ತಪ್ಪು ಇ-ಮೇಲ್ ಅಥವಾ ಪಾಸ್ವರ್ಡ್' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, customer.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'ತಪ್ಪು ಇ-ಮೇಲ್ ಅಥವಾ ಪಾಸ್ವರ್ಡ್' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() }
    })

    // Generate session token
    const sessionToken = await generateSessionToken(customer.id, customer.email)

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      },
      message: 'ಲಾಗಿನ್ ಯಶಸ್ವಿ!'
    })

    response.cookies.set('customer_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'ಲಾಗಿನ್ ವಿಫಲ' },
      { status: 500 }
    )
  }
}
