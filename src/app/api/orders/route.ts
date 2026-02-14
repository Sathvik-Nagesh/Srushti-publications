import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'
import { hash } from 'bcryptjs'
import { verifySessionToken } from '@/lib/password'
import { cookies } from 'next/headers'

interface OrderItemInput {
  bookId: string
  quantity: number
  price?: number
}

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

    // Check authentication for address updates
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('customer_session')?.value
    let isVerifiedUser = false
    let verifiedUserId: string | undefined = undefined

    if (sessionToken) {
      const tokenData = await verifySessionToken(sessionToken)
      if (tokenData.valid && tokenData.email === customer.email) {
        isVerifiedUser = true
        verifiedUserId = tokenData.userId
      }
    }

    // 2. Generate Order Number
    const orderNumber = generateOrderNumber()

    // 3. Prepare Order Data and Create Order
    // We fetch books first to ensure we have stock and details for denormalization
    const books = await prisma.book.findMany({
        where: {
            id: { in: items.map((i: OrderItemInput) => i.bookId) }
        }
    })

    const bookMap = new Map(books.map(b => [b.id, b]))

    // Validate all items exist
    for (const item of items) {
        if (!bookMap.has(item.bookId)) {
            return NextResponse.json(
                { success: false, error: `Book not found: ${item.bookId}` },
                { status: 400 }
            )
        }
    }

    // 🛡️ SECURITY: Calculate totals server-side to prevent manipulation
    // Fetch site settings for shipping logic
    const settings = await prisma.siteSettings.findFirst()
    const freeShippingMin = settings?.freeShippingMin ?? 500
    const defaultShipping = settings?.defaultShipping ?? 50

    // Calculate subtotal from DB prices
    let serverSubtotal = 0
    items.forEach((item: OrderItemInput) => {
        const book = bookMap.get(item.bookId)
        if (book) {
             serverSubtotal += book.sellingPrice * item.quantity
        }
    })

    // Calculate Shipping
    const serverShipping = serverSubtotal >= freeShippingMin ? 0 : defaultShipping

    const finalOrder = await prisma.$transaction(async (tx) => {
        // Handle Customer Creation / Linking
        let customerId: string | null = null
        
        // Check if customer exists
        const existingCustomer = await tx.customer.findUnique({
            where: { email: customer.email }
        })

        if (existingCustomer) {
            customerId = existingCustomer.id
            
            // 🛡️ SECURITY: Only update address if user is authenticated and matches
            // Prevents unauthenticated users from overwriting existing customer addresses
            if (body.saveAddress && isVerifiedUser && verifiedUserId === existingCustomer.id) {
                await tx.customer.update({
                    where: { id: existingCustomer.id },
                    data: {
                        address: shipping.address,
                        city: shipping.city,
                        state: shipping.state,
                        pincode: shipping.pincode
                    }
                })
            }
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

        // 🛡️ SECURITY: Validate stock availability but DO NOT decrement yet
        // Stock is decremented ONLY after successful payment (in verify-payment route)
        // This prevents double-decrementation and allows proper stock restoration on failed payments
        const quantityMap = new Map<string, number>()
        for (const item of items) {
            const current = quantityMap.get(item.bookId) || 0
            quantityMap.set(item.bookId, current + item.quantity)
        }

        for (const [bookId, totalQuantity] of quantityMap.entries()) {
            const book = bookMap.get(bookId)
            if (!book) throw new Error(`Book not found: ${bookId}`)
            if (book.stockQuantity < totalQuantity) {
                throw new Error(`ಸ್ಟಾಕ್ ಇಲ್ಲ: ${book.title}. ಲಭ್ಯವಿರುವುದು: ${book.stockQuantity}`)
            }
        }
        
        // Calculate Discount & Update Coupon Usage
        let serverDiscount = 0
        if (couponCode) {
             const now = new Date()
             const offer = await tx.offer.findFirst({
                 where: {
                     code: couponCode,
                     isActive: true,
                     startDate: { lte: now },
                     endDate: { gte: now }
                 }
             })

             if (offer) {
                 // Verify limits
                 if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
                     // Coupon exhausted - ignore it (or could throw error)
                 } else if (offer.minPurchase && serverSubtotal < offer.minPurchase) {
                     // Min purchase not met - ignore
                 } else {
                     // Calculate discount
                     if (offer.discountType === 'percentage') {
                         serverDiscount = Math.round((serverSubtotal * offer.discountValue) / 100)
                         if (offer.maxDiscount && serverDiscount > offer.maxDiscount) {
                             serverDiscount = offer.maxDiscount
                         }
                     } else {
                         serverDiscount = offer.discountValue
                     }

                     await tx.offer.update({
                         where: { id: offer.id },
                         data: { usedCount: { increment: 1 } }
                     })
                 }
             }
        }

        const serverTotal = Math.max(0, serverSubtotal + serverShipping - serverDiscount)

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
              
              subtotal: serverSubtotal,
              discount: serverDiscount,
              shippingCharge: serverShipping,
              taxAmount: 0,
              totalAmount: serverTotal,
              
              status: 'PENDING',
              paymentStatus: 'PENDING', 
              paymentMethod: 'COD',
              
              notes: notes,
              customerId: customerId, // Link the customer
              
              items: {
                  create: items.map((item: OrderItemInput) => {
                      const book = bookMap.get(item.bookId)!
                      return {
                          quantity: item.quantity,
                          unitPrice: book.sellingPrice, // 🛡️ Use DB price
                          totalPrice: book.sellingPrice * item.quantity, // 🛡️ Use DB price
                          discount: 0,
                          bookTitle: book.title,
                          bookAuthor: book.author,
                          bookCover: book.coverImage,
                          bookIsbn: book.isbn,
                          book: { connect: { id: item.bookId } }
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
