import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'ಟೋಕನ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ' },
        { status: 400 }
      )
    }

    // Find user with valid token
    // We can't query by token easily because Customer model doesn't have @unique on resetToken
    // So we need to find first. Given tokens are long random strings, collision is negligible,
    // but better to check.
    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date() // Expiry must be in future
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'ಅಮಾನ್ಯ ಅಥವಾ ಅವಧಿ ಮೀರಿದ ಟೋಕನ್' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'ಆಂತರಿಕ ಸರ್ವರ್ ದೋಷ' },
      { status: 500 }
    )
  }
}
