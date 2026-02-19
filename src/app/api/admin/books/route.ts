import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0C00-\u0C7F]+/g, '') // Remove Kannada chars – will be supplemented by titleEn
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || `book-${Date.now()}`
}

// GET /api/admin/books - List all books including inactive (admin only)
export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) where.categoryId = categoryId

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: { category: { select: { id: true, name: true, nameEn: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.book.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: books,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[ADMIN] Error listing books:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST /api/admin/books - Create a new book (admin only)
export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const {
      title, titleEn, author, authorEn, description, descriptionEn,
      categoryId, mrp, sellingPrice, stockQuantity, lowStockAlert,
      isbn, pages, publicationYear, edition, language, weight, dimensions,
      coverImage, coverImagePublicId,
      isNewRelease, isBestSeller, isOnSale, isFeatured, isActive,
    } = body

    // Required field validation
    if (!title || !author || !categoryId || !mrp || !sellingPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, author, categoryId, mrp, sellingPrice' },
        { status: 400 }
      )
    }

    // Generate slug from English title or Kannada title
    const baseSlug = slugify(titleEn || title)
    let slug = baseSlug
    let counter = 1
    while (await prisma.book.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    const book = await prisma.book.create({
      data: {
        title,
        titleEn: titleEn || null,
        slug,
        author,
        authorEn: authorEn || null,
        description: description || null,
        descriptionEn: descriptionEn || null,
        categoryId,
        mrp: parseFloat(mrp),
        sellingPrice: parseFloat(sellingPrice),
        stockQuantity: parseInt(stockQuantity) || 0,
        lowStockAlert: parseInt(lowStockAlert) || 5,
        isbn: isbn || null,
        pages: pages ? parseInt(pages) : null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        edition: edition || null,
        language: language || 'ಕನ್ನಡ',
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        coverImage: coverImage || null,
        coverImagePublicId: coverImagePublicId || null,
        isNewRelease: Boolean(isNewRelease),
        isBestSeller: Boolean(isBestSeller),
        isOnSale: Boolean(isOnSale),
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== false,
      },
      include: { category: true },
    })

    return NextResponse.json({
      success: true,
      data: book,
      message: 'Book created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN] Error creating book:', error)
    return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 500 })
  }
}
