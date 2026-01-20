import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyRazorpaySignature } from '@/lib/razorpay'

// POST /api/orders/verify-payment - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification details' },
        { status: 400 }
      )
    }
    
    // Verify signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )
    
    if (!isValidSignature) {
      // Update order as failed
      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: 'FAILED',
          notes: 'Payment signature verification failed'
        }
      })
      
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }
    
    // Get order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'SUCCESS',
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date()
      },
      include: { items: true }
    })
    
    // Reduce stock quantity for each book
    for (const item of order.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: {
          stockQuantity: { decrement: item.quantity },
          salesCount: { increment: item.quantity }
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Payment verified successfully'
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
