import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'

// GET /api/customer/orders - Get customer's orders
export async function GET(request: NextRequest) {
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

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: tokenData.userId },
      select: { email: true }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'ಗ್ರಾಹಕ ಕಂಡುಬಂದಿಲ್ಲ' },
        { status: 404 }
      )
    }

    // Get orders by customer ID or email (for orders placed before account creation)
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: tokenData.userId },
          { customerEmail: customer.email }
        ]
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        items: {
          select: {
            bookTitle: true,
            quantity: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: orders
    })
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return NextResponse.json(
      { success: false, error: 'ಆರ್ಡರ್‌ಗಳನ್ನು ಪಡೆಯಲು ವಿಫಲ' },
      { status: 500 }
    )
  }
}
