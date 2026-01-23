import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCached, setCache, invalidateCache } from '@/lib/rateLimit'

const CACHE_KEY = 'site_settings'
const CACHE_TTL = 10000 // 10 seconds

// Default settings
const defaultSettings = {
  heroTagline: '📚 ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
  heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  heroDescription: 'ವಿಶ್ವದ ಅತ್ಯುತ್ತಮ ಪುಸ್ತಕಗಳು ಕನ್ನಡ ಓದುಗರಿಗಾಗಿ... ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.',
  heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
  statsBooks: '200+',
  statsAuthors: '50+',
  statsCustomers: '5000+',
  saleTimerEnabled: false,
  saleTimerTitle: '',
  saleTimerEndDate: null,
  saleTimerDiscountText: '',
  socialProofEnabled: true,
  socialProofInterval: 15000,
  whatsappNumber: '919876543210',
  whatsappMessage: 'ನಮಸ್ಕಾರ, ನನಗೆ ಪುಸ್ತಕಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು.',
  footerDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳ ಪ್ರಕಾಶನ ಮತ್ತು ಮಾರಾಟ.',
  copyrightText: '© 2024 ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  siteTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ | ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ',
  siteDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ.',
  siteKeywords: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳು, kannada books, kannada literature'
}

// GET /api/site-settings - Get all site settings
export async function GET() {
  try {
    // Check cache first
    const cached = getCached<typeof defaultSettings>(CACHE_KEY)
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }

    // Get from database
    const settings = await prisma.siteSettingsV2.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!settings) {
      // Return defaults if no settings exist
      setCache(CACHE_KEY, defaultSettings, CACHE_TTL)
      return NextResponse.json({ success: true, data: defaultSettings })
    }

    const formattedSettings = {
      heroTagline: settings.heroTagline,
      heroTitle: settings.heroTitle,
      heroDescription: settings.heroDescription,
      heroButtonText: settings.heroButtonText,
      statsBooks: settings.statsBooks,
      statsAuthors: settings.statsAuthors,
      statsCustomers: settings.statsCustomers,
      saleTimerEnabled: settings.saleTimerEnabled,
      saleTimerTitle: settings.saleTimerTitle || '',
      saleTimerEndDate: settings.saleTimerEndDate?.toISOString().split('T')[0] || '',
      saleTimerDiscountText: settings.saleTimerDiscountText || '',
      socialProofEnabled: settings.socialProofEnabled,
      socialProofInterval: settings.socialProofInterval,
      whatsappNumber: settings.whatsappNumber,
      whatsappMessage: settings.whatsappMessage,
      footerDescription: settings.footerDescription || '',
      copyrightText: settings.copyrightText || '',
      siteTitle: settings.siteTitle || '',
      siteDescription: settings.siteDescription || '',
      siteKeywords: settings.siteKeywords || ''
    }

    setCache(CACHE_KEY, formattedSettings, CACHE_TTL)
    return NextResponse.json({ success: true, data: formattedSettings })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ success: true, data: defaultSettings })
  }
}

// PUT /api/site-settings - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Upsert settings (create or update)
    const existingSettings = await prisma.siteSettingsV2.findFirst()

    let settings
    if (existingSettings) {
      settings = await prisma.siteSettingsV2.update({
        where: { id: existingSettings.id },
        data: {
          heroTagline: body.heroTagline,
          heroTitle: body.heroTitle,
          heroDescription: body.heroDescription || '',
          heroButtonText: body.heroButtonText,
          statsBooks: body.statsBooks,
          statsAuthors: body.statsAuthors,
          statsCustomers: body.statsCustomers,
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
      settings = await prisma.siteSettingsV2.create({
        data: {
          heroTagline: body.heroTagline || defaultSettings.heroTagline,
          heroTitle: body.heroTitle || defaultSettings.heroTitle,
          heroDescription: body.heroDescription || defaultSettings.heroDescription,
          heroButtonText: body.heroButtonText || defaultSettings.heroButtonText,
          statsBooks: body.statsBooks || defaultSettings.statsBooks,
          statsAuthors: body.statsAuthors || defaultSettings.statsAuthors,
          statsCustomers: body.statsCustomers || defaultSettings.statsCustomers,
          saleTimerEnabled: body.saleTimerEnabled ?? false,
          saleTimerTitle: body.saleTimerTitle,
          saleTimerEndDate: body.saleTimerEndDate ? new Date(body.saleTimerEndDate) : null,
          saleTimerDiscountText: body.saleTimerDiscountText,
          socialProofEnabled: body.socialProofEnabled ?? true,
          socialProofInterval: body.socialProofInterval ?? 15000,
          whatsappNumber: body.whatsappNumber || defaultSettings.whatsappNumber,
          whatsappMessage: body.whatsappMessage || defaultSettings.whatsappMessage,
          footerDescription: body.footerDescription,
          copyrightText: body.copyrightText,
          siteTitle: body.siteTitle,
          siteDescription: body.siteDescription,
          siteKeywords: body.siteKeywords
        }
      })
    }

    // Invalidate cache
    invalidateCache(CACHE_KEY)
    invalidateCache('settings:hero')

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!'
    })
  } catch (error) {
    console.error('Error saving site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
