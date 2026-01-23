import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { invalidateCache } from '@/lib/rateLimit'

// GET /api/admin/reviews - Get all reviews for moderation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'pending' // 'pending', 'approved', 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let whereClause: Record<string, unknown> = {}
    
    if (filter === 'pending') {
      whereClause.isApproved = false
    } else if (filter === 'approved') {
      whereClause.isApproved = true
    }
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({ where: whereClause })
    ])
    
    // Get book titles for each review
    const bookIds = [...new Set(reviews.map(r => r.bookId))]
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
      select: { id: true, title: true, slug: true }
    })
    const bookMap = new Map(books.map(b => [b.id, b]))
    
    const reviewsWithBooks = reviews.map(review => ({
      ...review,
      book: bookMap.get(review.bookId) || null
    }))
    
    // Get summary counts
    const [pendingCount, approvedCount, totalCount] = await Promise.all([
      prisma.review.count({ where: { isApproved: false } }),
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count()
    ])
    
    return NextResponse.json({
      success: true,
      data: reviewsWithBooks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        pending: pendingCount,
        approved: approvedCount,
        total: totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/reviews - Approve or reject review
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId, action } = body // action: 'approve', 'reject', 'delete'
    
    if (!reviewId || !action) {
      return NextResponse.json(
        { success: false, error: 'Review ID and action required' },
        { status: 400 }
      )
    }
    
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }
    
    if (action === 'delete') {
      await prisma.review.delete({
        where: { id: reviewId }
      })
      
      // Invalidate cache
      invalidateCache(`reviews:${review.bookId}`)
      
      return NextResponse.json({
        success: true,
        message: 'ವಿಮರ್ಶೆ ಅಳಿಸಲಾಗಿದೆ'
      })
    }
    
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isApproved: action === 'approve'
      }
    })
    
    // Invalidate cache
    invalidateCache(`reviews:${review.bookId}`)
    
    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: action === 'approve' ? 'ವಿಮರ್ಶೆ ಅನುಮೋದಿಸಲಾಗಿದೆ' : 'ವಿಮರ್ಶೆ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ'
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}
