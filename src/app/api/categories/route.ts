import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Generate slug
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        nameEn: body.nameEn,
        slug,
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
