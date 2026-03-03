import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/admin/orders - Get all orders with filters
export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    
    if (status) {
      where.status = status
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } }
      ]
    }

    // ─── Optimized: 3 parallel queries instead of 6 ──────────────────────────
    // Uses groupBy to get all status counts in ONE query instead of 3 separate COUNTs
    const [orders, total, allStats, statusGroups, revenueStats] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              id: true,
              bookTitle: true,
              quantity: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where }),
      // All-time totals (unfiltered)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true }
      }),
      // Get all status counts in ONE groupBy query (was 3 separate COUNTs before)
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      // Revenue for filtered results
      prisma.order.aggregate({
        where,
        _sum: { totalAmount: true }
      })
    ])

    // Extract counts from groupBy result
    const pending = statusGroups.find(g => g.status === 'PENDING')?._count.id ?? 0
    const processing = statusGroups
      .filter(g => g.status === 'PROCESSING' || g.status === 'PAID')
      .reduce((sum, g) => sum + g._count.id, 0)
    const delivered = statusGroups.find(g => g.status === 'DELIVERED')?._count.id ?? 0

    return NextResponse.json({
      success: true,
      data: {
        orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        stats: {
          total: allStats._count.id || 0,
          pending,
          processing,
          delivered,
          revenue: allStats._sum.totalAmount || 0,
          filteredRevenue: revenueStats._sum.totalAmount || 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
