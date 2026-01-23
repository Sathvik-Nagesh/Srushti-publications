import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateSessionToken } from '@/lib/password'

// POST /api/auth/create-account - Create account from guest order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, orderNumber } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'ಹೆಸರು, ಇ-ಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯ' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingCustomer) {
      // If customer exists but has no password (from checkout), set password
      if (!existingCustomer.passwordHash) {
        const passwordHash = await hashPassword(password)
        
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            passwordHash,
            name: name || existingCustomer.name,
            phone: phone || existingCustomer.phone
          }
        })

        // Generate session
        const sessionToken = await generateSessionToken(existingCustomer.id, existingCustomer.email)

        const response = NextResponse.json({
          success: true,
          message: 'ಖಾತೆ ಆಕ್ಟಿವೇಟ್ ಆಗಿದೆ!'
        })

        response.cookies.set('customer_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        })

        return response
      } else {
        return NextResponse.json(
          { success: false, error: 'ಈ ಇ-ಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.' },
          { status: 400 }
        )
      }
    }

    // Get order to prefill address
    let orderData = null
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        select: {
          customerEmail: true,
          shippingAddress: true,
          shippingCity: true,
          shippingState: true,
          shippingPincode: true
        }
      })
      
      if (order && order.customerEmail.toLowerCase() === email.toLowerCase()) {
        orderData = order
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone: phone || null,
        address: orderData?.shippingAddress,
        city: orderData?.shippingCity,
        state: orderData?.shippingState || 'Karnataka',
        pincode: orderData?.shippingPincode,
        isVerified: true
      }
    })

    // Link all orders with this email to the customer
    await prisma.order.updateMany({
      where: { customerEmail: email.toLowerCase() },
      data: { customerId: customer.id }
    })

    // Generate session token
    const sessionToken = await generateSessionToken(customer.id, customer.email)

    const response = NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      },
      message: 'ಖಾತೆ ರಚಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಹಿಂದಿನ ಆರ್ಡರ್‌ಗಳನ್ನು ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ.'
    })

    response.cookies.set('customer_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return response
  } catch (error) {
    console.error('Account creation error:', error)
    return NextResponse.json(
      { success: false, error: 'ಖಾತೆ ರಚನೆ ವಿಫಲ' },
      { status: 500 }
    )
  }
}
