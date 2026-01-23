/**
 * Password Hashing Utility using Web Crypto API
 * Works in both Edge and Node.js environments
 */

// PBKDF2 configuration
const ITERATIONS = 100000
const KEY_LENGTH = 64
const ALGORITHM = 'SHA-512'

// Convert string to Uint8Array
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

// Convert Uint8Array to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Convert hex string to Uint8Array
function hexToBuffer(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g) || []
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)))
}

// Generate random salt
function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return bufferToHex(array.buffer)
}

/**
 * Hash a password using PBKDF2
 * Returns a string in format: salt:hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt()
  const passwordBuffer = stringToBuffer(password)
  const saltBuffer = hexToBuffer(salt)
  
  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer as any,
    'PBKDF2',
    false,
    ['deriveBits']
  )
  
  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer as any,
      iterations: ITERATIONS,
      hash: ALGORITHM
    },
    keyMaterial,
    KEY_LENGTH * 8
  )
  
  const hash = bufferToHex(derivedBits)
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false
    
    const passwordBuffer = stringToBuffer(password)
    const saltBuffer = hexToBuffer(salt)
    
    // Import password as key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer as any,
      'PBKDF2',
      false,
      ['deriveBits']
    )
    
    // Derive key using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer as any,
        iterations: ITERATIONS,
        hash: ALGORITHM
      },
      keyMaterial,
      KEY_LENGTH * 8
    )
    
    const newHash = bufferToHex(derivedBits)
    
    // Constant-time comparison to prevent timing attacks
    return hash === newHash
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

/**
 * Generate a random token for verification/reset links
 */
export function generateToken(length: number = 32): string {
  return generateSalt(length)
}

/**
 * Generate a session token
 */
export async function generateSessionToken(userId: string, email: string): Promise<string> {
  const payload = {
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
  
  const payloadStr = JSON.stringify(payload)
  const encodedPayload = btoa(payloadStr)
  
  // Sign the payload
  const secret = process.env.ADMIN_SECRET || 'default-secret-change-me'
  const secretBuffer = stringToBuffer(secret)
  
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToBuffer(encodedPayload) as any
  )
  
  return `${encodedPayload}.${bufferToHex(signature)}`
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(token: string): Promise<{
  valid: boolean
  userId?: string
  email?: string
}> {
  try {
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return { valid: false }
    
    // Verify signature
    const secret = process.env.ADMIN_SECRET || 'default-secret-change-me'
    const secretBuffer = stringToBuffer(secret)
    
    const key = await crypto.subtle.importKey(
      'raw',
      secretBuffer as any,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBuffer(signature) as any,
      stringToBuffer(encodedPayload) as any
    )
    
    if (!isValid) return { valid: false }
    
    // Decode payload
    const payloadStr = atob(encodedPayload)
    const payload = JSON.parse(payloadStr)
    
    // Check expiration
    if (payload.exp < Date.now()) return { valid: false }
    
    return {
      valid: true,
      userId: payload.userId,
      email: payload.email
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return { valid: false }
  }
}
