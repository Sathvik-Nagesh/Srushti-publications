import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken, generateSessionToken } from '@/lib/password'
import { checkRateLimit } from '@/lib/rateLimit'

// POST /api/auth/register - Register new customer
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateCheck = checkRateLimit(`register:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password, name, phone } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'ಹೆಸರು, ಇ-ಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯ' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'ಈ ಇ-ಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    const verifyToken = generateToken()

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone: phone || null,
        verifyToken,
        isVerified: true // Auto-verify for now, can add email verification later
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    })

    // Generate session token
    const sessionToken = await generateSessionToken(customer.id, customer.email)

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      data: customer,
      message: 'ಖಾತೆ ರಚಿಸಲಾಗಿದೆ!'
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ' },
      { status: 500 }
    )
  }
}
