import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken, generateSessionToken } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { schemas } from '@/lib/sanitization'
import { z } from 'zod'

const registerSchema = z.object({
  email: schemas.email,
  password: schemas.password,
  name: schemas.name,
  phone: schemas.phone.optional()
})

// POST /api/auth/register - Register new customer
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`register:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate & Sanitize Input
    const result = registerSchema.safeParse(body)
    
    if (!result.success) {
      // Format Zod errors
      const errorMessage = result.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }

    const { email, password, name, phone } = result.data

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
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
        email,
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
