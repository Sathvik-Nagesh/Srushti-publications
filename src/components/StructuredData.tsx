// JSON-LD Structured Data for SEO
import { Book, Category } from '@/lib/types'
import { safeJsonLdStringify } from '@/lib/jsonld'

interface BookStructuredDataProps {
  book: Book
  url: string
}

interface OrganizationStructuredDataProps {
  name: string
  url: string
  logo?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[]
}

// Product Schema for Books
export function BookStructuredData({ book, url }: BookStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Book', 'Product'],
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author
    },
    isbn: book.isbn || undefined,
    numberOfPages: book.pages || undefined,
    datePublished: book.publicationYear ? `${book.publicationYear}-01-01` : undefined,
    inLanguage: 'kn', // Kannada
    bookEdition: book.edition || undefined,
    image: book.coverImage,
    description: book.description,
    sku: book.isbn || book.id,
    url: url,
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'INR',
      price: book.sellingPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: book.stockQuantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Srushti Publications'
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: book.sellingPrice >= 500 ? 0 : 50,
          currency: 'INR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      }
    }
  }

  // Clean undefined values
  const cleanData = JSON.parse(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(cleanData) }}
    />
  )
}

// Organization Schema
export function OrganizationStructuredData({ name, url, logo }: OrganizationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logo,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Kannada', 'English']
    },
    sameAs: [] // Add social media links here
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredData) }}
    />
  )
}

// Breadcrumb Schema
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredData) }}
    />
  )
}

// WebSite Schema with Search Action
export function WebsiteStructuredData({ url, name }: { url: string; name: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredData) }}
    />
  )
}

// Local Business Schema for Publisher
export function PublisherStructuredData({ 
  name, 
  url, 
  address, 
  phone, 
  email 
}: { 
  name: string
  url: string
  address?: string
  phone?: string
  email?: string
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: name,
    url: url,
    telephone: phone,
    email: email,
    address: address ? {
      '@type': 'PostalAddress',
      streetAddress: address
    } : undefined,
    priceRange: '₹₹'
  }

  // Clean undefined values
  const cleanData = JSON.parse(JSON.stringify(structuredData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(cleanData) }}
    />
  )
}
