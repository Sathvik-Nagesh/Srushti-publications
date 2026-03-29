import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth-edge'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { books: { where: { isActive: true } } }
        }
      }
    })
    
    // Transform to include book count
    const categoriesWithCount = categories.map(category => ({
      ...category,
      bookCount: category._count.books,
      _count: undefined
    }))
    
    return NextResponse.json({
      success: true,
      data: categoriesWithCount
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category (Admin only)
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
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // 1. Check if name already exists (since name is @unique in schema)
    const existingCategory = await prisma.category.findUnique({
      where: { name: body.name }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'ಈ ಹೆಸರಿನ ವಿಭಾಗ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (Category with this name already exists)' },
        { status: 400 }
      )
    }

    // 2. Generate slug with collision protection
    let slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\w\s-\u0C80-\u0CFF]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Fallback for empty slug (if all chars were special/stripped)
    if (!slug) {
      slug = 'category-' + Date.now().toString(36)
    }

    // Ensure slug uniqueness (in case of collisions or manually entered slugs)
    let finalSlug = slug
    let counter = 1
    while (true) {
      const collision = await prisma.category.findUnique({
        where: { slug: finalSlug }
      })
      if (!collision) break
      finalSlug = `${slug}-${counter}`
      counter++
    }
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        nameEn: body.nameEn,
        slug: finalSlug,
        description: body.description,
        image: body.image,
        discount: body.discount ? parseFloat(body.discount) : null,
        discountStart: body.discountStart ? new Date(body.discountStart) : null,
        discountEnd: body.discountEnd ? new Date(body.discountEnd) : null,
        isActive: body.isActive !== false,
        sortOrder: parseInt(body.sortOrder) || 0
      }
    })
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
