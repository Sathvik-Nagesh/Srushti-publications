import { cache } from 'react'
import prisma from '@/lib/prisma'

// Cached settings fetcher for Server Components
export const getSiteSettings = cache(async () => {
  try {
    const [settingsV1, settingsV2, categories] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.siteSettingsV2.findFirst(),
      prisma.category.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true }
      })
    ])
    
    // Default V1
    const v1 = settingsV1 || {
      businessName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
      businessNameEn: 'Srushti Publications',
      tagline: 'ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
      email: 'srushtinagesh@gmail.com',
      phone: '+91 98450 96668',
      whatsapp: '+91 98450 96668',
      address: '123, 4ನೇ ಮುಖ್ಯ ರಸ್ತೆ, ಜಯನಗರ, ಬೆಂಗಳೂರು - 560041',
      gstNumber: '',
      freeShippingMin: 500,
      defaultShipping: 50,
      estimatedDays: '5-7 ದಿನಗಳು',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }

    // Default V2
    const v2 = settingsV2 || {
      heroTagline: 'ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಸಮೃದ್ಧ ಸಂಗ್ರಹ',
      heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
      heroDescription: 'ವಿಶ್ವದ ಅತ್ಯುತ್ತಮ ಪುಸ್ತಕಗಳು ಕನ್ನಡ ಓದುಗರಿಗಾಗಿ...',
      heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
      saleTimerEnabled: false,
      socialProofEnabled: true,
      socialProofInterval: 15000,
      whatsappNumber: '919876543210',
      whatsappMessage: 'ನಮಸ್ಕಾರ',
      statsBooks: '200+',
      statsAuthors: '50+'
    }

    return { ...v1, ...v2, categories: categories || [] }
  } catch (error) {
    console.error('Failed to load settings:', error)
    return {
      businessName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
      email: 'srushtinagesh@gmail.com',
      phone: '+91 98450 96668',
    }
  }
})
