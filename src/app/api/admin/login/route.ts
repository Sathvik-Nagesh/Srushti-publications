import { NextRequest, NextResponse } from 'next/server'
import { sign } from '@/lib/auth-edge'
import prisma from '@/lib/prisma'
import { verifyPassword, hashPassword, secureCompare } from '@/lib/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

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
      // Verify password first to prevent timing leak regarding account status
      const isValid = await verifyPassword(password, adminUser.passwordHash)

      if (isValid) {
        if (!adminUser.isActive) {
          return NextResponse.json(
            { success: false, error: 'Account is disabled' },
            { status: 401 }
          )
        }

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
          role: adminUser.role,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
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
    }

    // Fallback to environment variable authentication (for initial setup)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    // Check environment variables first (fast)
    const isEnvAuth = adminEmail && adminPassword &&
                      await secureCompare(email, adminEmail) &&
                      await secureCompare(password, adminPassword)

    if (isEnvAuth) {
      // Create admin user in database with hashed password for future logins
      const passwordHash = await hashPassword(adminPassword!)
      
      const newAdmin = await prisma.adminUser.upsert({
        where: { email: adminEmail! },
        update: { lastLoginAt: new Date() },
        create: {
          email: adminEmail!,
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
        role: newAdmin.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
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

    // Sentinel: Mitigation for Timing Attacks
    // If user is not found in DB and env auth fails, we must simulate the time taken
    // by verifyPassword to prevent username enumeration via timing analysis.
    //
    // Without this, invalid emails return faster (DB lookup + env check) than
    // valid emails with wrong passwords (DB lookup + verifyPassword).
    // verifyPassword does PBKDF2 derivation which is intentionally slow.
    const DUMMY_HASH = '281460c9a61d6f0a1a27bc928e3c4d82c746b4f5dddf855094dba658358217f5:c201606a0f614674fc5e6c68ba2afdc34da9032a22581c31e5892fcf3cd6e3b15f34bf5348efbad23de4d38f3b6bc02b1d247dd915c29767129c1c900298a4d3'
    if (!adminUser) {
      await verifyPassword(password, DUMMY_HASH)
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
