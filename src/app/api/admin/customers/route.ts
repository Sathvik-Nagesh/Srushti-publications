import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

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
