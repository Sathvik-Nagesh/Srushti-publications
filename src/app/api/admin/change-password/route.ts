import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, hashPassword } from '@/lib/password'
import { verifySessionToken, verifyAdminSession } from '@/lib/auth-edge'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// Get current admin user from session cookie
async function getAdminFromSession(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')
  if (!adminSession?.value) return null

  return verifySessionToken(adminSession.value)
}

// POST /api/admin/change-password - Change admin password (auto-update in database)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`admin_change_password:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Explicitly verify admin session for defense-in-depth authorization
    if (!(await verifyAdminSession(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು ಅಗತ್ಯವಿದೆ' },
        { status: 400 }
      )
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ' },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು ಇರಬೇಕು' },
        { status: 400 }
      )
    }
    
    // Get current admin from session
    const sessionData = await getAdminFromSession(request)
    
    if (sessionData?.userId) {
      // Database-based admin user
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: sessionData.userId }
      })
      
      if (!adminUser) {
        return NextResponse.json(
          { success: false, error: 'ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ' },
          { status: 404 }
        )
      }
      
      // Verify current password
      const isValid = await verifyPassword(currentPassword, adminUser.passwordHash)
      
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ' },
          { status: 401 }
        )
      }
      
      // Hash and update the new password
      const newPasswordHash = await hashPassword(newPassword)
      
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { 
          passwordHash: newPasswordHash,
          updatedAt: new Date()
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!'
      })
    }
    
    // Fallback: Environment variable based auth (legacy)
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminEmail = process.env.ADMIN_EMAIL
    
    // Verify current password against env vars
    let isValidPassword = false
    
    if (adminPasswordHash) {
      isValidPassword = await verifyPassword(currentPassword, adminPasswordHash)
    } else if (adminPassword) {
      isValidPassword = currentPassword === adminPassword
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ' },
        { status: 401 }
      )
    }
    
    // Hash the new password
    const newPasswordHash = await hashPassword(newPassword)
    
    // Try to find or create AdminUser in database
    if (adminEmail) {
      const existingUser = await prisma.adminUser.findUnique({
        where: { email: adminEmail.toLowerCase() }
      })
      
      if (existingUser) {
        // Update existing user
        await prisma.adminUser.update({
          where: { id: existingUser.id },
          data: { 
            passwordHash: newPasswordHash,
            updatedAt: new Date()
          }
        })
        
        return NextResponse.json({
          success: true,
          message: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!'
        })
      } else {
        // Create new admin user in database
        await prisma.adminUser.create({
          data: {
            email: adminEmail.toLowerCase(),
            passwordHash: newPasswordHash,
            name: 'Admin',
            role: 'superadmin',
            isActive: true
          }
        })
        
        return NextResponse.json({
          success: true,
          message: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ! ಡೇಟಾಬೇಸ್‌ಗೆ ಮೈಗ್ರೇಟ್ ಆಗಿದೆ.'
        })
      }
    }
    
    // If no email configured, return error
    return NextResponse.json({
      success: false,
      error: 'ADMIN_EMAIL ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. .env ಫೈಲ್‌ನಲ್ಲಿ ADMIN_EMAIL ಸೇರಿಸಿ.'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ' },
      { status: 500 }
    )
  }
}
