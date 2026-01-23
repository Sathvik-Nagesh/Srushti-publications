import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, API_RATE_LIMITS } from '@/lib/rateLimit'

// POST /api/coupons/verify - Verify and apply a coupon code
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateCheck = checkRateLimit(`coupon:${ip}`, API_RATE_LIMITS.general)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { code, subtotal } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'ಕೂಪನ್ ಕೋಡ್ ಅಗತ್ಯ' },
        { status: 400 }
      )
    }

    // Find the offer/coupon in database
    const now = new Date()
    const offer = await prisma.offer.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    })

    if (!offer) {
      return NextResponse.json({
        success: false,
        error: 'ಅಮಾನ್ಯ ಅಥವಾ ಅವಧಿ ಮುಗಿದ ಕೂಪನ್ ಕೋಡ್',
        valid: false
      })
    }

    // Check usage limit
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
      return NextResponse.json({
        success: false,
        error: 'ಈ ಕೂಪನ್ ಬಳಕೆ ಮಿತಿ ತಲುಪಿದೆ',
        valid: false
      })
    }

    // Check minimum purchase
    if (offer.minPurchase && subtotal < offer.minPurchase) {
      return NextResponse.json({
        success: false,
        error: `ಕನಿಷ್ಠ ₹${offer.minPurchase} ಖರೀದಿ ಅಗತ್ಯ`,
        valid: false,
        minPurchase: offer.minPurchase
      })
    }

    // Calculate discount
    let discount = 0
    if (offer.discountType === 'percentage') {
      discount = Math.round((subtotal * offer.discountValue) / 100)
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount
      }
    } else {
      // Fixed discount
      discount = offer.discountValue
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        code: offer.code,
        name: offer.name,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        maxDiscount: offer.maxDiscount,
        minPurchase: offer.minPurchase,
        calculatedDiscount: discount
      }
    })
  } catch (error) {
    console.error('Coupon verification error:', error)
    return NextResponse.json(
      { success: false, error: 'ಕೂಪನ್ ಪರಿಶೀಲನೆ ವಿಫಲ' },
      { status: 500 }
    )
  }
}

// GET /api/coupons/available - Get available coupons for the current order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtotal = parseFloat(searchParams.get('subtotal') || '0')

    const now = new Date()
    
    // Get all active offers
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
        code: { not: null } // Only offers with codes
      },
      orderBy: { discountValue: 'desc' },
      take: 10 // Limit to prevent overload
    })

    // Filter and categorize offers
    const eligibleOffers = offers.filter(offer => 
      (!offer.minPurchase || subtotal >= offer.minPurchase) &&
      (!offer.usageLimit || offer.usedCount < offer.usageLimit)
    ).map(offer => {
      let discount = 0
      if (offer.discountType === 'percentage') {
        discount = Math.round((subtotal * offer.discountValue) / 100)
        if (offer.maxDiscount && discount > offer.maxDiscount) {
          discount = offer.maxDiscount
        }
      } else {
        discount = offer.discountValue
      }
      
      return {
        id: offer.id,
        code: offer.code,
        name: offer.name,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        maxDiscount: offer.maxDiscount,
        minPurchase: offer.minPurchase,
        calculatedDiscount: discount,
        eligible: true
      }
    })

    const upcomingOffers = offers.filter(offer => 
      offer.minPurchase && subtotal < offer.minPurchase
    ).map(offer => ({
      id: offer.id,
      code: offer.code,
      name: offer.name,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      maxDiscount: offer.maxDiscount,
      minPurchase: offer.minPurchase,
      amountNeeded: offer.minPurchase! - subtotal,
      eligible: false
    }))

    // Find the best offer (highest discount)
    const bestOffer = eligibleOffers.length > 0 
      ? eligibleOffers.reduce((best, current) => 
          current.calculatedDiscount > best.calculatedDiscount ? current : best
        )
      : null

    return NextResponse.json({
      success: true,
      data: {
        eligible: eligibleOffers,
        upcoming: upcomingOffers.slice(0, 3), // Top 3 upcoming
        bestOffer: bestOffer
      }
    })
  } catch (error) {
    console.error('Available offers error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}
