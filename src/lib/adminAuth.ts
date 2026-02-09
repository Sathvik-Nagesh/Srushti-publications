import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

/**
 * @deprecated This file contains legacy authentication logic and should not be used.
 * Please use the secure authentication implementation in src/app/api/admin/login/route.ts
 */

// Simple session-based admin auth
// For production, use a proper auth library like NextAuth.js

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// In-memory session store (use Redis/DB for production)
const sessions = new Map<string, { email: string; expiresAt: number }>()

// Clean up expired sessions periodically
function cleanupSessions() {
  const now = Date.now()
  for (const [key, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(key)
    }
  }
}

// Generate secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Verify admin credentials
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  // Get admin credentials from environment
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return false
  }
  
  return email === adminEmail && password === adminPassword
}

// Create session
export async function createSession(email: string): Promise<string> {
  cleanupSessions()
  
  const token = generateSessionToken()
  const expiresAt = Date.now() + SESSION_DURATION
  
  sessions.set(token, { email, expiresAt })
  
  return token
}

// Validate session
export function validateSession(token: string): { valid: boolean; email?: string } {
  cleanupSessions()
  
  const session = sessions.get(token)
  if (!session) {
    return { valid: false }
  }
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(token)
    return { valid: false }
  }
  
  return { valid: true, email: session.email }
}

// Destroy session
export function destroySession(token: string): void {
  sessions.delete(token)
}

// Middleware helper to check admin auth
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requireAdminAuth(request: NextRequest): Promise<{ 
  authenticated: boolean
  email?: string 
  response?: NextResponse 
}> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  
  if (!sessionToken) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
  }
  
  const session = validateSession(sessionToken)
  if (!session.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      )
    }
  }
  
  return { authenticated: true, email: session.email }
}

// Get session cookie config
export function getSessionCookieConfig(token: string, maxAge: number = SESSION_DURATION / 1000) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge
  }
}

export { ADMIN_SESSION_COOKIE }
