import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/settings - Get site settings
export async function GET() {
  try {
    // Find the first settings record, or create default if none exists
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
          businessNameEn: 'Srushti Publications',
          tagline: 'ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
          email: 'srushtinagesh@gmail.com',
          phone: '+91 98450 96668',
          whatsapp: '+91 98450 96668',
          address: '123, 4ನೇ ಮುಖ್ಯ ರಸ್ತೆ, ಜಯನಗರ, ಬೆಂಗಳೂರು - 560041',
          estimatedDays: '5-7 ದಿನಗಳು',
          defaultShipping: 50,
          freeShippingMin: 500
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/settings - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if settings exist
    const existing = await prisma.siteSettings.findFirst()

    let settings
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          businessName: body.businessName,
          businessNameEn: body.businessNameEn,
          tagline: body.tagline,
          email: body.email,
          phone: body.phone,
          whatsapp: body.whatsapp, // Assuming whatsapp maps to phone if same, or separate field
          address: body.address, 
          // city field does not exist in schema, relying on address field
          // city: body.city, 
          
          gstNumber: body.gstNumber,
          panNumber: body.panNumber,
          
          defaultShipping: parseFloat(body.defaultShipping || '0'),
          freeShippingMin: parseFloat(body.freeShippingMin || '0'),
          estimatedDays: body.estimatedDays,
          
          razorpayKeyId: body.razorpayKeyId,
          razorpaySecret: body.razorpayKeySecret, // Warning: schema says razorpaySecret, UI says razorpayKeySecret
          
          facebook: body.socialFacebook,
          instagram: body.socialInstagram,
          twitter: body.socialTwitter,
          youtube: body.socialYoutube,
        }
      })
    } else {
        // Create new
        settings = await prisma.siteSettings.create({
            data: {
                // ... same fields ...
                businessName: body.businessName,
                // etc
            }
        })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
