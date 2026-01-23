import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getCached, setCache, API_RATE_LIMITS } from '@/lib/rateLimit'

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
    const { bookId, rating, title, comment, authorName, authorEmail, orderId } = body
    
    // Validation
    if (!bookId || !rating || !comment || !authorName || !authorEmail) {
      return NextResponse.json(
        { success: false, error: 'ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' },
        { status: 400 }
      )
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'ರೇಟಿಂಗ್ 1-5 ನಡುವೆ ಇರಬೇಕು' },
        { status: 400 }
      )
    }
    
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
    
    // Create review
    const review = await prisma.review.create({
      data: {
        bookId,
        rating,
        title: title || null,
        comment,
        authorName,
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
