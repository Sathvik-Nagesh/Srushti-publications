import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://srushtipublications.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout',
          '/order-confirmation',
          '/order-success',
          '/wishlist',
          '/account',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/cart',
          '/compare',
          '/offline',
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout',
          '/order-confirmation',
          '/order-success',
          '/account',
        ]
      },
      // Allow AI crawlers to index public content for AI search
      {
        userAgent: 'GPTBot',
        allow: ['/', '/books', '/categories', '/about', '/contact', '/sitemap-page', '/llms.txt'],
        disallow: ['/admin/', '/api/', '/checkout', '/account'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/books', '/categories', '/about', '/sitemap-page', '/llms.txt'],
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/books', '/categories', '/about', '/sitemap-page', '/llms.txt'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl
  }
}
