import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession, verifySessionToken as verifyGuestToken } from '@/lib/auth-edge'
import { verifySessionToken as verifyCustomerToken } from '@/lib/password'


// GET /api/invoice/[orderNumber] - Generate invoice for order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params
  
  try {
    // Fetch real order from database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // 🛡️ SECURITY: Authorization Check
    let authorized = false

    // 1. Admin Access
    if (await verifyAdminSession(request)) {
      authorized = true
    }

    // 2. Customer Access (Owner)
    if (!authorized) {
      const customerSession = request.cookies.get('customer_session')?.value
      if (customerSession) {
        const tokenData = await verifyCustomerToken(customerSession)
        if (tokenData.valid) {
          // Check if customer ID matches or if customer email matches
          if (
            (order.customerId && order.customerId === tokenData.userId) ||
            (tokenData.email && order.customerEmail === tokenData.email)
          ) {
            authorized = true
          }
        }
      }
    }

    // 3. Guest Access (Recent Order Token)
    if (!authorized) {
      const recentOrderToken = request.cookies.get('recent_order')?.value
      if (recentOrderToken) {
        const payload = await verifyGuestToken(recentOrderToken)
        if (payload) {
          if (payload.orderId === order.id || payload.orderNumber === order.orderNumber) {
            authorized = true
          }
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to invoice' },
        { status: 403 }
      )
    }

    const invoiceNumber = order.invoiceNumber || `INV-${orderNumber}`
    const orderDate = new Date(order.createdAt).toLocaleDateString('kn-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Calculate GST breakdown (Only if tax exists)
    const baseAmount = order.subtotal - (order.discount || 0)
    
    // We trust the DB taxAmount. If it's 0, we don't show tax.
    const hasTax = (order.taxAmount || 0) > 0
    const cgst = hasTax ? (order.taxAmount / 2) : 0
    const sgst = hasTax ? (order.taxAmount / 2) : 0
    
    // Generate professional HTML invoice
    const html = `
<!DOCTYPE html>
<html lang="kn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ಇನ್ವಾಯ್ಸ್ - ${invoiceNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Noto Sans Kannada', Arial, sans-serif; 
      padding: 20px; 
      max-width: 800px; 
      margin: 0 auto; 
      background: #f5f5f5;
      color: #333;
    }
    .invoice-container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 40px; 
      border-bottom: 3px solid #d97706; 
      padding-bottom: 24px; 
    }
    .logo { font-size: 28px; font-weight: 700; color: #d97706; letter-spacing: -0.5px; }
    .logo-sub { font-size: 12px; color: #666; margin-top: 4px; }
    .invoice-title { font-size: 32px; color: #333; font-weight: 700; }
    .invoice-meta { text-align: right; margin-top: 8px; }
    .invoice-meta p { margin: 4px 0; font-size: 14px; color: #666; }
    .invoice-meta strong { color: #333; font-weight: 600; }
    
    .info-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 40px; 
      margin-bottom: 40px; 
    }
    .info-box h3 { 
      font-size: 12px; 
      color: #888; 
      margin-bottom: 12px; 
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .info-box p { margin-bottom: 6px; font-size: 14px; line-height: 1.5; }
    .info-box p strong { font-weight: 600; font-size: 16px; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    thead { background: #f8f8f8; }
    th { 
      padding: 14px 12px; 
      text-align: left; 
      font-size: 12px; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      color: #666;
      border-bottom: 2px solid #e0e0e0; 
    }
    td { 
      padding: 16px 12px; 
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    tbody tr:hover { background: #fafafa; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    .totals-section {
      display: flex;
      justify-content: flex-end;
    }
    .totals { 
      width: 320px; 
      background: #fafafa;
      border-radius: 8px;
      overflow: hidden;
    }
    .totals tr td { padding: 12px 16px; font-size: 14px; }
    .totals tr:not(:last-child) td { border-bottom: 1px solid #eee; }
    .totals .total-row { 
      font-size: 18px; 
      font-weight: 700; 
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%); 
      color: white; 
    }
    .totals .discount-row { color: #10b981; }
    
    .footer { 
      margin-top: 40px; 
      text-align: center; 
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
    .footer p { font-size: 13px; color: #666; margin: 6px 0; }
    .footer .contact { 
      display: flex; 
      justify-content: center; 
      gap: 24px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    .footer .contact span { display: flex; align-items: center; gap: 6px; }
    .footer .legal { 
      font-size: 11px; 
      color: #999; 
      margin-top: 16px;
      padding: 12px;
      background: #f8f8f8;
      border-radius: 6px;
    }
    
    .stamp {
      position: relative;
      margin-top: 30px;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 8px;
      text-align: center;
      border: 2px dashed #10b981;
    }
    .stamp h4 {
      color: #10b981;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .stamp p { font-size: 12px; color: #666; }
    
    .print-btn {
      display: block;
      margin: 20px auto;
      padding: 12px 32px;
      background: #d97706;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .print-btn:hover { background: #b45309; }
    
    @media print { 
      body { padding: 0; background: white; }
      .invoice-container { box-shadow: none; }
      .print-btn { display: none; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</div>
        <p class="logo-sub">Srushti Publications • ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್ಲೈನ್ ಮಳಿಗೆ</p>
      </div>
      <div>
        <div class="invoice-title">ತೆರಿಗೆ ಇನ್ವಾಯ್ಸ್</div>
        <div class="invoice-meta">
          <p><strong>${invoiceNumber}</strong></p>
          <p>ದಿನಾಂಕ: ${orderDate}</p>
          <p>ಆರ್ಡರ್: ${orderNumber}</p>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>ಬಿಲ್ ಮಾಡಲಾಗಿದೆ / ಶಿಪ್ ಮಾಡಲಾಗಿದೆ</h3>
        <p><strong>${order.customerName}</strong></p>
        <p>${order.shippingAddress}</p>
        <p>${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}</p>
        <p>📞 ${order.customerPhone}</p>
        <p>📧 ${order.customerEmail}</p>
      </div>
      <div class="info-box">
        <h3>ಮಾರಾಟಗಾರ ವಿವರಗಳು</h3>
        <p><strong>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</strong></p>
        <p>ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ</p>
        <p>📞 +91 98450 96668</p>
        <p>📧 srushtinagesh@gmail.com</p>
        <p style="margin-top: 8px; padding: 4px 8px; background: #fef3c7; border-radius: 4px; display: inline-block;">
          <strong>GSTIN:</strong> 29XXXXX1234X1Z5
        </p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%">ಪುಸ್ತಕ ವಿವರಗಳು</th>
          <th class="text-center" style="width: 12%">ಪ್ರಮಾಣ</th>
          <th class="text-right" style="width: 19%">ಏಕಮಾನ ಬೆಲೆ</th>
          <th class="text-right" style="width: 19%">ಮೊತ್ತ</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>
              <strong>${item.bookTitle}</strong>
              <br><span style="font-size: 12px; color: #666;">ಲೇಖಕ: ${item.bookAuthor}</span>
              ${item.bookIsbn ? `<br><span style="font-size: 11px; color: #999;">ISBN: ${item.bookIsbn}</span>` : ''}
            </td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
            <td class="text-right"><strong>₹${item.totalPrice.toFixed(2)}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-section">
      <table class="totals">
        <tr><td>ಉಪಮೊತ್ತ</td><td class="text-right">₹${order.subtotal.toFixed(2)}</td></tr>
        ${order.discount > 0 ? `<tr class="discount-row"><td>ರಿಯಾಯಿತಿ</td><td class="text-right">-₹${order.discount.toFixed(2)}</td></tr>` : ''}
        ${hasTax ? `
        <tr><td>CGST (2.5%)</td><td class="text-right">₹${cgst.toFixed(2)}</td></tr>
        <tr><td>SGST (2.5%)</td><td class="text-right">₹${sgst.toFixed(2)}</td></tr>
        ` : ''}
        <tr><td>ಶಿಪ್ಪಿಂಗ್</td><td class="text-right">${order.shippingCharge === 0 ? '<span style="color:#10b981">ಉಚಿತ</span>' : `₹${order.shippingCharge.toFixed(2)}`}</td></tr>
        <tr class="total-row"><td>ಒಟ್ಟು ಮೊತ್ತ</td><td class="text-right">₹${order.totalAmount.toFixed(2)}</td></tr>
      </table>
    </div>

    ${order.paymentStatus === 'SUCCESS' ? `
    <div class="stamp">
      <h4>✓ ಪಾವತಿಸಲಾಗಿದೆ</h4>
      <p>ಪಾವತಿ ದಿನಾಂಕ: ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('kn-IN') : orderDate}</p>
    </div>
    ` : ''}

    <div class="footer">
      <p style="font-size: 15px; font-weight: 500;">🙏 ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಆರ್ಡರ್‌ಗೆ ನಾವು ಕೃತಜ್ಞರಾಗಿದ್ದೇವೆ.</p>
      <div class="contact">
        <span>📧 srushtinagesh@gmail.com</span>
        <span>📞 +91 98450 96668</span>
        <span>🌐 srushtipublications.com</span>
      </div>
      <div class="legal">
        ಈ ಇನ್ವಾಯ್ಸ್ ಕಂಪ್ಯೂಟರ್ ಮೂಲಕ ರಚಿಸಲಾಗಿದೆ ಮತ್ತು ಸಹಿ ಅಗತ್ಯವಿಲ್ಲ. • ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.
      </div>
    </div>
  </div>
  
  <button class="print-btn no-print" onclick="window.print()">🖨️ ಪ್ರಿಂಟ್ / ಡೌನ್‌ಲೋಡ್ PDF</button>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
