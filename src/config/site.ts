export const siteConfig = {
  // Brand Identity
  name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  nameEn: 'Srushti Publications',
  tagline: ' ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
  description: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ. ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ - ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು.',
  keywords: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳು, kannada books, kannada literature, ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  logo: '/logo.jpg',

  // Contact Information
  contact: {
    email: 'srushtinagesh@gmail.com',
    phone: '+91 98450 96668', 
    phoneDisplay: '+91 98450 96668', // Format for display
    whatsapp: '919845096668', // Format for API links (no spaces or +)
    address: '121, 13th Main Rd, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040',
    mapLink: 'https://maps.app.goo.gl/RNdifVqyLB6HvLrq7', // Update with your real Google Maps link
  },

  // Social Media Links (Leave empty strings to hide icons)
  social: {
    facebook: 'https://facebook.com/srushtipublications',
    instagram: 'https://instagram.com/srushtipublications',
    twitter: '', 
    youtube: '',
  },

  // Navigation Links
  nav: {
    main: [
      { name: 'ಮುಖಪುಟ', href: '/' },
      { name: 'ಪುಸ್ತಕಗಳು', href: '/books' },
      { name: 'ವಿಭಾಗಗಳು', href: '/categories' },
      { name: 'ನಮ್ಮ ಬಗ್ಗೆ', href: '/about' },
      { name: 'ಸಂಪರ್ಕಿಸಿ', href: '/contact' },
    ],
    footer: {
      quickLinks: [
        { name: 'ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು', href: '/books' },
        { name: 'ಹೊಸ ಬಿಡುಗಡೆಗಳು', href: '/books?filter=new' },
        { name: 'ಅತ್ಯುತ್ತಮ ಮಾರಾಟಗಾರರು', href: '/books?filter=bestseller' },
        { name: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', href: '/track-order' },
        { name: 'ನನ್ನ ವಿಶ್‌ಲಿಸ್ಟ್', href: '/wishlist' },
        { name: 'FAQ / ಸಹಾಯ', href: '/faq' },
        { name: 'ಶಿಪ್ಪಿಂಗ್ ಮಾಹಿತಿ', href: '/shipping' },
      ],
      legal: [
        { name: 'ಗೌಪ್ಯತಾ ನೀತಿ', href: '/privacy' },
        { name: 'ನಿಯಮಗಳು', href: '/terms' },
        { name: 'ಮರುಪಾವತಿ ನೀತಿ', href: '/refund' },
      ]
    }
  },
  
  // Stats for About Page
  stats: {
    books: '200+',
    authors: '50+',
    years: '15+'
  },

  // Hero Section
  hero: {
    title: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    tagline: 'ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಸಮೃದ್ಧ ಸಂಗ್ರಹ',
    description: 'ವಿಶ್ವದ ಅತ್ಯುತ್ತಮ ಪುಸ್ತಕಗಳು ಕನ್ನಡ ಓದುಗರಿಗಾಗಿ. ಇಲ್ಲಿ ಕಾದಂಬರಿ, ಕಥೆ, ಕವನ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಪುಸ್ತಕಗಳು ಲಭ್ಯ.',
    buttonText: 'ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    buttonLink: '/books'
  }
}

export type SiteConfig = typeof siteConfig
