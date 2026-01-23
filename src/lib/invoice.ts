/**
 * Invoice Generator for Srushti Publications
 * Generates GST-compliant invoices in HTML format (can be converted to PDF)
 */

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: Date
  orderNumber: string
  
  // Seller Details
  sellerName: string
  sellerAddress: string
  sellerGstin: string
  sellerPhone: string
  sellerEmail: string
  
  // Buyer Details
  buyerName: string
  buyerAddress: string
  buyerPhone: string
  buyerEmail: string
  buyerState: string
  
  // Items
  items: Array<{
    slNo: number
    description: string
    hsn: string
    qty: number
    rate: number
    amount: number
  }>
  
  // Totals
  subtotal: number
  discount: number
  shippingCharge: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  grandTotal: number
  
  // GST Info
  isSameState: boolean
  gstRate: number
  
  // Payment
  paymentMethod?: string
  paymentStatus: string
  razorpayPaymentId?: string
}

// Convert number to words (Indian format)
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  
  if (num === 0) return 'Zero'
  
  function convertLessThanThousand(n: number): string {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '')
  }
  
  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const remainder = num % 1000
  
  let result = ''
  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore '
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh '
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand '
  if (remainder > 0) result += convertLessThanThousand(remainder)
  
  return result.trim() + ' Rupees Only'
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #d97706; }
    .logo { font-size: 24px; font-weight: bold; color: #d97706; }
    .logo-kannada { font-family: 'Noto Sans Kannada', sans-serif; font-size: 20px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 28px; color: #d97706; margin-bottom: 5px; }
    .invoice-meta { font-size: 11px; color: #666; }
    
    .parties { display: flex; justify-content: space-between; margin: 20px 0; gap: 20px; }
    .party { flex: 1; padding: 15px; background: #f9f9f9; border-radius: 8px; }
    .party h3 { color: #d97706; margin-bottom: 10px; font-size: 13px; text-transform: uppercase; }
    .party p { margin: 3px 0; }
    .gstin { font-weight: bold; color: #059669; }
    
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
    th { background: #d97706; color: white; font-weight: 600; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    
    .summary { display: flex; justify-content: flex-end; margin: 20px 0; }
    .summary-table { width: 300px; }
    .summary-table td { padding: 8px; border: none; }
    .summary-table .label { text-align: right; padding-right: 20px; }
    .summary-table .total { font-weight: bold; font-size: 16px; color: #d97706; border-top: 2px solid #d97706; }
    
    .amount-words { background: #fef3c7; padding: 12px; border-radius: 8px; margin: 20px 0; }
    .amount-words strong { color: #d97706; }
    
    .gst-info { display: flex; gap: 20px; margin: 20px 0; }
    .gst-box { flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
    .gst-box h4 { color: #d97706; margin-bottom: 10px; }
    
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; }
    .terms { flex: 1; font-size: 10px; color: #666; }
    .signature { text-align: right; }
    .signature-line { border-top: 1px solid #333; width: 150px; margin-top: 40px; padding-top: 5px; }
    
    .stamp { position: absolute; right: 50px; bottom: 100px; opacity: 0.3; transform: rotate(-15deg); }
    .stamp-text { border: 3px solid #059669; color: #059669; padding: 10px 20px; font-size: 18px; font-weight: bold; border-radius: 8px; }
    
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .invoice { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div>
        <div class="logo">
          <span class="logo-kannada">ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</span>
        </div>
        <div style="font-size: 14px; margin-top: 5px;">Srushti Publications</div>
        <div style="font-size: 11px; color: #666; margin-top: 5px;">
          ${data.sellerAddress}<br>
          📞 ${data.sellerPhone} | ✉ ${data.sellerEmail}
        </div>
      </div>
      <div class="invoice-title">
        <h1>TAX INVOICE</h1>
        <div class="invoice-meta">
          <p><strong>Invoice No:</strong> ${data.invoiceNumber}</p>
          <p><strong>Date:</strong> ${formatDate(data.invoiceDate)}</p>
          <p><strong>Order No:</strong> ${data.orderNumber}</p>
        </div>
      </div>
    </div>
    
    <div class="parties">
      <div class="party">
        <h3>Sold By (Seller)</h3>
        <p><strong>${data.sellerName}</strong></p>
        <p>${data.sellerAddress}</p>
        <p class="gstin">GSTIN: ${data.sellerGstin}</p>
        <p>State: Karnataka (29)</p>
      </div>
      <div class="party">
        <h3>Bill To (Buyer)</h3>
        <p><strong>${data.buyerName}</strong></p>
        <p>${data.buyerAddress}</p>
        <p>📞 ${data.buyerPhone}</p>
        <p>✉ ${data.buyerEmail}</p>
        <p>State: ${data.buyerState}</p>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 40px;">Sl.</th>
          <th>Description</th>
          <th class="text-center" style="width: 80px;">HSN</th>
          <th class="text-center" style="width: 50px;">Qty</th>
          <th class="text-right" style="width: 100px;">Rate (₹)</th>
          <th class="text-right" style="width: 100px;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td class="text-center">${item.slNo}</td>
            <td>${item.description}</td>
            <td class="text-center">${item.hsn}</td>
            <td class="text-center">${item.qty}</td>
            <td class="text-right">${item.rate.toFixed(2)}</td>
            <td class="text-right">${item.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="summary">
      <table class="summary-table">
        <tr>
          <td class="label">Subtotal:</td>
          <td class="text-right">₹${data.subtotal.toFixed(2)}</td>
        </tr>
        ${data.discount > 0 ? `
          <tr>
            <td class="label">Discount:</td>
            <td class="text-right" style="color: #059669;">-₹${data.discount.toFixed(2)}</td>
          </tr>
        ` : ''}
        <tr>
          <td class="label">Shipping:</td>
          <td class="text-right">${data.shippingCharge === 0 ? 'FREE' : `₹${data.shippingCharge.toFixed(2)}`}</td>
        </tr>
        ${data.isSameState ? `
          <tr>
            <td class="label">CGST (${data.gstRate / 2}%):</td>
            <td class="text-right">₹${data.cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">SGST (${data.gstRate / 2}%):</td>
            <td class="text-right">₹${data.sgst.toFixed(2)}</td>
          </tr>
        ` : `
          <tr>
            <td class="label">IGST (${data.gstRate}%):</td>
            <td class="text-right">₹${data.igst.toFixed(2)}</td>
          </tr>
        `}
        <tr class="total">
          <td class="label">Grand Total:</td>
          <td class="text-right">₹${data.grandTotal.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    
    <div class="amount-words">
      <strong>Amount in Words:</strong> ${numberToWords(Math.round(data.grandTotal))}
    </div>
    
    <div class="gst-info">
      <div class="gst-box">
        <h4>Tax Summary</h4>
        <table style="margin: 0; font-size: 11px;">
          <tr>
            <td>Taxable Amount:</td>
            <td class="text-right">₹${(data.subtotal - data.discount).toFixed(2)}</td>
          </tr>
          ${data.isSameState ? `
            <tr><td>CGST:</td><td class="text-right">₹${data.cgst.toFixed(2)}</td></tr>
            <tr><td>SGST:</td><td class="text-right">₹${data.sgst.toFixed(2)}</td></tr>
          ` : `
            <tr><td>IGST:</td><td class="text-right">₹${data.igst.toFixed(2)}</td></tr>
          `}
          <tr style="font-weight: bold;">
            <td>Total Tax:</td>
            <td class="text-right">₹${data.totalTax.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      <div class="gst-box">
        <h4>Payment Details</h4>
        <p><strong>Status:</strong> <span style="color: ${data.paymentStatus === 'SUCCESS' ? '#059669' : '#d97706'};">${data.paymentStatus}</span></p>
        <p><strong>Method:</strong> ${data.paymentMethod || 'Online'}</p>
        ${data.razorpayPaymentId ? `<p><strong>Transaction ID:</strong> ${data.razorpayPaymentId}</p>` : ''}
      </div>
    </div>
    
    <div class="footer">
      <div class="terms">
        <h4>Terms & Conditions:</h4>
        <ol style="padding-left: 15px; margin-top: 5px;">
          <li>Goods once sold will not be taken back.</li>
          <li>All disputes are subject to Karnataka jurisdiction.</li>
          <li>E&OE (Errors and Omissions Excepted)</li>
        </ol>
      </div>
      <div class="signature">
        <p><strong>For Srushti Publications</strong></p>
        <div class="signature-line">Authorized Signatory</div>
      </div>
    </div>
    
    ${data.paymentStatus === 'SUCCESS' ? `
      <div class="stamp">
        <span class="stamp-text">PAID</span>
      </div>
    ` : ''}
  </div>
</body>
</html>
  `
}

// Generate invoice data from order
export function prepareInvoiceData(order: {
  orderNumber: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  subtotal: number
  discount: number
  shippingCharge: number
  taxAmount: number
  gstBreakup?: { cgst: number; sgst: number; igst: number } | null
  totalAmount: number
  paymentStatus: string
  paymentMethod?: string
  razorpayPaymentId?: string
  createdAt: Date
  items: Array<{
    bookTitle: string
    bookAuthor: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}): InvoiceData {
  const isSameState = order.shippingState === 'Karnataka' || order.shippingState === 'KA'
  const gstRate = 5 // 5% GST for books in India
  
  const gstBreakup = order.gstBreakup || {
    cgst: isSameState ? order.taxAmount / 2 : 0,
    sgst: isSameState ? order.taxAmount / 2 : 0,
    igst: !isSameState ? order.taxAmount : 0
  }
  
  return {
    invoiceNumber: order.invoiceNumber,
    invoiceDate: order.createdAt,
    orderNumber: order.orderNumber,
    
    sellerName: 'Srushti Publications',
    sellerAddress: 'Bangalore, Karnataka, India - 560001',
    sellerGstin: process.env.GST_NUMBER || '29XXXXX1234X1Z5',
    sellerPhone: '+91 XXXXXXXXXX',
    sellerEmail: 'support@srushtipublications.com',
    
    buyerName: order.customerName,
    buyerAddress: `${order.shippingAddress}, ${order.shippingCity} - ${order.shippingPincode}`,
    buyerPhone: order.customerPhone,
    buyerEmail: order.customerEmail,
    buyerState: order.shippingState,
    
    items: order.items.map((item, index) => ({
      slNo: index + 1,
      description: `${item.bookTitle} by ${item.bookAuthor}`,
      hsn: '4901', // HSN code for printed books
      qty: item.quantity,
      rate: item.unitPrice,
      amount: item.totalPrice
    })),
    
    subtotal: order.subtotal,
    discount: order.discount,
    shippingCharge: order.shippingCharge,
    cgst: gstBreakup.cgst,
    sgst: gstBreakup.sgst,
    igst: gstBreakup.igst,
    totalTax: order.taxAmount,
    grandTotal: order.totalAmount,
    
    isSameState,
    gstRate,
    
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    razorpayPaymentId: order.razorpayPaymentId || undefined
  }
}

export { numberToWords }
