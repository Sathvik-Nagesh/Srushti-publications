import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'
import { hash } from 'bcryptjs'

// Helper to generate order number
function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000).toString()
  return `ORD-${year}${month}${day}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, shipping, items, totals, couponCode, notes, createAccount, password } = body

    // 1. Basic Validation
    if (!customer || !shipping || !items || items.length === 0 || !totals) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // 2. Generate Order Number
    const orderNumber = generateOrderNumber()

    // 3. Prepare Order Data and Create Order
    // We fetch books first to ensure we have stock and details for denormalization
    const books = await prisma.book.findMany({
        where: {
            id: { in: items.map((i: any) => i.bookId) }
        }
    })

    const bookMap = new Map(books.map(b => [b.id, b]))

    const finalOrder = await prisma.$transaction(async (tx) => {
        // Handle Customer Creation / Linking
        let customerId: string | null = null
        
        // Check if customer exists
        const existingCustomer = await tx.customer.findUnique({
            where: { email: customer.email }
        })

        if (existingCustomer) {
            customerId = existingCustomer.id
        } else if (createAccount) {
            // Create new customer
            const newCustomer = await tx.customer.create({
                data: {
                    email: customer.email,
                    name: customer.name,
                    phone: customer.phone,
                    address: shipping.address,
                    city: shipping.city,
                    state: shipping.state,
                    pincode: shipping.pincode,
                    isVerified: false,
                    passwordHash: password ? await hash(password, 10) : null
                }
            })
            customerId = newCustomer.id
        }

        // Decrease Stock
        for (const item of items) {
            const book = bookMap.get(item.bookId)
            if (!book) throw new Error(`Book not found: ${item.bookId}`)
            if (book.stockQuantity < item.quantity) throw new Error(`Insufficient stock: ${book.title}`)
            
            await tx.book.update({
                where: { id: item.bookId },
                data: { stockQuantity: { decrement: item.quantity } }
            })
        }
        
        // Update Coupon Usage
        if (couponCode) {
             // Find coupon first to get ID (assuming code is unique)
             // This assumes couponCode is verified. Ideally re-verify here.
             const offer = await tx.offer.findFirst({ where: { code: couponCode }})
             if (offer) {
                 await tx.offer.update({
                     where: { id: offer.id },
                     data: { usedCount: { increment: 1 } }
                 })
             }
        }

        // Create Order
        return await tx.order.create({
            data: {
              orderNumber,
              invoiceNumber: orderNumber,
              customerName: customer.name,
              customerEmail: customer.email,
              customerPhone: customer.phone,
              
              shippingAddress: shipping.address,
              shippingCity: shipping.city,
              shippingState: shipping.state,
              shippingPincode: shipping.pincode,
              
              subtotal: totals.subtotal,
              discount: totals.discount || 0,
              shippingCharge: totals.shipping,
              taxAmount: 0,
              totalAmount: totals.total,
              
              status: 'PENDING',
              paymentStatus: 'PENDING', 
              paymentMethod: 'COD',
              
              notes: notes,
              customerId: customerId, // Link the customer
              
              items: {
                  create: items.map((item: any) => {
                      const book = bookMap.get(item.bookId)!
                      return {
                          quantity: item.quantity,
                          unitPrice: item.price,
                          totalPrice: item.price * item.quantity,
                          discount: 0,
                          bookTitle: book.title,
                          bookAuthor: book.author,
                          bookCover: book.coverImage,
                          bookIsbn: book.isbn,
                          book: { connect: { id: item.bookId } } // Explicitly connect book relation
                      }
                  })
              }
            },
            include: {
                items: true
            }
        })
    })

    // 4. Send Confirmation Email (Async, don't block response)
    // We map the database order structure to the email utility's expected format
    const emailData = {
        orderNumber: finalOrder.orderNumber,
        customerName: finalOrder.customerName,
        customerEmail: finalOrder.customerEmail,
        customerPhone: finalOrder.customerPhone,
        items: finalOrder.items.map(item => ({
            title: item.bookTitle,
            author: item.bookAuthor,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
        })),
        subtotal: finalOrder.subtotal,
        discount: finalOrder.discount,
        shippingCharge: finalOrder.shippingCharge,
        taxAmount: finalOrder.taxAmount,
        totalAmount: finalOrder.totalAmount,
        shippingAddress: finalOrder.shippingAddress,
        shippingCity: finalOrder.shippingCity,
        shippingState: finalOrder.shippingState,
        shippingPincode: finalOrder.shippingPincode,
        paymentMethod: finalOrder.paymentMethod || 'COD'
    }

    // Trigger email send
    sendOrderConfirmation(emailData).catch(err => {
        console.error('Failed to send confirmation email:', err)
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: finalOrder.id,
      orderNumber: finalOrder.orderNumber
    }, { status: 201 })

  } catch (error: any) {
    console.error('Order Creation Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
