import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { cookies } from 'next/headers'

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
    // Rate limiting to prevent rapid profile update spamming
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`profile_update:${ip}`, { windowMs: 60000, maxRequests: 10 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ತುಂಬಾ ಹೆಚ್ಚು ವಿನಂತಿಗಳು. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' },
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
    const { name, phone, address, city, state, pincode } = body

    const updatedCustomer = await prisma.customer.update({
      where: { id: tokenData.userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined
      },
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
