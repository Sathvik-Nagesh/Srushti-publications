import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'

import { z } from 'zod'
import { sanitize } from '@/lib/sanitization'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

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


// Schema for profile update validation and sanitization
const profileSchema = z.object({
  name: z.string().min(2, 'ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳಿರಬೇಕು').max(100).transform(v => typeof v === 'string' ? sanitize(v) : v).optional(),
  phone: z.string().regex(/^\d{10}$/, 'ಫೋನ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಿರಬೇಕು').transform(v => typeof v === 'string' ? sanitize(v) : v).optional().nullable(),
  address: z.string().max(500).transform(v => typeof v === 'string' ? sanitize(v) : v).optional().nullable(),
  city: z.string().max(100).transform(v => typeof v === 'string' ? sanitize(v) : v).optional().nullable(),
  state: z.string().max(100).transform(v => typeof v === 'string' ? sanitize(v) : v).optional().nullable(),
  pincode: z.string().max(10).transform(v => typeof v === 'string' ? sanitize(v) : v).optional().nullable()
})

// POST /api/auth/me - Update customer profile
export async function POST(request: NextRequest) {
  try {

    // Rate limiting to prevent DoS via rapid updates
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`profile_update:${ip}`, { windowMs: 60000, maxRequests: 20 })
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
    const validationResult = profileSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, phone, address, city, state, pincode } = validationResult.data

    // Build update object correctly to allow clearing fields (using empty strings)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (pincode !== undefined) updateData.pincode = pincode

    if (Object.keys(updateData).length === 0) {
       return NextResponse.json(
        { success: false, error: 'ಯಾವುದೇ ಡೇಟಾ ಒದಗಿಸಿಲ್ಲ' },
        { status: 400 }
      )
    }

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
