import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
// Use the SAME PBKDF2 hasher as login — bcryptjs hashes are incompatible with verifyPassword()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (same protection level as forgot-password)
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`reset_password:${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'ಟೋಕನ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು' },
        { status: 400 }
      )
    }

    // Find user with a valid, unexpired token
    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date() // Token must not be expired
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'ಅಮಾನ್ಯ ಅಥವಾ ಅವಧಿ ಮೀರಿದ ಲಿಂಕ್. ದಯವಿಟ್ಟು ಹೊಸ ಲಿಂಕ್ ಪಡೆಯಿರಿ.' },
        { status: 400 }
      )
    }

    // ✅ CRITICAL FIX: Use the SAME PBKDF2 hasher as login route (src/lib/password.ts)
    // The old code used bcryptjs here, but login uses PBKDF2 — causing login failure after reset
    const passwordHash = await hashPassword(password)

    // Update customer: set new password and CLEAR the reset token (one-time use)
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash,
        resetToken: null,       // Invalidate immediately — link cannot be reused
        resetTokenExp: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಈಗ ಲಾಗಿನ್ ಮಾಡಿ.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'ಆಂತರಿಕ ಸರ್ವರ್ ದೋಷ' },
      { status: 500 }
    )
  }
}
