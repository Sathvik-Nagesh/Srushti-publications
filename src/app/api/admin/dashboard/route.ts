import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getCached, setCache, API_RATE_LIMITS, getClientIp } from '@/lib/rateLimit'

// GET /api/admin/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`dashboard:${ip}`, API_RATE_LIMITS.dashboard)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Check cache (dashboard data cached for 60 seconds)
    const cacheKey = 'admin:dashboard'
    const cached = getCached<unknown>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Get orders in current period
    const currentPeriodOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Get orders in previous period for comparison
    const previousPeriodOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    })

    // Calculate totals
    const currentRevenue = currentPeriodOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : currentRevenue > 0 ? 100 : 0

    const currentOrderCount = currentPeriodOrders.length
    const previousOrderCount = previousPeriodOrders.length
    const ordersChange = previousOrderCount > 0 
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
      : currentOrderCount > 0 ? 100 : 0

    // Get total counts
    const totalBooks = await prisma.book.count()
    const activeOffers = await prisma.offer.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    })
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    // Best sellers - use salesCount field directly (already maintained when orders are delivered)
    // This is MUCH more efficient than aggregating all order items
    const bestSellerBooks = await prisma.book.findMany({
      where: {
        isActive: true,
        salesCount: { gt: 0 }
      },
      select: {
        id: true,
        title: true,
        salesCount: true,
        sellingPrice: true
      },
      orderBy: { salesCount: 'desc' },
      take: 4
    })

    const bestSellers = bestSellerBooks.map(book => ({
      id: book.id,
      title: book.title,
      salesCount: book.salesCount,
      revenue: book.salesCount * book.sellingPrice // Approximate based on current price
    }))

    // Weekly revenue data for chart (last 7 days)
    const weeklyRevenue: { day: string; revenue: number; orders: number }[] = []
    const dayNames = ['ಭಾನು', 'ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು', 'ಶುಕ್ರ', 'ಶನಿ']
    
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now)
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setHours(0, 0, 0, 0)
      
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)
      
      const dayOrders = currentPeriodOrders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= dayStart && orderDate <= dayEnd
      })
      
      weeklyRevenue.push({
        day: dayNames[dayStart.getDay()],
        revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        orders: dayOrders.length
      })
    }

    const responseData = {
      stats: {
        totalRevenue: currentRevenue,
        revenueChange: Math.round(revenueChange * 10) / 10,
        totalOrders: currentOrderCount,
        ordersChange: Math.round(ordersChange * 10) / 10,
        totalBooks,
        activeOffers,
        pendingOrders
      },
      recentOrders,
      bestSellers,
      weeklyRevenue
    }

    // Cache for 60 seconds
    setCache(cacheKey, responseData, 60000)

    return NextResponse.json({
      success: true,
      data: responseData
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
