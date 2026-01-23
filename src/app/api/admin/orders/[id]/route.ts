import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    const updateData: any = {}
    
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
    
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true }
    })
    
    // If status changed to DISPATCHED or DELIVERED, update book sales count
    if (body.status === 'DELIVERED' && existing.status !== 'DELIVERED') {
      for (const item of order.items) {
        await prisma.book.update({
          where: { id: item.bookId },
          data: {
            salesCount: { increment: item.quantity }
          }
        })
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
