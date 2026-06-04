import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'
import { z } from 'zod';
import { sanitize } from '@/lib/sanitization';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

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


const profileUpdateSchema = z.object({
  name: z.string().min(2, 'ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳಿರಬೇಕು').max(100, 'ಹೆಸರು 100 ಅಕ್ಷರ ಮೀರುವಂತಿಲ್ಲ').transform(sanitize).optional(),
  phone: z.union([z.string().regex(/^\d{10}$/, 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಿರಬೇಕು'), z.literal('')]).optional().transform(v => (v ? sanitize(v) : null)),
  address: z.union([z.string().max(250, 'ವಿಳಾಸ 250 ಅಕ್ಷರ ಮೀರುವಂತಿಲ್ಲ'), z.literal('')]).optional().transform(v => (v ? sanitize(v) : null)),
  city: z.union([z.string().max(50, 'ಊರು 50 ಅಕ್ಷರ ಮೀರುವಂತಿಲ್ಲ'), z.literal('')]).optional().transform(v => (v ? sanitize(v) : null)),
  state: z.union([z.string().max(50, 'ರಾಜ್ಯ 50 ಅಕ್ಷರ ಮೀರುವಂತಿಲ್ಲ'), z.literal('')]).optional().transform(v => (v ? sanitize(v) : null)),
  pincode: z.union([z.string().regex(/^\d{6}$/, 'ಪಿನ್ ಕೋಡ್ 6 ಅಂಕಿಗಳಿರಬೇಕು'), z.literal('')]).optional().transform(v => (v ? sanitize(v) : null))
});

// POST /api/auth/me - Update customer profile
export async function POST(request: NextRequest) {
  try {
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

    // Rate Limiting
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`profile_update_${ip}`, { windowMs: 60000, maxRequests: 5 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'ತುಂಬಾ ಪ್ರಯತ್ನಗಳು, ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parseResult = profileUpdateSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, phone, address, city, state, pincode } = parseResult.data

    const updateData: Record<string, string | null> = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (pincode !== undefined) updateData.pincode = pincode

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
