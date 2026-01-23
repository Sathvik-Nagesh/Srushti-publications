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
        { success: false, error: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಪ್ರಯತ್ನಿಸಿ (Try closer)' },
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
