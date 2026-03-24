import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/books/[slug] - Get book by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const book = await prisma.book.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true
          }
        }
      }
    })
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await prisma.book.update({
      where: { id: book.id },
      data: { viewCount: { increment: 1 } }
    })
    
    // Get related books from same category
    const relatedBooks = await prisma.book.findMany({
      where: {
        categoryId: book.categoryId,
        id: { not: book.id },
        isActive: true
      },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        coverImage: true,
        mrp: true,
        sellingPrice: true,
        isNewRelease: true,
        isBestSeller: true,
        isOnSale: true,
        stockQuantity: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        book,
        relatedBooks
      }
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

// PATCH /api/books/[slug] - Update book
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { slug } = await params
    const body = await request.json()
    
    const existingBook = await prisma.book.findUnique({
      where: { slug }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    const book = await prisma.book.update({
      where: { slug },
      data: {
        ...body,
        mrp: body.mrp ? parseFloat(body.mrp) : undefined,
        sellingPrice: body.sellingPrice ? parseFloat(body.sellingPrice) : undefined,
        discount: body.discount !== undefined ? parseFloat(body.discount) : undefined,
        stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity) : undefined,
        pages: body.pages !== undefined ? parseInt(body.pages) : undefined,
        publicationYear: body.publicationYear !== undefined ? parseInt(body.publicationYear) : undefined,
        weight: body.weight !== undefined ? parseFloat(body.weight) : undefined,
        discountStart: body.discountStart ? new Date(body.discountStart) : undefined,
        discountEnd: body.discountEnd ? new Date(body.discountEnd) : undefined,
        newReleaseUntil: body.newReleaseUntil ? new Date(body.newReleaseUntil) : undefined,
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: book,
      message: 'Book updated successfully'
    })
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[slug] - Delete book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const existingBook = await prisma.book.findUnique({
      where: { slug }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Soft delete by marking as inactive
    await prisma.book.update({
      where: { slug },
      data: { isActive: false }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
