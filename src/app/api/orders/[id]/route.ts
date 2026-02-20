import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession, verifySessionToken } from '@/lib/auth-edge'

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

    // 🛡️ SECURITY: Access Control (IDOR Protection)
    // 1. Check Admin Access
    if (await verifyAdminSession(request)) {
      return NextResponse.json({ success: true, data: order })
    }

    // 2. Check Customer Session (Ownership)
    const customerSessionToken = request.cookies.get('customer_session')?.value
    if (customerSessionToken) {
      const session = await verifySessionToken(customerSessionToken)
      if (session && session.userId && session.userId === order.customerId) {
        return NextResponse.json({ success: true, data: order })
      }
    }

    // 3. Check Recent Order Cookie (Guest Access)
    // This allows the user who just placed the order to view it
    const recentOrderToken = request.cookies.get('recent_order')?.value
    if (recentOrderToken) {
      const session = await verifySessionToken(recentOrderToken)
      // Check if token grants access to THIS order
      if (session && (session.orderId === order.id || session.orderNumber === order.orderNumber)) {
        return NextResponse.json({ success: true, data: order })
      }
    }

    // 4. Deny Access
    return NextResponse.json(
      { success: false, error: 'Unauthorized access to order details' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
