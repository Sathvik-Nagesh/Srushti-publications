const crypto = require('crypto').webcrypto;

// Mock getAdminSecret
const getAdminSecret = () => 'development-secret-key-change-in-production';

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

async function sign(data: string): Promise<string> {
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

async function verify(data: string, signature: string): Promise<boolean> {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifySessionToken(token: string): Promise<any | null> {
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

async function test() {
    console.log('Testing auth logic...');

    // Simulate POST logic
    const payloadData = {
      orderId: '12345',
      orderNumber: 'ORD-12345',
      exp: Date.now() + 86400000 // 24 hours
    };
    const payload = JSON.stringify(payloadData);

    // Sign
    const signature = await sign(payload);
    const token = `${btoa(payload)}.${signature}`;

    console.log('Generated Token:', token);

    // Simulate GET logic
    const verified = await verifySessionToken(token);
    console.log('Verified Payload:', verified);

    if (verified && verified.orderId === '12345') {
        console.log('✅ PASS: Token generation and verification works!');
    } else {
        console.error('❌ FAIL: Verification failed!');
        process.exit(1);
    }
}

test();
