import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Create Razorpay order
export async function createRazorpayOrder(
  amount: number,
  receipt: string,
  notes?: Record<string, string>
) {
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency: 'INR',
    receipt,
    notes: notes || {},
  }

  const order = await razorpay.orders.create(options)
  return order
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  } catch (_) {
    // timingSafeEqual throws if buffers are of different lengths
    return false
  }
}

// Get payment details
export async function getPaymentDetails(paymentId: string) {
  return razorpay.payments.fetch(paymentId)
}

// Refund payment
export async function refundPayment(paymentId: string, amount?: number) {
  return razorpay.payments.refund(paymentId, {
    amount: amount ? Math.round(amount * 100) : undefined,
  })
}
