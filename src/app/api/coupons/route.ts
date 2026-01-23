import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/coupons - Get all available/active coupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtotalParam = searchParams.get('subtotal')
    
    // Base query for active coupons
    // We want to fetch all active coupons and then filter them based on user context if needed
    // But primarily we want all valid coupons that are active and within date range
    const coupons = await prisma.offer.findMany({
      where: {
        isActive: true, // Only active coupons
        // We will filter dates in JS to be safe with timezones if needed, but DB query is better
      },
      orderBy: {
        discountValue: 'desc'
      }
    })

    // If subtotal is provided, we can add a flag or filter dependent on business logic. 
    // For now, let's return all active coupons and let the frontend filter or show "eligible" status.
    // Ideally we might want to hide coupons that are strictly NOT applicable, but showing them as "locked" is good UX too.

    // Let's filter out coupons that have reached their global usage limit
    // Filter for date validity manually to ensure timezone safety
    const now = new Date()
    const validCoupons = coupons.filter(coupon => {
      // Check date range
      const start = new Date(coupon.startDate)
      const end = new Date(coupon.endDate)
      if (now < start || now > end) return false

      // Check usage limits
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return false
      }
      return true
    })

    return NextResponse.json({
      success: true,
      data: validCoupons
    })

  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}
