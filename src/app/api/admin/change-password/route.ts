import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// POST /api/admin/change-password - Change admin password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match' },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
    
    // Get current admin password from environment
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    const adminPassword = process.env.ADMIN_PASSWORD
    
    // Verify current password
    let isValidPassword = false
    
    if (adminPasswordHash) {
      // If we have a hash, compare with bcrypt
      isValidPassword = await bcrypt.compare(currentPassword, adminPasswordHash)
    } else if (adminPassword) {
      // Fallback to plain text comparison (for initial setup)
      isValidPassword = currentPassword === adminPassword
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      )
    }
    
    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    
    // In a production environment, you would update this in your database
    // or a secure configuration store. For now, we'll return instructions.
    
    // Since we can't modify environment variables at runtime,
    // we'll return the new hash for manual update
    return NextResponse.json({
      success: true,
      message: 'Password validated! Please update your environment variables.',
      instructions: [
        '1. Update your .env file with:',
        `   ADMIN_PASSWORD_HASH="${newPasswordHash}"`,
        '2. Remove or comment out ADMIN_PASSWORD',
        '3. Restart your server',
        '4. Login with your new password'
      ],
      newPasswordHash
    })
    
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
