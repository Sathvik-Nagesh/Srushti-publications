import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    const formattedCustomers = customers.map(customer => {
      const totalRevenue = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const lastOrder = customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      
      return {
        ...customer,
        passwordHash: undefined,
        orders: undefined, // Don't send full order list to list view to save bandwidth if huge
        stats: {
          totalOrders: customer._count.orders,
          totalRevenue,
          lastOrderDate: lastOrder ? lastOrder.createdAt : null
        }
      }
    })

    return NextResponse.json({ success: true, data: formattedCustomers })
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
