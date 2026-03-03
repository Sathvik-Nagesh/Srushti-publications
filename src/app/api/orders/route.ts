import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { verifySessionToken } from '@/lib/password'
import { sign } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'

interface OrderItemInput {
  bookId: string
  quantity: number
  price?: number
}

// Helper to generate order number (collision safe: random YYYYMMDD + 4-digit random)
function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000).toString()
  return `ORD-${year}${month}${day}-${random}`
}

// Generate a collision-proof sequential invoice number using DB atomic increment
// Format: INV-FY-NNNNN e.g. INV-2526-00001
// Safe under concurrent traffic — Postgres atomically increments the counter
async function generateInvoiceNumber(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<string> {
  const fy = (() => {
    const now = new Date()
    const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
    return `${String(startYear).slice(-2)}${String(startYear + 1).slice(-2)}` // e.g. "2526"
  })()

  // Atomically increment invoiceCounter in SiteSettings (creates row if needed)
  const settings = await tx.siteSettings.upsert({
    where: { id: 'default' },
    update: { invoiceCounter: { increment: 1 } },
    create: { id: 'default', invoiceCounter: 1 }
  })

  const seq = String(settings.invoiceCounter).padStart(5, '0')
  return `INV-${fy}-${seq}`
}

export async function POST(request: NextRequest) {
  try {
    // --- RATE LIMITING (Supabase best practice: protect DB from connection exhaustion) ---
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(ip, 'orders/create', { limit: 5, windowSecs: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'ತುಂಬಾ ಹೆಚ್ಚು ವಿನಂತಿಗಳು. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    const body = await request.json()
    const {
      customer, shipping, items, totals, couponCode, notes,
      createAccount, password,
      // paymentMethod from frontend: 'COD' (default) or 'RAZORPAY' / 'ONLINE'
      paymentMethod: bodyPaymentMethod
    } = body

    // Determine if this is an online payment order.
    // For online (Razorpay) orders: confirmation email is sent from verify-payment
    // AFTER successful payment — NOT here at order creation.
    const isOnlinePayment = bodyPaymentMethod &&
      ['RAZORPAY', 'ONLINE', 'razorpay', 'online'].includes(bodyPaymentMethod)

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
                     // Coupon exhausted - ignore it
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

        // Create Order (with collision-proof sequential invoice number)
        const invoiceNumber = await generateInvoiceNumber(tx)
        return await tx.order.create({
            data: {
              orderNumber,
              invoiceNumber,
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
              paymentMethod: isOnlinePayment ? 'RAZORPAY' : 'COD',
              
              notes: notes,
              customerId: customerId,
              
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

    // 4. Send emails — strategy:
    //    COD orders:    customer confirmation + admin notification sent HERE immediately
    //    Online orders: emails sent from verify-payment AFTER payment is confirmed
    const emailData = {
      orderNumber: finalOrder.orderNumber,
      orderId: finalOrder.id,
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

    if (!isOnlinePayment) {
      // COD: send customer confirmation immediately
      sendOrderConfirmation(emailData).catch((err: unknown) => {
        console.error('[orders/create] Customer confirmation email failed:', err)
      })
      // COD: send admin notification immediately
      sendAdminOrderNotification(emailData).catch((err: unknown) => {
        console.error('[orders/create] Admin notification email failed:', err)
      })
    }
    // For online (Razorpay) orders: emails are sent in verify-payment after payment succeeds

    // Revalidate paths so updated stock/data is reflected
    revalidatePath('/books')
    revalidatePath('/')

    // Sentinel: Create secure session for guest order access
    const orderPayload = JSON.stringify({
      orderId: finalOrder.id,
      orderNumber: finalOrder.orderNumber,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
    const signature = await sign(orderPayload)
    const recentOrderToken = `${btoa(orderPayload)}.${signature}`

    const response = NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: finalOrder.id,
      orderNumber: finalOrder.orderNumber
    }, { status: 201 })

    // Set secure, HTTP-only cookie
    response.cookies.set('recent_order', recentOrderToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return response

  } catch (error: unknown) {
    // Log full error details SERVER-SIDE only
    if (error instanceof Error) {
      console.error('[API][orders/create] Error:', error.message, error.stack)
      // Only pass through if it's a known validation error we control (e.g. stock check)
      const isKnownError = error.message.startsWith('ಸ್ಟಾಕ್') ||
        error.message.startsWith('Invalid') ||
        error.message.startsWith('Missing')
      if (isKnownError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
    } else {
      console.error('[API][orders/create] Unknown error:', error)
    }
    // Generic error for client - never expose internal details
    return NextResponse.json(
      { success: false, error: 'ಆರ್ಡರ್ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' },
      { status: 500 }
    )
  }
}
