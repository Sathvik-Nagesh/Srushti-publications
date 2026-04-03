import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { schemas, sanitize } from '@/lib/sanitization'

const profileUpdateSchema = z.object({
  name: schemas.name.optional(),
  phone: schemas.phone.optional(),
  address: z.string().max(500, 'Address is too long').transform(sanitize).optional(),
  city: z.string().max(100, 'City is too long').transform(sanitize).optional(),
  state: z.string().max(100, 'State is too long').transform(sanitize).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional()
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

    // Validate & Sanitize Input
    const result = profileUpdateSchema.safeParse(body)

    if (!result.success) {
      // Format Zod errors
      const errorMessage = result.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }

    const { name, phone, address, city, state, pincode } = result.data

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
