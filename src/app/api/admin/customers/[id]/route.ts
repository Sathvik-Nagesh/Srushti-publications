import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/customers/[id] - Get single customer details with full order history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Treat params as a promise
) {
  try {
    const { id } = await params // Await the params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              select: {
                id: true,
                bookTitle: true,
                quantity: true,
                unitPrice: true,
                totalPrice: true
              }
            }
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    const { passwordHash, ...safeCustomer } = customer

    // Enrich with stats
    const totalRevenue = safeCustomer.orders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    const enrichedCustomer = {
      ...safeCustomer,
      stats: {
        totalOrders: safeCustomer._count.orders,
        totalRevenue
      }
    }

    return NextResponse.json({ success: true, data: enrichedCustomer })
  } catch (error) {
    console.error('Failed to fetch customer details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer details' },
      { status: 500 }
    )
  }
}
