import type { Book } from '@/lib/types'

/**
 * Generate JSON-LD structured data for a product (book)
 * This helps search engines understand your product pages
 */
export function generateProductJsonLd(book: Book, baseUrl: string = 'https://srushtipublications.com') {
  const productUrl = `${baseUrl}/books/${book.slug}`
  const imageUrl = book.coverImage || `${baseUrl}/placeholder-book.jpg`
  
  // Calculate availability
  const availability = book.stockQuantity > 0 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock'
  
  // Calculate price info
  const hasDiscount = book.mrp > book.sellingPrice
  
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: book.title,
    description: book.description || `${book.title} by ${book.author}`,
    image: imageUrl,
    url: productUrl,
    sku: book.id,
    brand: {
      '@type': 'Brand',
      name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್'
    },
    author: {
      '@type': 'Person',
      name: book.author
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: book.sellingPrice.toFixed(2),
      availability,
      seller: {
        '@type': 'Organization',
        name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
        url: baseUrl
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
  
  // Add category if available
  if (book.category?.name) {
    jsonLd.category = book.category.name
  }
  
  // Add ISBN if available
  if (book.isbn) {
    jsonLd.isbn = book.isbn
    jsonLd.gtin13 = book.isbn.replace(/-/g, '')
  }
  
  // Add language
  jsonLd.inLanguage = 'kn' // Kannada
  
  // Add aggregate rating if available (these may be added dynamically from API)
  const bookWithRating = book as Book & { averageRating?: number; reviewCount?: number }
  if (bookWithRating.averageRating && bookWithRating.reviewCount && bookWithRating.reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: bookWithRating.averageRating.toFixed(1),
      reviewCount: bookWithRating.reviewCount,
      bestRating: '5',
      worstRating: '1'
    }
  }

  return jsonLd
}

/**
 * Generate JSON-LD for organization (publisher)
 */
export function generateOrganizationJsonLd(baseUrl: string = 'https://srushtipublications.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    alternateName: 'Srushti Publications',
    url: baseUrl,
    logo: `${baseUrl}/logo.jpg`,
    description: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ - Quality Kannada Books Online Store',
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Kannada', 'English']
    },
    sameAs: [
      'https://facebook.com/srushtipublications',
      'https://instagram.com/srushtipublications'
    ]
  }
}

/**
 * Generate JSON-LD for breadcrumb navigation
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  baseUrl: string = 'https://srushtipublications.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  }
}

/**
 * Generate JSON-LD for website search box
 */
export function generateWebsiteJsonLd(baseUrl: string = 'https://srushtipublications.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
    alternateName: 'Srushti Publications',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * Generate JSON-LD for FAQ page
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generate JSON-LD for collection/category page
 */
export function generateCollectionJsonLd(
  categoryName: string,
  categorySlug: string,
  books: Book[],
  baseUrl: string = 'https://srushtipublications.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    url: `${baseUrl}/categories/${categorySlug}`,
    description: `${categoryName} - ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
    numberOfItems: books.length,
    hasPart: books.slice(0, 10).map(book => ({
      '@type': 'Product',
      name: book.title,
      url: `${baseUrl}/books/${book.slug}`,
      image: book.coverImage || `${baseUrl}/placeholder-book.jpg`,
      offers: {
        '@type': 'Offer',
        price: book.sellingPrice.toFixed(2),
        priceCurrency: 'INR'
      }
    }))
  }
}
