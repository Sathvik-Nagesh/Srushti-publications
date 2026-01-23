import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/customers - Get all customers (aggregated from orders)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Get all orders and aggregate customer data manually
    // This approach is more compatible with Prisma 7's new driver adapter
    const orders = await prisma.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        shippingCity: true,
        shippingState: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Aggregate by customer email
    const customerMap = new Map<string, {
      customerEmail: string
      customerName: string
      customerPhone: string
      shippingCity: string
      shippingState: string
      orderCount: number
      totalSpent: number
      lastOrderDate: Date
    }>()

    for (const order of orders) {
      const existing = customerMap.get(order.customerEmail)
      if (existing) {
        existing.orderCount += 1
        existing.totalSpent += order.totalAmount
        if (order.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt
        }
      } else {
        customerMap.set(order.customerEmail, {
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          shippingCity: order.shippingCity,
          shippingState: order.shippingState,
          orderCount: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.createdAt
        })
      }
    }

    // Convert to array and sort by total spent
    let result = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)

    // Apply search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => 
        c.customerEmail.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.customerPhone.includes(q)
      )
    }

    // Calculate stats
    const totalRevenue = result.reduce((sum, c) => sum + c.totalSpent, 0)
    const totalOrders = result.reduce((sum, c) => sum + c.orderCount, 0)
    const repeatCustomers = result.filter(c => c.orderCount > 1).length

    return NextResponse.json({
      success: true,
      data: {
        customers: result.map(c => ({
          customerEmail: c.customerEmail,
          customerName: c.customerName,
          customerPhone: c.customerPhone,
          shippingCity: c.shippingCity,
          shippingState: c.shippingState,
          _count: { id: c.orderCount },
          _sum: { totalAmount: c.totalSpent },
          lastOrderDate: c.lastOrderDate
        })),
        stats: {
          total: result.length,
          totalRevenue,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          repeatCustomers
        }
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
