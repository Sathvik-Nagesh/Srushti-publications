// Edge-compatible authentication utilities using Web Crypto API

/**
 * Get the secret key for signing/verification
 * In production, ADMIN_SECRET must be set in environment variables
 * In development, a fallback is used for convenience
 */
function getSecretKey(): string {
  const secret = process.env.ADMIN_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // In production, log warning but don't crash - use a generated fallback
      // This allows the app to run but sessions won't persist across deploys
      console.warn('⚠️ ADMIN_SECRET not set in production. Please add it to environment variables.')
      return 'temporary-fallback-' + (process.env.VERCEL_URL || 'local')
    }
    // Development fallback
    return 'development-secret-key-change-in-production'
  }
  
  return secret
}

const SECRET_KEY = getSecretKey()

async function getKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY);
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

