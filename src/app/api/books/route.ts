import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/books - Get all books with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const inStock = searchParams.get('inStock') === 'true'
    const isNewRelease = searchParams.get('isNewRelease') === 'true'
    const isBestSeller = searchParams.get('isBestSeller') === 'true'
    const isOnSale = searchParams.get('isOnSale') === 'true'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    let includeInactive = searchParams.get('includeInactive') === 'true' // For admin use

    // Verify admin if requesting inactive books
    if (includeInactive && !(await verifyAdminSession(request))) {
      includeInactive = false
    }
    
    // Build where clause
    const where: Record<string, unknown> = {
      sellingPrice: {
        gte: minPrice,
        lte: maxPrice
      }
    }
    
    // Only filter by isActive if NOT including inactive (normal user view)
    if (!includeInactive) {
      where.isActive = true
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { authorEn: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Category filter
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    // Stock filter
    if (inStock) {
      where.stockQuantity = { gt: 0 }
    }
    
    // Label filters
    if (isNewRelease) {
      where.isNewRelease = true
    }
    if (isBestSeller) {
      where.isBestSeller = true
    }
    if (isOnSale) {
      where.isOnSale = true
    }
    
    // Author filter
    const author = searchParams.get('author')
    if (author) {
      where.OR = [
        ...(where.OR as any[] || []),
        { author: { contains: author, mode: 'insensitive' } },
        { authorEn: { contains: author, mode: 'insensitive' } },
      ]
    }
    
    // Build order by
    let orderBy: Record<string, string>[] = []
    switch (sortBy) {
      case 'price_asc':
        orderBy = [{ sellingPrice: 'asc' }]
        break
      case 'price_desc':
        orderBy = [{ sellingPrice: 'desc' }]
        break
      case 'popular':
        orderBy = [{ salesCount: 'desc' }]
        break
      case 'title':
        orderBy = [{ title: 'asc' }]
        break
      case 'newest':
      default:
        orderBy = [{ createdAt: 'desc' }]
    }
    
    // Get total count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = await prisma.book.count({ where: where as any })
    
    // Get books with pagination
    const books = await prisma.book.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: where as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: orderBy as any,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        coverImage: true,
        mrp: true,
        sellingPrice: true,
        stockQuantity: true,
        isNewRelease: true,
        isBestSeller: true,
        isOnSale: true,
        category: {
            select: {
                id: true,
                name: true,
                slug: true
            }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        items: books,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST /api/books - Create a new book (Admin only)
export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'author', 'description', 'categoryId', 'mrp', 'sellingPrice']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36)
    
    // Create book
    const book = await prisma.book.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        slug,
        author: body.author,
        authorEn: body.authorEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        coverImage: body.coverImage || '/placeholder-book.jpg',
        additionalImages: body.additionalImages || [],
        mrp: parseFloat(body.mrp),
        sellingPrice: parseFloat(body.sellingPrice),
        discount: body.discount ? parseFloat(body.discount) : null,
        discountStart: body.discountStart ? new Date(body.discountStart) : null,
        discountEnd: body.discountEnd ? new Date(body.discountEnd) : null,
        stockQuantity: parseInt(body.stockQuantity) || 0,
        lowStockAlert: parseInt(body.lowStockAlert) || 10,
        isbn: body.isbn,
        pages: body.pages ? parseInt(body.pages) : null,
        publicationYear: body.publicationYear ? parseInt(body.publicationYear) : null,
        edition: body.edition,
        language: body.language || 'ಕನ್ನಡ',
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions,
        isNewRelease: Boolean(body.isNewRelease),
        isBestSeller: Boolean(body.isBestSeller),
        isOnSale: Boolean(body.isOnSale),
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
        newReleaseUntil: body.newReleaseUntil ? new Date(body.newReleaseUntil) : null,
        categoryId: body.categoryId
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: book,
      message: 'Book created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
