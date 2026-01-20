import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createRazorpayOrder } from '@/lib/razorpay'
import { generateOrderNumber, generateInvoiceNumber, calculateGST } from '@/lib/utils'

// GET /api/orders - Get all orders (Admin) or order by orderNumber
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // If orderNumber is provided, return single order
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  coverImage: true
                }
              }
            }
          }
        }
      })
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: order
      })
    }
    
    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }
    
    // Get total count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = await prisma.order.count({ where: where as any })
    
    // Get orders with pagination
    const orders = await prisma.order.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        items: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingPincode', 'items']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must have at least one item' },
        { status: 400 }
      )
    }
    
    // Fetch book details and validate stock
    const bookIds = body.items.map((item: { bookId: string }) => item.bookId)
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds }, isActive: true }
    })
    
    if (books.length !== bookIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more books not found' },
        { status: 400 }
      )
    }
    
    // Check stock availability
    for (const item of body.items) {
      const book = books.find(b => b.id === item.bookId)
      if (book && book.stockQuantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${book.title}` },
          { status: 400 }
        )
      }
    }
    
    // Calculate totals
    let subtotal = 0
    const orderItems = body.items.map((item: { bookId: string; quantity: number }) => {
      const book = books.find(b => b.id === item.bookId)!
      const totalPrice = book.sellingPrice * item.quantity
      subtotal += totalPrice
      
      return {
        quantity: item.quantity,
        unitPrice: book.sellingPrice,
        totalPrice,
        discount: (book.mrp - book.sellingPrice) * item.quantity,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.coverImage,
        bookIsbn: book.isbn,
        bookId: book.id
      }
    })
    
    // Calculate GST (Karnataka is same state)
    const isSameState = body.shippingState === 'Karnataka' || body.shippingState === 'KA'
    const gst = calculateGST(subtotal, isSameState)
    
    // Calculate shipping (free above ₹500)
    const shippingCharge = subtotal >= 500 ? 0 : 50
    
    // Generate order number
    const orderNumber = generateOrderNumber()
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingPincode: body.shippingPincode,
        subtotal,
        discount: orderItems.reduce((acc: number, item: { discount: number }) => acc + item.discount, 0),
        shippingCharge,
        taxAmount: gst.totalTax,
        totalAmount: subtotal + gst.totalTax + shippingCharge,
        gstBreakup: gst,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        invoiceNumber: generateInvoiceNumber(orderNumber),
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    })
    
    // Create Razorpay order
    let razorpayOrder = null
    try {
      razorpayOrder = await createRazorpayOrder(
        order.totalAmount,
        order.orderNumber,
        {
          orderId: order.id,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone
        }
      )
      
      // Update order with Razorpay order ID
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id }
      })
    } catch (razorpayError) {
      console.error('Razorpay order creation failed:', razorpayError)
      // Continue without Razorpay - order is created, payment can be attempted later
    }
    
    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...order,
          razorpayOrderId: razorpayOrder?.id
        },
        razorpayOrder
      },
      message: 'Order created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
