import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/admin/offers - Get all offers
export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: offers
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

// POST /api/admin/offers - Create new offer
export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    // Check if code already exists
    if (body.code) {
      const existing = await prisma.offer.findUnique({
        where: { code: body.code }
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'ಈ ಕೋಡ್ ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ' },
          { status: 400 }
        )
      }
    }
    
    const offer = await prisma.offer.create({
      data: {
        name: body.name,
        description: body.description,
        code: body.code,
        discountType: body.discountType,
        discountValue: body.discountValue,
        minPurchase: body.minPurchase,
        maxDiscount: body.maxDiscount,
        usageLimit: body.usageLimit,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive
      }
    })
    
    return NextResponse.json({
      success: true,
      data: offer,
      message: 'Offer created successfully'
    })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
