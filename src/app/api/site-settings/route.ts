import { NextRequest, NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/settings'
import prisma from '@/lib/prisma'

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json({
    success: true,
    data: settings
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if V2 settings exist
    const existing = await prisma.siteSettingsV2.findFirst()

    if (existing) {
      await prisma.siteSettingsV2.update({
        where: { id: existing.id },
        data: {
          heroTagline: body.heroTagline,
          heroTitle: body.heroTitle,
          heroDescription: body.heroDescription,
          heroButtonText: body.heroButtonText,
          
          saleTimerEnabled: body.saleTimerEnabled,
          saleTimerTitle: body.saleTimerTitle,
          saleTimerEndDate: body.saleTimerEndDate ? new Date(body.saleTimerEndDate) : null,
          saleTimerDiscountText: body.saleTimerDiscountText,
          
          socialProofEnabled: body.socialProofEnabled,
          socialProofInterval: body.socialProofInterval,
          
          whatsappNumber: body.whatsappNumber,
          whatsappMessage: body.whatsappMessage,
          
          footerDescription: body.footerDescription,
          copyrightText: body.copyrightText,
          
          siteTitle: body.siteTitle,
          siteDescription: body.siteDescription,
          siteKeywords: body.siteKeywords
        }
      })
    } else {
      await prisma.siteSettingsV2.create({
        data: {
          heroTagline: body.heroTagline,
          heroTitle: body.heroTitle,
          heroDescription: body.heroDescription,
          heroButtonText: body.heroButtonText,
          
          saleTimerEnabled: body.saleTimerEnabled,
          saleTimerTitle: body.saleTimerTitle,
          saleTimerEndDate: body.saleTimerEndDate ? new Date(body.saleTimerEndDate) : null,
          saleTimerDiscountText: body.saleTimerDiscountText,
          
          socialProofEnabled: body.socialProofEnabled,
          socialProofInterval: body.socialProofInterval,
          
          whatsappNumber: body.whatsappNumber,
          whatsappMessage: body.whatsappMessage,
          
          footerDescription: body.footerDescription,
          copyrightText: body.copyrightText,
          
          siteTitle: body.siteTitle,
          siteDescription: body.siteDescription,
          siteKeywords: body.siteKeywords
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
