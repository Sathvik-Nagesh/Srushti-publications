import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateInvoiceHTML, prepareInvoiceData } from '@/lib/invoice'
import { verifyAdminSession, verifySessionToken as verifyGuestToken } from '@/lib/auth-edge'
import { verifySessionToken as verifyCustomerToken } from '@/lib/password'


// GET /api/orders/[id]/invoice - Generate invoice for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Find order by ID or order number
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
          // Check if customer ID matches or if customer email matches
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
        const payload = await verifyGuestToken(recentOrderToken)
        if (payload) {
          if (payload.orderId === order.id || payload.orderNumber === order.orderNumber) {
            authorized = true
          }
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to invoice' },
        { status: 403 }
      )
    }

    // Generate invoice number if not exists
    const invoiceNumber = order.invoiceNumber || `INV-${order.orderNumber}`
    
    // Update order with invoice number if needed
    if (!order.invoiceNumber) {
      await prisma.order.update({
        where: { id: order.id },
        data: { invoiceNumber }
      })
    }
    
    // Prepare invoice data
    const invoiceData = prepareInvoiceData({
      orderNumber: order.orderNumber,
      invoiceNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingPincode: order.shippingPincode,
      subtotal: order.subtotal,
      discount: order.discount,
      shippingCharge: order.shippingCharge,
      taxAmount: order.taxAmount,
      gstBreakup: order.gstBreakup as { cgst: number; sgst: number; igst: number } | null,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || undefined,
      razorpayPaymentId: order.razorpayPaymentId || undefined,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        bookTitle: item.bookTitle,
        bookAuthor: item.bookAuthor,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }))
    })
    
    // Check for format parameter
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'html'
    
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: invoiceData
      })
    }
    
    // Generate HTML invoice
    const invoiceHTML = generateInvoiceHTML(invoiceData)
    
    // Return HTML response
    return new NextResponse(invoiceHTML, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="Invoice-${invoiceNumber}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
