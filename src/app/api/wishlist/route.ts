import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, API_RATE_LIMITS, getClientIp } from '@/lib/rateLimit'
import { cookies } from 'next/headers'

// Helper to get or create session ID
async function getSessionId(request: NextRequest): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('wishlist_session')?.value
  
  if (!sessionId) {
    // Generate secure session ID using crypto instead of insecure Math.random()
    sessionId = `ws_${crypto.randomUUID()}`
  }
  
  return sessionId
}

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request)
    
    const wishlistItems = await prisma.wishlist.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' }
    })
    
    // Get book details for each wishlist item
    const bookIds = wishlistItems.map(item => item.bookId)
    const books = await prisma.book.findMany({
      where: { 
        id: { in: bookIds },
        isActive: true 
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        author: true,
        coverImage: true,
        mrp: true,
        sellingPrice: true,
        discount: true,
        stockQuantity: true,
        category: {
          select: { name: true, slug: true }
        }
      }
    })
    
    // Create a map for quick lookup
    const bookMap = new Map(books.map(b => [b.id, b]))
    
    // Combine wishlist with book data
    const wishlistWithBooks = wishlistItems
      .map(item => ({
        id: item.id,
        bookId: item.bookId,
        addedAt: item.createdAt,
        book: bookMap.get(item.bookId) || null
      }))
      .filter(item => item.book !== null) // Remove items where book was deleted
    
    const response = NextResponse.json({
      success: true,
      data: wishlistWithBooks,
      count: wishlistWithBooks.length
    })
    
    // Set session cookie if not exists
    response.cookies.set('wishlist_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    
    return response
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`wishlist:${ip}`, API_RATE_LIMITS.general)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಪ್ರಯತ್ನಿಸಿ' },
        { status: 429 }
      )
    }
    
    const sessionId = await getSessionId(request)
    const body = await request.json()
    const { bookId } = body
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      )
    }
    
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, title: true }
    })
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'ಪುಸ್ತಕ ಕಂಡುಬಂದಿಲ್ಲ' },
        { status: 404 }
      )
    }
    
    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        sessionId_bookId: { sessionId, bookId }
      }
    })
    
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'ಈಗಾಗಲೇ ವಿಶ್‌ಲಿಸ್ಟ್‌ನಲ್ಲಿದೆ',
        alreadyExists: true
      })
    }
    
    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        sessionId,
        bookId
      }
    })
    
    // Get updated count
    const count = await prisma.wishlist.count({
      where: { sessionId }
    })
    
    const response = NextResponse.json({
      success: true,
      data: wishlistItem,
      count,
      message: 'ವಿಶ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!'
    })
    
    // Set session cookie
    response.cookies.set('wishlist_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
    
    return response
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'ವಿಶ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಲು ವಿಫಲ' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request)
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      )
    }
    
    // Delete from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        sessionId,
        bookId
      }
    })
    
    // Get updated count
    const count = await prisma.wishlist.count({
      where: { sessionId }
    })
    
    return NextResponse.json({
      success: true,
      count,
      message: 'ವಿಶ್‌ಲಿಸ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'ತೆಗೆದುಹಾಕಲು ವಿಫಲ' },
      { status: 500 }
    )
  }
}
