import { NextRequest, NextResponse } from 'next/server'

// Simple text-based invoice (for demo - in production use pdfkit or similar)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params
  
  // Mock order data - in real app, fetch from database
  const order = {
    orderNumber,
    invoiceNumber: `INV-${orderNumber}`,
    date: new Date().toLocaleDateString('kn-IN'),
    customerName: 'ರಾಜೇಶ್ ಕುಮಾರ್',
    customerAddress: '123, ಜಯನಗರ, ಬೆಂಗಳೂರು - 560041',
    customerPhone: '9876543210',
    items: [
      { name: 'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', qty: 2, price: 399, total: 798 },
      { name: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', qty: 1, price: 495, total: 495 }
    ],
    subtotal: 1293,
    discount: 106,
    shipping: 0,
    total: 1187
  }

  // Generate simple HTML invoice
  const html = `
<!DOCTYPE html>
<html lang="kn">
<head>
  <meta charset="UTF-8">
  <title>ಇನ್ವಾಯ್ಸ್ - ${order.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #d97706; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #d97706; }
    .invoice-title { font-size: 28px; color: #333; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
    .info-box h3 { font-size: 14px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
    .info-box p { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #ddd; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .text-right { text-align: right; }
    .totals { width: 300px; margin-left: auto; }
    .totals tr td { padding: 8px 12px; }
    .totals .total-row { font-size: 18px; font-weight: bold; background: #d97706; color: white; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</div>
      <p style="font-size: 12px; color: #666;">Srushti Publications</p>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">ಇನ್ವಾಯ್ಸ್</div>
      <p><strong>${order.invoiceNumber}</strong></p>
      <p style="font-size: 14px; color: #666;">ದಿನಾಂಕ: ${order.date}</p>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>ಗ್ರಾಹಕ ವಿವರಗಳು</h3>
      <p><strong>${order.customerName}</strong></p>
      <p>${order.customerAddress}</p>
      <p>ಫೋನ್: ${order.customerPhone}</p>
    </div>
    <div class="info-box">
      <h3>ಕಂಪನಿ ವಿವರಗಳು</h3>
      <p><strong>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</strong></p>
      <p>ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ</p>
      <p>GSTIN: 29XXXXX1234X1Z5</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>ಪುಸ್ತಕ</th>
        <th class="text-right">ಪ್ರಮಾಣ</th>
        <th class="text-right">ಬೆಲೆ</th>
        <th class="text-right">ಒಟ್ಟು</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td class="text-right">${item.qty}</td>
          <td class="text-right">₹${item.price}</td>
          <td class="text-right">₹${item.total}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals">
    <tr><td>ಉಪಮೊತ್ತ</td><td class="text-right">₹${order.subtotal}</td></tr>
    <tr><td>ರಿಯಾಯಿತಿ</td><td class="text-right">-₹${order.discount}</td></tr>
    <tr><td>ಶಿಪ್ಪಿಂಗ್</td><td class="text-right">${order.shipping === 0 ? 'ಉಚಿತ' : '₹' + order.shipping}</td></tr>
    <tr class="total-row"><td>ಒಟ್ಟು ಮೊತ್ತ</td><td class="text-right">₹${order.total}</td></tr>
  </table>

  <div class="footer">
    <p>ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಆರ್ಡರ್‌ಗೆ ನಾವು ಕೃತಜ್ಞರಾಗಿದ್ದೇವೆ.</p>
    <p style="margin-top: 8px;">📧 srushtinagesh@gmail.com | 📞 +91 98450 96668</p>
    <p style="margin-top: 16px; font-size: 10px;">ಈ ಇನ್ವಾಯ್ಸ್ ಕಂಪ್ಯೂಟರ್ ಮೂಲಕ ರಚಿಸಲಾಗಿದೆ ಮತ್ತು ಸಹಿ ಅಗತ್ಯವಿಲ್ಲ.</p>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    }
  })
}
