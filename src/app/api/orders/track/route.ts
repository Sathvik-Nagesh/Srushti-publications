import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`track_order:${ip}`, { windowMs: 60000, maxRequests: 5 })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { orderNumber } = await request.json()

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim() },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಆರ್ಡರ್ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.' },
        { status: 404 }
      )
    }

    // Map status to steps
    const steps = [
      { status: 'PENDING', label: 'ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ', date: order.createdAt, code: 'ordered' },
      { status: 'PROCESSING', label: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ', date: null, code: 'confirmed' },
      { status: 'DISPATCHED', label: 'ಶಿಪ್ ಮಾಡಲಾಗಿದೆ', date: null, code: 'shipped' },
      { status: 'DELIVERED', label: 'ವಿತರಿಸಲಾಗಿದೆ', date: null, code: 'delivered' }
    ]

    // Determine completion based on current status
    // Simple logic: If status is X, all previous steps are done.
    const statusOrder = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED']
    const currentStatusIndex = statusOrder.indexOf(order.status)
    const activeStatusIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex // Default to 0 if unknown (e.g. CANCELLED)

    // For simplicity, we just mark steps as completed if their index <= current status index
    // Note: This is an approximation. Real tracking needs detailed logs.
    const trackingSteps = steps.map((step, index) => ({
      status: step.code,
      label: step.label,
      date: index === 0 ? new Date(order.createdAt).toLocaleDateString('kn-IN', { day: 'numeric', month: 'short' }) : '-', // Only start date is known for sure in this simple model
      completed: index <= activeStatusIndex && order.status !== 'CANCELLED'
    }))

    // Format response
    const formattedOrder = {
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      items: order.items.map(item => ({
        title: item.bookTitle,
        qty: item.quantity,
        price: item.unitPrice
      })),
      total: order.totalAmount,
      orderDate: new Date(order.createdAt).toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      deliveryDate: order.status === 'DELIVERED' ? 'ತಲುಪಿದೆ' : '5-7 ದಿನಗಳು',
      address: `${order.shippingCity}, ${order.shippingState}`,
      trackingSteps
    }

    return NextResponse.json({
      success: true,
      data: formattedOrder
    })

  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json(
      { success: false, error: 'ಆಂತರಿಕ ಸರ್ವರ್ ದೋಷ' },
      { status: 500 }
    )
  }
}
