import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://srushtipublications.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4
    }
  ]
  
  // Get all active books
  let bookPages: MetadataRoute.Sitemap = []
  try {
    const books = await prisma.book.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    bookPages = books.map(book => ({
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  } catch (error) {
    console.error('Error fetching books for sitemap:', error)
  }
  
  // Get all active categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true
      }
    })
    
    categoryPages = categories.map(category => ({
      url: `${baseUrl}/books?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }
  
  return [...staticPages, ...bookPages, ...categoryPages]
}
