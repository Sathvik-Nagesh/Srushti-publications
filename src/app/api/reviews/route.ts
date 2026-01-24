import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getCached, setCache, API_RATE_LIMITS } from '@/lib/rateLimit'
import { schemas, sanitize } from '@/lib/sanitization'
import { z } from 'zod'

const reviewSchema = z.object({
  bookId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).transform(sanitize).optional().nullable(),
  comment: z.string().min(10, 'Comment too short').max(1000).transform(sanitize),
  authorName: schemas.name,
  authorEmail: schemas.email,
  orderId: z.string().optional().nullable()
})

// GET /api/reviews - Get reviews for a book
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      )
    }
    
    // Check cache
    const cacheKey = `reviews:${bookId}:${page}:${limit}`
    const cached = getCached<unknown>(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, ...cached, cached: true })
    }
    
    // Get approved reviews only (for public display)
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          bookId,
          isApproved: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({
        where: { bookId, isApproved: true }
      })
    ])
    
    // Calculate average rating
    const allRatings = await prisma.review.aggregate({
      where: { bookId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true }
    })
    
    const result = {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: allRatings._avg.rating || 0,
        totalReviews: allRatings._count.rating
      }
    }
    
    // Cache for 5 minutes
    setCache(cacheKey, result, 300000)
    
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateCheck = checkRateLimit(`review:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    
    // Validate & Sanitize
    const result = reviewSchema.safeParse(body)
    
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }

    const { bookId, rating, title, comment, authorName, authorEmail, orderId } = result.data
    
    // Check if book exists
    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ' },
        { status: 404 }
      )
    }
    
    // Check for verified purchase if orderId is provided
    let isVerified = false
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          orderNumber: orderId,
          customerEmail: authorEmail,
          paymentStatus: 'SUCCESS'
        },
        include: {
          items: {
            where: { bookId }
          }
        }
      })
      isVerified = !!order && order.items.length > 0
    }
    
    // Check for duplicate review
    const existingReview = await prisma.review.findFirst({
      where: {
        bookId,
        authorEmail
      }
    })
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'ನೀವು ಈಗಾಗಲೇ ಈ ಪುಸ್ತಕಕ್ಕೆ ವಿಮರ್ಶೆ ಬರೆದಿದ್ದೀರಿ' },
        { status: 400 }
      )
    }
    
    // Create review with sanitized data
    const review = await prisma.review.create({
      data: {
        bookId,
        rating,
        title: title || null,
        comment, // sanitized
        authorName, // sanitized
        authorEmail,
        orderId: orderId || null,
        isVerified,
        isApproved: false // Requires admin approval
      }
    })
    
    return NextResponse.json({
      success: true,
      data: review,
      message: 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಅನುಮೋದನೆಯ ನಂತರ ಪ್ರಕಟಿಸಲಾಗುವುದು.'
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ' },
      { status: 500 }
    )
  }
}
