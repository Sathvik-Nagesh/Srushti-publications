// Edge-compatible authentication utilities using standard JWT
import { NextRequest } from 'next/server'
import { getAdminSecret } from './config'
import { SignJWT, jwtVerify } from 'jose'

function getEncodedKey() {
  return new TextEncoder().encode(getAdminSecret())
}

/**
 * Sign data using HMAC-SHA256 standard JWT
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signData(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.exp ? Math.floor(payload.exp / 1000) : '24h')
    .sign(getEncodedKey())
}

/**
 * Verify session token string
 * @param token The standard JWT string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifySessionToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedKey())
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Verify admin session from request cookies
 * @param request NextRequest
 */
export async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const adminSession = request.cookies.get('admin_session')
  if (!adminSession?.value) return false

  const data = await verifySessionToken(adminSession.value)
  return !!data
}
