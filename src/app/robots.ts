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
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
