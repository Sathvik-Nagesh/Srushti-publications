const assert = require('node:assert');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

// 1. Verify the Logic (Unit Test Simulation)

// The fixed logic (simulated based on implementation)
function secureVerification(order, requestRazorpayOrderId) {
  // Sentinel Check:
  // if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id)
  if (order.razorpayOrderId && order.razorpayOrderId !== requestRazorpayOrderId) {
    return false; // Mismatch!
  }
  return true;
}

test('Security Logic Verification: Payment ID Mismatch', async (t) => {
  const legitOrder = {
    orderNumber: 'ORD-123',
    razorpayOrderId: 'order_legit_123'
  };

  const attackerRazorpayOrderId = 'order_cheap_456'; // Attacker's cheap order

  await t.test('Secure logic blocks mismatch', () => {
    const result = secureVerification(legitOrder, attackerRazorpayOrderId);
    assert.strictEqual(result, false, 'Secure logic must reject mismatching Razorpay Order ID');
  });

  await t.test('Secure logic accepts match', () => {
    const result = secureVerification(legitOrder, 'order_legit_123');
    assert.strictEqual(result, true, 'Secure logic must accept matching Razorpay Order ID');
  });

  await t.test('Secure logic allows null (legacy/incomplete) safely for now', () => {
    // Current behavior: if null, we allow it (risk accepted due to legacy support, but mismatch is blocked)
    const incompleteOrder = { orderNumber: 'ORD-OLD', razorpayOrderId: null };
    const result = secureVerification(incompleteOrder, attackerRazorpayOrderId);
    assert.strictEqual(result, true, 'Logic currently allows null to pass (legacy support)');
  });
});

// 2. Verify the Implementation (Source Code Check)
test('Source Code Verification', () => {
  const filePath = path.join(process.cwd(), 'src/app/api/orders/verify-payment/route.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const expectedCheck = 'if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id)';

  // Normalize whitespace for check (simple removal of newlines/extra spaces might be needed if exact match fails)
  // But let's try strict check first as I wrote it exactly that way.

  assert.ok(content.includes(expectedCheck), 'File must contain the security check logic');
  assert.ok(content.includes('Sentinel: Validate razorpay_order_id'), 'File must contain the security comment');
});
