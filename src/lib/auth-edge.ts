// Edge-compatible authentication utilities using Web Crypto API

const getSecretKey = () => {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: ADMIN_SECRET environment variable is required in production.');
    }
    console.warn('SECURITY WARNING: ADMIN_SECRET is not set. Using insecure fallback for development only.');
    return 'fallback-secret-key-change-this-in-production';
  }

  return secret;
};

const SECRET_KEY = getSecretKey();

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
}
