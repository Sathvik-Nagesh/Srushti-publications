import { NextRequest, NextResponse } from 'next/server'
import { sign } from '@/lib/auth-edge'
import prisma from '@/lib/prisma'
import { verifyPassword, hashPassword, secureCompare } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// Pre-calculated hash for timing attack mitigation
// Generated from 'dummy_password_for_timing_mitigation'
const DUMMY_HASH = '79b5c4854423467682992e025278301e9a032790006fa170cf03d65daa857ed1:4892e3b9905ea6cf5bc84cf25f40e2d471dfebd495f5451d1c0086d0b26c0d09523ec3cffa10d015267781fcd91b15130e01ed2f333ff32ed53bf24dedde2888'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`admin_login:${ip}`, { windowMs: 60000, maxRequests: 5 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please wait.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // First try database authentication
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (adminUser) {
      // Database-based auth with hashed password
      if (!adminUser.isActive) {
        return NextResponse.json(
          { success: false, error: 'Account is disabled' },
          { status: 401 }
        )
      }

      const isValid = await verifyPassword(password, adminUser.passwordHash)

      if (isValid) {
        // Update last login
        await prisma.adminUser.update({
          where: { id: adminUser.id },
          data: { lastLoginAt: new Date() }
        })

        // Create signed session token
        const payload = JSON.stringify({
          type: 'admin',
          userId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        })
        const signature = await sign(payload)
        const token = `${btoa(payload)}.${signature}`

        const response = NextResponse.json({ 
          success: true,
          role: adminUser.role,
          name: adminUser.name
        })

        response.cookies.set('admin_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 // 1 day
        })

        return response
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    } else {
      // Sentinel: Prevent user enumeration via timing attacks
      // Even if user is not found, verify a dummy password to simulate the time cost
      await verifyPassword(password, DUMMY_HASH)
    }

    // Fallback to environment variable authentication (for initial setup)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (adminEmail && adminPassword && await secureCompare(email, adminEmail) && await secureCompare(password, adminPassword)) {
      // Create admin user in database with hashed password for future logins
      const passwordHash = await hashPassword(adminPassword)
      
      const newAdmin = await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: { lastLoginAt: new Date() },
        create: {
          email: adminEmail,
          passwordHash,
          name: 'Admin',
          role: 'superadmin',
          isActive: true
        }
      })

      // Create signed session token
      const payload = JSON.stringify({
        type: 'admin',
        userId: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role
      })
      const signature = await sign(payload)
      const token = `${btoa(payload)}.${signature}`

      const response = NextResponse.json({ 
        success: true,
        message: 'Admin account created in database. Future logins will use secure hashing.'
      })

      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
