import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendShippingUpdate, sendDeliveryConfirmation } from '@/lib/email'
import { verifyAdminSession } from '@/lib/auth-edge'

// Helper to generate tracking URL
function getTrackingUrl(courier: string, trackingNumber: string): string {
  const c = courier.toLowerCase().replace(/\s/g, '')
  if (c.includes('indiapost') || c.includes('speedpost')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`
  }
  if (c.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${trackingNumber}`
  }
  if (c.includes('dtdc')) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp`
  }
  if (c.includes('bluedart')) {
    return `https://www.bluedart.com/tracking`
  }
  // Default fallback
  return `https://www.google.com/search?q=${courier}+tracking+${trackingNumber}`
}

// GET /api/admin/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    
    const order = await prisma.order.findUnique({
      where: { id },
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

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    const updateData: Record<string, unknown> = {}
    
    // Update status
    if (body.status) {
      updateData.status = body.status
      
      // Set timestamps based on status
      if (body.status === 'DISPATCHED') {
        updateData.dispatchedAt = new Date()
      } else if (body.status === 'DELIVERED') {
        updateData.deliveredAt = new Date()
      }
    }
    
    // Update tracking info
    if (body.courierName !== undefined) updateData.courierName = body.courierName
    if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber
    
    // Update notes
    if (body.notes !== undefined) updateData.notes = body.notes

    // Update payment status (e.g. manual verification for QR)
    if (body.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus
      if (body.paymentStatus === 'SUCCESS' && existing.paymentStatus !== 'SUCCESS') {
        updateData.paidAt = new Date()
        if (existing.status === 'PENDING' && !updateData.status) {
          updateData.status = 'PROCESSING'
        }
      }
    }
    
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true }
    })
    
    // Send email notification for dispatch
    if (body.status === 'DISPATCHED' && existing.status !== 'DISPATCHED') {
      try {
        const courier = (updateData.courierName as string) || existing.courierName || 'Courier'
        const trackingNo = (updateData.trackingNumber as string) || existing.trackingNumber || ''
        
        await sendShippingUpdate({
          orderNumber: existing.orderNumber,
          customerName: existing.customerName,
          customerEmail: existing.customerEmail,
          courierName: courier,
          trackingNumber: trackingNo,
          trackingUrl: getTrackingUrl(courier, trackingNo),
          estimatedDelivery: '3-5 ದಿನಗಳು (Days)'
        })
      } catch (emailError) {
        console.error('Failed to send shipping email:', emailError)
        // Don't fail the request, just log it
      }
    }
    
    // If status changed to DELIVERED, update book sales count and send email.
    // 🛡️ FIX: Only increment salesCount for COD orders here.
    // For Razorpay (online) orders, salesCount is already incremented inside the
    // verify-payment atomic transaction. Incrementing again here would cause
    // double-counting on all paid online orders.
    if (body.status === 'DELIVERED' && existing.status !== 'DELIVERED') {
      const wasAlreadyPaidOnline = existing.paymentStatus === 'SUCCESS'

      if (!wasAlreadyPaidOnline) {
        // COD order delivered — increment salesCount now (not done at payment time for COD)
        await Promise.all(
          existing.items.map((item) =>
            prisma.book.update({
              where: { id: item.bookId },
              data: { salesCount: { increment: item.quantity } },
            })
          )
        )
      }
      
      // Send delivery confirmation email regardless of payment method
      try {
        await sendDeliveryConfirmation({
          orderNumber: existing.orderNumber,
          customerName: existing.customerName,
          customerEmail: existing.customerEmail
        })
      } catch (emailError) {
        console.error('Failed to send delivery confirmation email:', emailError)
        // Don't fail the request, just log it
      }
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
