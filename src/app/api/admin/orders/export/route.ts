import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/admin/orders/export - Export orders for accounting (CSV format)
export async function GET(request: NextRequest) {
  // Sentinel: Add authentication check to prevent data leak
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    if (!(await verifyAdminSession(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Parse date range from query params
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const format = searchParams.get('format') || 'csv'
    
    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate)
      }
      if (endDate) {
        // Add 1 day to include the end date fully
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        ;(where.createdAt as Record<string, Date>).lt = end
      }
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    // Fetch orders with items
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            bookTitle: true,
            bookAuthor: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: orders,
        count: orders.length
      })
    }
    
    // Generate CSV
    const csvRows: string[] = []
    
    // Header row
    csvRows.push([
      'Order Number',
      'Invoice Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Shipping Address',
      'City',
      'State',
      'Pincode',
      'Status',
      'Payment Status',
      'Payment Method',
      'Subtotal',
      'Discount',
      'Shipping',
      'Tax',
      'Total',
      'Items Count',
      'Items Details',
      'Courier',
      'Tracking Number'
    ].join(','))
    
    // Data rows
    for (const order of orders) {
      const itemsDetails = order.items
        .map(item => `${item.bookTitle} (${item.quantity}x ₹${item.unitPrice})`)
        .join(' | ')
      
      csvRows.push([
        order.orderNumber,
        order.invoiceNumber || '',
        new Date(order.createdAt).toISOString().split('T')[0],
        `"${order.customerName.replace(/"/g, '""')}"`,
        order.customerEmail,
        order.customerPhone,
        `"${order.shippingAddress.replace(/"/g, '""')}"`,
        order.shippingCity,
        order.shippingState,
        order.shippingPincode,
        order.status,
        order.paymentStatus,
        order.paymentMethod || 'COD',
        order.subtotal.toFixed(2),
        order.discount.toFixed(2),
        order.shippingCharge.toFixed(2),
        order.taxAmount.toFixed(2),
        order.totalAmount.toFixed(2),
        order.items.length.toString(),
        `"${itemsDetails.replace(/"/g, '""')}"`,
        order.courierName || '',
        order.trackingNumber || ''
      ].join(','))
    }
    
    const csvContent = csvRows.join('\n')
    
    // Generate filename with date range
    const today = new Date().toISOString().split('T')[0]
    const filename = `orders-export-${startDate || 'all'}-to-${endDate || today}.csv`
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        // Add BOM for Excel to recognize UTF-8
        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
