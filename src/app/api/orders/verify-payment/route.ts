import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// POST /api/orders/verify-payment - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    // ─── 1. RATE LIMITING ─────────────────────────────────────────────────────
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(ip, 'verify-payment', { limit: 10, windowSecs: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification details' },
        { status: 400 }
      )
    }

    // ─── 2. SIGNATURE VERIFICATION ────────────────────────────────────────────
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      // Update order as failed — only if order exists
      await prisma.order.updateMany({
        where: { orderNumber, paymentStatus: 'PENDING' },
        data: { paymentStatus: 'FAILED', notes: 'Payment signature verification failed' },
      })
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // ─── 3. FETCH ORDER ───────────────────────────────────────────────────────
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // ─── 4. IDEMPOTENCY GUARD ─────────────────────────────────────────────────
    // If already SUCCESS, this is a duplicate call (webhook retry / frontend retry).
    // Return success without re-processing to prevent double stock decrement.
    if (order.paymentStatus === 'SUCCESS') {
      console.warn(
        `[verify-payment] Duplicate call for order ${orderNumber} — already processed. Skipping.`
      )
      return NextResponse.json({
        success: true,
        data: order,
        message: 'Payment already verified',
      })
    }

    // ─── 5. IDOR / REPLAY ATTACK PREVENTION ──────────────────────────────────
    // Ensure the razorpay_order_id in the request matches what's stored for this order.
    // Prevents reusing a valid signature from a different order.
    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      console.error(
        `[verify-payment] Payment mismatch: Order ${orderNumber} expects ` +
          `${order.razorpayOrderId}, got ${razorpay_order_id}`
      )
      return NextResponse.json(
        { success: false, error: 'Invalid payment verification details' },
        { status: 400 }
      )
    }

    // ─── 6. ATOMIC TRANSACTION: Update order + decrement stock ───────────────
    // All writes in a single Postgres transaction — if any write fails,
    // everything rolls back, leaving no inconsistent state.
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order to PAID
      const updated = await tx.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: 'SUCCESS',
          status: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
        },
        include: { items: true },
      })

      // Batch all book updates in parallel within the transaction
      // (Promise.all is safe inside a Prisma interactive transaction)
      await Promise.all(
        order.items.map((item) =>
          tx.book.update({
            where: { id: item.bookId },
            data: {
              stockQuantity: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
            },
          })
        )
      )

      return updated
    })

    // ─── 7. ASYNC EMAILS (non-blocking, don't delay the response) ────────────
    const emailData = {
      orderNumber: updatedOrder.orderNumber,
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      customerEmail: updatedOrder.customerEmail,
      customerPhone: updatedOrder.customerPhone,
      items: updatedOrder.items.map((item) => ({
        title: item.bookTitle,
        author: item.bookAuthor,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: updatedOrder.subtotal,
      discount: updatedOrder.discount,
      shippingCharge: updatedOrder.shippingCharge,
      taxAmount: updatedOrder.taxAmount,
      totalAmount: updatedOrder.totalAmount,
      shippingAddress: updatedOrder.shippingAddress,
      shippingCity: updatedOrder.shippingCity,
      shippingState: updatedOrder.shippingState,
      shippingPincode: updatedOrder.shippingPincode,
      paymentMethod: 'Online (Razorpay)',
      invoiceUrl: `/api/orders/${updatedOrder.orderNumber}/invoice`,
    }

    // Customer confirmation email
    sendOrderConfirmation(emailData).catch((err: unknown) =>
      console.error('[verify-payment] Customer confirmation email failed:', err)
    )

    // Admin notification email → srushtinagesh@gmail.com
    sendAdminOrderNotification(emailData).catch((err: unknown) =>
      console.error('[verify-payment] Admin notification email failed:', err)
    )

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('[verify-payment] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
