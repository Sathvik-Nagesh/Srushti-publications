import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/admin/inventory - Get inventory status
export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdminSession(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'low_stock', 'out_of_stock', 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let whereClause: Record<string, unknown> = { isActive: true }
    
    if (filter === 'low_stock') {
      whereClause = {
        ...whereClause,
        stockQuantity: { lte: prisma.book.fields.lowStockAlert }
      }
    } else if (filter === 'out_of_stock') {
      whereClause = {
        ...whereClause,
        stockQuantity: 0
      }
    }
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          titleEn: true,
          coverImage: true,
          stockQuantity: true,
          lowStockAlert: true,
          salesCount: true,
          category: {
            select: { name: true }
          }
        },
        orderBy: { stockQuantity: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.book.count({ where: whereClause })
    ])
    
    // Get summary stats
    const [outOfStock, lowStock, totalBooks] = await Promise.all([
      prisma.book.count({ where: { isActive: true, stockQuantity: 0 } }),
      prisma.book.count({
        where: {
          isActive: true,
          stockQuantity: { gt: 0 },
          // Books where stock is <= lowStockAlert
        }
      }),
      prisma.book.count({ where: { isActive: true } })
    ])
    
    // Get low stock books separately (where stock <= alert threshold)
    const lowStockBooks = await prisma.book.findMany({
      where: { isActive: true, stockQuantity: { gt: 0 } },
      select: { stockQuantity: true, lowStockAlert: true }
    })
    const actualLowStock = lowStockBooks.filter(b => b.stockQuantity <= b.lowStockAlert).length
    
    return NextResponse.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalBooks,
        outOfStock,
        lowStock: actualLowStock,
        healthyStock: totalBooks - outOfStock - actualLowStock
      }
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/inventory - Update stock for a book
export async function PATCH(request: NextRequest) {
  try {
    if (!(await verifyAdminSession(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookId, stockQuantity, lowStockAlert, action, quantity } = body
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      )
    }
    
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, stockQuantity: true, title: true }
    })
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    let newStockQuantity = book.stockQuantity
    
    // Handle different actions
    if (action === 'add' && quantity) {
      newStockQuantity = book.stockQuantity + quantity
    } else if (action === 'subtract' && quantity) {
      newStockQuantity = Math.max(0, book.stockQuantity - quantity)
    } else if (stockQuantity !== undefined) {
      newStockQuantity = stockQuantity
    }
    
    const updateData: Record<string, unknown> = {
      stockQuantity: newStockQuantity
    }
    
    if (lowStockAlert !== undefined) {
      updateData.lowStockAlert = lowStockAlert
    }
    
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: updateData,
      select: {
        id: true,
        title: true,
        stockQuantity: true,
        lowStockAlert: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: `ಸ್ಟಾಕ್ ಅಪ್ಡೇಟ್ ಆಗಿದೆ: ${updatedBook.stockQuantity} ಪ್ರತಿಗಳು`
    })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
