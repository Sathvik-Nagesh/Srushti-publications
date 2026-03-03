import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { computeGlobalDiscount, validateDiscount, type DiscountType } from '@/lib/discount'
import { verifyAdminSession } from '@/lib/auth-edge'

export async function POST(req: NextRequest) {
  try {
    const adminUser = await verifyAdminSession(req)
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      discountType,        // 'percentage' | 'fixed'
      discountValue,       // number
      scope,               // 'all' | 'category'
      categoryIds,         // string[] — only used when scope === 'category'
      mode = 'override',   // 'override' (from MRP) | 'stack' (from current selling price)
      preview = false,     // if true, returns what would change without saving
    } = body as {
      discountType: DiscountType
      discountValue: number
      scope: 'all' | 'category'
      categoryIds?: string[]
      mode?: 'override' | 'stack'
      preview?: boolean
    }

    // Validate inputs
    if (!discountType || !['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json({ success: false, error: 'Invalid discount type' }, { status: 400 })
    }
    if (typeof discountValue !== 'number' || discountValue <= 0) {
      return NextResponse.json({ success: false, error: 'Discount value must be positive' }, { status: 400 })
    }

    // Fetch books to apply discount to
    const whereClause = {
      isActive: true,
      ...(scope === 'category' && categoryIds?.length
        ? { categoryId: { in: categoryIds } }
        : {}),
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      select: { id: true, mrp: true, sellingPrice: true, title: true },
    })

    if (books.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active books found for the selected scope',
      }, { status: 404 })
    }

    // Validate discount against first book (use as sample)
    const sampleBook = books[0]
    const basePrice = mode === 'override' ? sampleBook.mrp : sampleBook.sellingPrice
    const validationErr = validateDiscount(basePrice, discountType, discountValue)
    if (validationErr) {
      return NextResponse.json({ success: false, error: validationErr }, { status: 400 })
    }

    // Compute new prices
    const updates = computeGlobalDiscount(books, discountType, discountValue, mode)

    if (preview) {
      // Return preview without saving
      return NextResponse.json({
        success: true,
        preview: true,
        affectedCount: books.length,
        sample: updates.slice(0, 5).map(u => {
          const book = books.find(b => b.id === u.id)!
          return {
            title: book.title,
            mrp: book.mrp,
            oldSellingPrice: book.sellingPrice,
            newSellingPrice: u.sellingPrice,
          }
        }),
      })
    }

    // Apply in a transaction — update all books in a single batch
    await prisma.$transaction(
      updates.map(({ id, sellingPrice }) =>
        prisma.book.update({
          where: { id },
          data: {
            sellingPrice,
            isOnSale: true,
          },
        }),
      ),
    )

    return NextResponse.json({
      success: true,
      message: `${books.length} ಪುಸ್ತಕಗಳಿಗೆ ರಿಯಾಯಿತಿ ಯಶಸ್ವಿಯಾಗಿ ಅನ್ವಯಿಸಲಾಗಿದೆ`,
      affectedCount: books.length,
    })
  } catch (error) {
    console.error('[global-discount] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/global-discount
 * Reset all book selling prices back to their MRP (removes all discounts)
 */
export async function DELETE(req: NextRequest) {
  try {
    const adminUser = await verifyAdminSession(req)
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { scope, categoryIds } = body as {
      scope?: 'all' | 'category'
      categoryIds?: string[]
    }

    const whereClause = {
      isActive: true,
      ...(scope === 'category' && categoryIds?.length
        ? { categoryId: { in: categoryIds } }
        : {}),
    }

    // Reset sellingPrice = mrp, isOnSale = false
    const books = await prisma.book.findMany({
      where: whereClause,
      select: { id: true, mrp: true },
    })

    await prisma.$transaction(
      books.map((book) =>
        prisma.book.update({
          where: { id: book.id },
          data: { sellingPrice: book.mrp, isOnSale: false },
        }),
      ),
    )

    return NextResponse.json({
      success: true,
      message: `${books.length} ಪುಸ್ತಕಗಳ ರಿಯಾಯಿತಿ ತೆಗೆದು ಹಾಕಲಾಗಿದೆ`,
      affectedCount: books.length,
    })
  } catch (error) {
    console.error('[global-discount] DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
