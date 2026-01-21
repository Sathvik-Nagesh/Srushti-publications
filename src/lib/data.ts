// React.cache wrapper for per-request deduplication
// Per Vercel best practices: server-cache-react
import { cache } from 'react'
import { prisma } from './prisma'

/**
 * Per-Request Deduplication with React.cache()
 * 
 * React.cache() deduplicates function calls within a single request.
 * If you call getUser(1) multiple times during the same request,
 * it only makes one database query.
 * 
 * Impact: HIGH - prevents duplicate DB queries in RSC tree
 */

// Cached book fetcher - deduplicates within a request
export const getBookBySlug = cache(async (slug: string) => {
  try {
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })
    return book
  } catch (error) {
    console.error('Error fetching book:', error)
    return null
  }
})

// Cached books list fetcher
export const getBooks = cache(async (params: {
  categoryId?: string
  isNewRelease?: boolean
  isBestSeller?: boolean
  isOnSale?: boolean
  isFeatured?: boolean
  limit?: number
  offset?: number
}) => {
  try {
    const { categoryId, isNewRelease, isBestSeller, isOnSale, isFeatured, limit = 20, offset = 0 } = params

    const where: any = { isActive: true }
    if (categoryId) where.categoryId = categoryId
    if (isNewRelease) where.isNewRelease = true
    if (isBestSeller) where.isBestSeller = true
    if (isOnSale) where.isOnSale = true
    if (isFeatured) where.isFeatured = true

    const books = await prisma.book.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })

    return books
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
})

// Cached categories fetcher
export const getCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { books: true }
        }
      }
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})

// Cached category fetcher
export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        books: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { books: true }
        }
      },
    })
    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
})

// Cached site settings
export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
})

// Cached order fetcher
export const getOrderByNumber = cache(async (orderNumber: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
})
