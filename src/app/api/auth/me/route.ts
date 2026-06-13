import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { z } from 'zod'
import { sanitize } from '@/lib/sanitization'

// Input validation and sanitization schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳಿರಬೇಕು').max(100).transform(sanitize).optional(),
  phone: z.union([z.string().regex(/^\d{10}$/, 'ಫೋನ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಿರಬೇಕು'), z.literal('')])
    .optional()
    .transform(v => (v === undefined ? undefined : (v ? sanitize(v) : null))),
  address: z.string().max(500, 'ವಿಳಾಸ ತುಂಬಾ ಉದ್ದವಾಗಿದೆ').optional()
    .transform(v => (v === undefined ? undefined : (v ? sanitize(v) : null))),
  city: z.string().max(100, 'ಊರಿನ ಹೆಸರು ತುಂಬಾ ಉದ್ದವಾಗಿದೆ').optional()
    .transform(v => (v === undefined ? undefined : (v ? sanitize(v) : null))),
  state: z.string().max(100, 'ರಾಜ್ಯದ ಹೆಸರು ತುಂಬಾ ಉದ್ದವಾಗಿದೆ').optional()
    .transform(v => (v === undefined ? undefined : (v ? sanitize(v) : null))),
  pincode: z.union([z.string().regex(/^\d{6}$/, 'ಪಿನ್ ಕೋಡ್ 6 ಅಂಕಿಗಳಿರಬೇಕು'), z.literal('')])
    .optional()
    .transform(v => (v === undefined ? undefined : (v ? sanitize(v) : null)))
})

// GET /api/auth/me - Get current customer session
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('customer_session')?.value

    if (!sessionToken) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        data: null
      })
    }

    // Verify token
    const tokenData = await verifySessionToken(sessionToken)

    if (!tokenData.valid || !tokenData.userId) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        data: null
      })
    }

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: tokenData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        isVerified: true,
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!customer) {
      const response = NextResponse.json({
        success: true,
        authenticated: false,
        data: null
      })
      response.cookies.delete('customer_session')
      return response
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        ...customer,
        orderCount: customer._count.orders
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      success: true,
      authenticated: false,
      data: null
    })
  }
}

// POST /api/auth/me - Update customer profile
export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent abuse/DoS
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`profile_update:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ಹೆಚ್ಚು ಪ್ರಯತ್ನಗಳು. ದಯವಿಟ್ಟು 1 ನಿಮಿಷ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' },
        { status: 429 }
      )
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('customer_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ' },
        { status: 401 }
      )
    }

    const tokenData = await verifySessionToken(sessionToken)
    if (!tokenData.valid || !tokenData.userId) {
      return NextResponse.json(
        { success: false, error: 'ಸೆಷನ್ ಮುಕ್ತಾಯವಾಗಿದೆ' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate and sanitize input
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const validData = validationResult.data

    // Build update object, explicitly omitting undefined fields so they aren't modified
    const updateData: any = {}
    if (validData.name !== undefined) updateData.name = validData.name
    if (validData.phone !== undefined) updateData.phone = validData.phone
    if (validData.address !== undefined) updateData.address = validData.address
    if (validData.city !== undefined) updateData.city = validData.city
    if (validData.state !== undefined) updateData.state = validData.state
    if (validData.pincode !== undefined) updateData.pincode = validData.pincode

    const updatedCustomer = await prisma.customer.update({
      where: { id: tokenData.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'ಪ್ರೊಫೈಲ್ ಅಪ್ಡೇಟ್ ಆಗಿದೆ'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'ಅಪ್ಡೇಟ್ ವಿಫಲ' },
      { status: 500 }
    )
  }
}
