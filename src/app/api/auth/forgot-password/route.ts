import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendPasswordReset } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ' },
        { status: 400 }
      )
    }

    // Find user
    const customer = await prisma.customer.findUnique({
      where: { email }
    })

    // Security: Don't reveal if user exists or not, but for UX we often do validation.
    // However, if user doesn't exist, we just pretend success to prevent enumeration?
    // For this e-commerce, user enumeration isn't a huge critical risk compared to UX.
    // But let's follow best practice: always return success, but only send email if user exists.
    
    if (customer) {
      // Generate token
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 3600000) // 1 hour

      // Update user with token
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          resetToken: token,
          resetTokenExp: expires
        }
      })

      // Send email
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
      await sendPasswordReset(email, customer.name, resetLink)
    }

    return NextResponse.json({
      success: true,
      message: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'ಆಂತರಿಕ ಸರ್ವರ್ ದೋಷ' },
      { status: 500 }
    )
  }
}
