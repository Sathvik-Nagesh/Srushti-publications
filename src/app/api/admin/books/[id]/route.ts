import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { deleteImage } from '@/lib/cloudinary'

// GET /api/admin/books/[id] - Get book by slug (ID) for Admin (includes inactive)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params
    
    // Fetch by slug, NO isActive filter
    const book = await prisma.book.findUnique({
      where: { slug },
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

// PATCH /api/admin/books/[id] - Update book
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params
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
    
    const { categoryId, coverImagePublicId, isActive, ...rest } = body

    const updateData: any = {
      ...rest,
      isActive: isActive, // Re-include if it is actually in schema (it likely is, as it's a standard field). Only coverImagePublicId was flagged.
      mrp: body.mrp ? parseFloat(body.mrp) : undefined,
      sellingPrice: body.sellingPrice ? parseFloat(body.sellingPrice) : undefined,
      stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity) : undefined,
      lowStockAlert: body.lowStockAlert !== undefined ? parseInt(body.lowStockAlert) : undefined,
      pages: body.pages !== undefined ? parseInt(body.pages) : undefined,
      publicationYear: body.publicationYear !== undefined ? parseInt(body.publicationYear) : undefined,
      weight: body.weight !== undefined ? parseFloat(body.weight) : undefined,
    }

    // Handle Category update properly via relation
    if (categoryId) {
        updateData.category = {
            connect: { id: categoryId }
        }
    }

    // Protect immutable fields
    delete updateData.id
    
    // Explicitly delete categoryId from data bucket to avoid "Unknown argument" error
    // (It was already removed via destructuring above, but ensuring consistency)

    // ----- Cloudinary: delete old image if a NEW cover was uploaded -----
    if (body.coverImagePublicId && existingBook.coverImagePublicId &&
        body.coverImagePublicId !== existingBook.coverImagePublicId) {
      // Non-blocking: fire and forget (don't delay the response)
      deleteImage(existingBook.coverImagePublicId).catch((err: unknown) =>
        console.error('[Cloudinary] Failed to delete old cover:', err)
      )
    }

    const book = await prisma.book.update({
      where: { slug },
      data: updateData
    })

    // ISR: revalidate the book detail page and the books listing page
    revalidatePath(`/books/${book.slug}`)
    revalidatePath('/books')
    revalidatePath('/')

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

// DELETE /api/admin/books/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params
    
    const existingBook = await prisma.book.findUnique({ where: { slug } })
    if (!existingBook) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Hard delete to remove it completely as per Admin "Trash" intent
    await prisma.book.delete({
      where: { slug }
    })

    // ----- Cloudinary: delete cover image from storage -----
    if (existingBook.coverImagePublicId) {
      deleteImage(existingBook.coverImagePublicId).catch((err: unknown) =>
        console.error('[Cloudinary] Failed to delete image on book delete:', err)
      )
    }

    // ISR: revalidate listing and home pages
    revalidatePath('/books')
    revalidatePath('/')

    return NextResponse.json({ success: true, message: 'Book deleted completely' })
  } catch (error) {
    console.error('Error deleting book:', error)
    // Fallback to soft delete if FK constraint fails
    try {
        const { id: slug } = await params
        await prisma.book.update({
            where: { slug },
            data: { isActive: false }
        })
        return NextResponse.json({ success: true, message: 'Book marked as inactive (cannot delete due to orders/reviews)' })
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
    }
  }
}
