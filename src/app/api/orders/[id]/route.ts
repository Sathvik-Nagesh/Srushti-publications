import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession, verifySessionToken as verifyGuestToken } from '@/lib/auth-edge'
import { verifySessionToken as verifyCustomerToken } from '@/lib/password'

// GET /api/orders/[id] - Get single order by ID or Order Number
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Find order by ID or order number (since [id] route handles both)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id }
        ]
      },
      include: {
        items: true
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // 🛡️ SECURITY: Authorization Check
    let authorized = false

    // 1. Admin Access
    if (await verifyAdminSession(request)) {
      authorized = true
    }

    // 2. Customer Access (Owner)
    if (!authorized) {
      const customerSession = request.cookies.get('customer_session')?.value
      if (customerSession) {
        const tokenData = await verifyCustomerToken(customerSession)
        if (tokenData.valid) {
          // Check if customer ID matches or if customer email matches (for linking historical/guest orders)
          if (
            (order.customerId && order.customerId === tokenData.userId) ||
            (tokenData.email && order.customerEmail === tokenData.email)
          ) {
            authorized = true
          }
        }
      }
    }

    // 3. Guest Access (Recent Order Token)
    if (!authorized) {
      const recentOrderToken = request.cookies.get('recent_order')?.value
      if (recentOrderToken) {
        // Verify the token (which is signed with admin secret)
        const payload = await verifyGuestToken(recentOrderToken)
        if (payload) {
          // Check if the token authorizes access to THIS order
          if (payload.orderId === order.id || payload.orderNumber === order.orderNumber) {
            authorized = true
          }
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to order' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
