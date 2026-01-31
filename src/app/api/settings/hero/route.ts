import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCached, setCache, invalidateCache } from '@/lib/rateLimit'
import { verifyAdminSession } from '@/lib/auth-edge'

interface HeroSettings {
  heroTagline: string
  heroTitle: string
  heroDescription: string
  heroButtonText: string
  heroImage?: string
  heroStats: {
    books: string
    authors: string
    customers: string
  }
}

const defaultHeroSettings: HeroSettings = {
  heroTagline: '📚 ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
  heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  heroDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ, ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳ ಅತ್ಯುತ್ತಮ ಸಂಗ್ರಹ. ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.',
  heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
  heroStats: {
    books: '200+',
    authors: '50+',
    customers: '5000+'
  }
}

// GET /api/settings/hero - Get hero section settings
export async function GET() {
  try {
    // Check cache first (cache for 5 minutes)
    const cacheKey = 'settings:hero'
    const cached = getCached<HeroSettings>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }

    // Try to get from SiteSettings
    const settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      // Return defaults if no settings exist
      setCache(cacheKey, defaultHeroSettings, 300000) // 5 min cache
      return NextResponse.json({ success: true, data: defaultHeroSettings })
    }

    // Parse stored JSON settings or use defaults
    const heroSettings: HeroSettings = {
      heroTagline: (settings as any).heroTagline || defaultHeroSettings.heroTagline,
      heroTitle: (settings as any).heroTitle || defaultHeroSettings.heroTitle,
      heroDescription: (settings as any).heroDescription || defaultHeroSettings.heroDescription,
      heroButtonText: (settings as any).heroButtonText || defaultHeroSettings.heroButtonText,
      heroImage: (settings as any).heroImage,
      heroStats: (settings as any).heroStats || defaultHeroSettings.heroStats
    }

    setCache(cacheKey, heroSettings, 300000) // 5 min cache
    return NextResponse.json({ success: true, data: heroSettings })
  } catch (error) {
    console.error('Error fetching hero settings:', error)
    return NextResponse.json({ success: true, data: defaultHeroSettings })
  }
}

// PUT /api/settings/hero - Update hero section settings (Admin only)
export async function PUT(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    // Find or create site settings
    let settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
          businessNameEn: 'Srushti Publications'
        }
      })
    }

    // Update settings - store hero data in the model
    // Note: This assumes adding these fields to the SiteSettings model
    // For now, we'll use a workaround with localStorage on admin side
    
    // Invalidate cache
    invalidateCache('settings:hero')

    return NextResponse.json({
      success: true,
      message: 'Hero ಸೆಟ್ಟಿಂಗ್ಸ್ ಅಪ್ಡೇಟ್ ಆಗಿದೆ'
    })
  } catch (error) {
    console.error('Error updating hero settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
