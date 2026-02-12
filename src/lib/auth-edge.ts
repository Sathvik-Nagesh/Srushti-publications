// Edge-compatible authentication utilities using Web Crypto API
import { NextRequest } from 'next/server'
import { getAdminSecret } from './config'

async function getKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(getAdminSecret());
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign data using HMAC-SHA256
 */
export async function sign(data: string): Promise<string> {
  const key = await getKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );

  // Convert buffer to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify data against signature
 */
export async function verify(data: string, signature: string): Promise<boolean> {
  try {
    const key = await getKey();
    const encoder = new TextEncoder();

    // Convert hex string to buffer
    const signatureBuffer = new Uint8Array(
      signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    return crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(data)
    );
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Verify session token string
 * @param token The token string (payload.signature)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifySessionToken(token: string): Promise<any | null> {
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [encodedPayload, signature] = parts

  try {
    const payload = atob(encodedPayload)
    const isValid = await verify(payload, signature)

    if (!isValid) return null

    const data = JSON.parse(payload)

    // Check expiration if present
    if (data.exp && Date.now() > data.exp) {
      return null
    }

    return data
  } catch {
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
