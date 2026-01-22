import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// Helper to check authentication
async function checkAuth(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const isValid = await verifyAdminSession(session?.value)
  return isValid
}

// GET /api/admin/books/[id] - Get book by ID for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true
      }
    })
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: book
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/books/[id] - Update book by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()
    
    const existingBook = await prisma.book.findUnique({
      where: { id }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Generate slug if title changed
    let slug = existingBook.slug
    if (body.title && body.title !== existingBook.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0C80-\u0CFF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      // Check if slug exists
      const slugExists = await prisma.book.findFirst({
        where: { slug, id: { not: id } }
      })
      
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }
    
    const book = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        slug,
        author: body.author,
        authorEn: body.authorEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        categoryId: body.categoryId,
        mrp: body.mrp,
        sellingPrice: body.sellingPrice,
        stockQuantity: body.stockQuantity,
        lowStockAlert: body.lowStockAlert,
        isbn: body.isbn,
        pages: body.pages,
        publicationYear: body.publicationYear,
        edition: body.edition,
        language: body.language,
        weight: body.weight,
        dimensions: body.dimensions,
        coverImage: body.coverImage,
        isNewRelease: body.isNewRelease,
        isBestSeller: body.isBestSeller,
        isOnSale: body.isOnSale,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
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

// DELETE /api/admin/books/[id] - Delete book by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    
    const existingBook = await prisma.book.findUnique({
      where: { id }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Soft delete by setting isActive to false
    await prisma.book.update({
      where: { id },
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
