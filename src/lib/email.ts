/**
 * Email Service for Srushti Publications
 * Handles order confirmations, shipping updates, etc.
 */

import prisma from './prisma'

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    title: string
    author: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  discount: number
  shippingCharge: number
  taxAmount: number
  totalAmount: number
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  paymentMethod?: string
  invoiceUrl?: string
}

interface ShippingUpdateData {
  orderNumber: string
  customerName: string
  customerEmail: string
  courierName: string
  trackingNumber: string
  trackingUrl?: string
  estimatedDelivery?: string
}

// Email templates in Kannada
const emailTemplates = {
  orderConfirmation: (data: OrderEmailData) => ({
    subject: `ಆರ್ಡರ್ ದೃಢೀಕರಣ - #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
    .order-item { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #d97706; padding-top: 12px; margin-top: 12px; }
    .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; }
    .address-box { background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0; }
    h1 { margin: 0; }
    .btn { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ</p>
    </div>
    
    <div class="content">
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="success-badge">✓ ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ</span>
      </div>
      
      <p>ಪ್ರಿಯ ${data.customerName},</p>
      <p>ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!</p>
      
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong>ಆರ್ಡರ್ ಸಂಖ್ಯೆ:</strong> #${data.orderNumber}
      </div>
      
      <h3 style="border-bottom: 2px solid #d97706; padding-bottom: 8px;">ಆರ್ಡರ್ ವಿವರಗಳು</h3>
      
      ${data.items.map(item => `
        <div class="order-item">
          <div style="flex: 1;">
            <strong>${item.title}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">${item.author} × ${item.quantity}</span>
          </div>
          <div style="text-align: right; font-weight: 500;">
            ₹${item.totalPrice.toFixed(2)}
          </div>
        </div>
      `).join('')}
      
      <div style="margin-top: 16px;">
        <div class="summary-row">
          <span>ಉಪಮೊತ್ತ</span>
          <span>₹${data.subtotal.toFixed(2)}</span>
        </div>
        ${data.discount > 0 ? `
          <div class="summary-row" style="color: #10b981;">
            <span>ರಿಯಾಯಿತಿ</span>
            <span>-₹${data.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span>ಶಿಪ್ಪಿಂಗ್</span>
          <span>${data.shippingCharge === 0 ? 'ಉಚಿತ' : `₹${data.shippingCharge.toFixed(2)}`}</span>
        </div>
        ${data.taxAmount > 0 ? `
        <div class="summary-row">
          <span>GST</span>
          <span>₹${data.taxAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="summary-row total-row">
          <span>ಒಟ್ಟು</span>
          <span style="color: #d97706;">₹${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="address-box">
        <strong>📍 ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ</strong><br>
        ${data.customerName}<br>
        ${data.shippingAddress}<br>
        ${data.shippingCity}, ${data.shippingState} - ${data.shippingPincode}<br>
        📞 ${data.customerPhone}
      </div>
      
      <p style="background: #dbeafe; padding: 12px; border-radius: 8px; font-size: 14px;">
        📦 ನಿಮ್ಮ ಆರ್ಡರ್ 5-7 ವ್ಯಾಪಾರ ದಿನಗಳಲ್ಲಿ ತಲುಪುತ್ತದೆ. ರವಾನೆಯಾದಾಗ ನಿಮಗೆ ಟ್ರ್ಯಾಕಿಂಗ್ ವಿವರಗಳನ್ನು ಕಳುಹಿಸುತ್ತೇವೆ.
      </p>
      
      ${data.invoiceUrl ? `<a href="${data.invoiceUrl}" class="btn">📄 ಇನ್‌ವಾಯ್ಸ್ ಡೌನ್‌ಲೋಡ್</a>` : ''}
    </div>
    
    <div class="footer">
      <p>ಸಂಪರ್ಕ: support@srushtipublications.com | 📞 +91 XXXXXXXXXX</p>
      <p>© ${new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
ಆರ್ಡರ್ ದೃಢೀಕರಣ - #${data.orderNumber}

ಪ್ರಿಯ ${data.customerName},

ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!

ಆರ್ಡರ್ ಸಂಖ್ಯೆ: #${data.orderNumber}
ಒಟ್ಟು: ₹${data.totalAmount.toFixed(2)}

ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ:
${data.shippingAddress}
${data.shippingCity}, ${data.shippingState} - ${data.shippingPincode}

ನಿಮ್ಮ ಆರ್ಡರ್ 5-7 ವ್ಯಾಪಾರ ದಿನಗಳಲ್ಲಿ ತಲುಪುತ್ತದೆ.

ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್
    `
  }),

  shippingUpdate: (data: ShippingUpdateData) => ({
    subject: `ಶಿಪ್ಮೆಂಟ್ ಅಪ್ಡೇಟ್ - #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
    .tracking-box { background: #ecfdf5; border: 2px dashed #10b981; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }
    h1 { margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 ಶಿಪ್ ಆಗಿದೆ!</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">ನಿಮ್ಮ ಆರ್ಡರ್ ಮಾರ್ಗದಲ್ಲಿದೆ</p>
    </div>
    
    <div class="content">
      <p>ಪ್ರಿಯ ${data.customerName},</p>
      <p>ನಿಮ್ಮ ಆರ್ಡರ್ <strong>#${data.orderNumber}</strong> ರವಾನೆಯಾಗಿದೆ!</p>
      
      <div class="tracking-box">
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ</div>
        <div style="font-size: 24px; font-weight: bold; color: #059669; letter-spacing: 2px;">${data.trackingNumber}</div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">ಕೊರಿಯರ್: ${data.courierName}</div>
        ${data.estimatedDelivery ? `<div style="font-size: 14px; margin-top: 8px;">📅 ಅಂದಾಜು ಡೆಲಿವರಿ: ${data.estimatedDelivery}</div>` : ''}
      </div>
      
      ${data.trackingUrl ? `<p style="text-align: center;"><a href="${data.trackingUrl}" class="btn">🔍 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ</a></p>` : ''}
      
      <p style="background: #fef3c7; padding: 12px; border-radius: 8px; font-size: 14px;">
        💡 ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ದಯವಿಟ್ಟು ಸಿಂಧುತ್ವದ ಐಡಿ ಪ್ರೂಫ್ ಇಟ್ಟುಕೊಳ್ಳಿ.
      </p>
    </div>
    
    <div class="footer">
      <p>ಸಂಪರ್ಕ: support@srushtipublications.com</p>
      <p>© ${new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
ಶಿಪ್ಮೆಂಟ್ ಅಪ್ಡೇಟ್ - #${data.orderNumber}

ಪ್ರಿಯ ${data.customerName},

ನಿಮ್ಮ ಆರ್ಡರ್ ರವಾನೆಯಾಗಿದೆ!

ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ: ${data.trackingNumber}
ಕೊರಿಯರ್: ${data.courierName}

ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್
    `
  }),

  passwordReset: (data: { customerName: string, resetLink: string }) => ({
    subject: `ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d97706; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .btn { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</h1>
      <p>ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ</p>
    </div>
    
    <div class="content">
      <p>ನಮಸ್ಕಾರ ${data.customerName},</p>
      <p>ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮರುಹೊಂದಿಸಲು ವಿನಂತಿಯನ್ನು ನಾವು ಸ್ವೀಕರಿಸಿದ್ದೇವೆ.</p>
      <p>ಕೆಳಗಿನ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ನೀವು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಹೊಂದಿಸಬಹುದು:</p>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${data.resetLink}" class="btn">ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ</a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">ಈ ಲಿಂಕ್ 1 ಗಂಟೆಯವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.</p>
      <p style="font-size: 14px; color: #6b7280;">ನೀವು ಇದನ್ನು ವಿನಂತಿಸದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್ ಅನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ.</p>
    </div>
    
    <div class="footer">
      <p>ಸಂಪರ್ಕ: support@srushtipublications.com</p>
      <p>© ${new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ - ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್

ನಮಸ್ಕಾರ ${data.customerName},

ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮರುಹೊಂದಿಸಲು ಕೆಳಗಿನ ಲಿಂಕ್ ಬಳಸಿ:
${data.resetLink}

ಈ ಲಿಂಕ್ 1 ಗಂಟೆಯವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.
    `
  }),

  deliveryConfirmation: (data: { 
    orderNumber: string, 
    customerName: string, 
    customerEmail: string 
  }) => ({
    subject: `ಡೆಲಿವರಿ ಯಶಸ್ವಿ! - #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Kannada', Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
    .success-icon { font-size: 48px; margin-bottom: 16px; }
    .btn { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 8px; }
    .btn-outline { background: transparent; border: 2px solid #d97706; color: #d97706; }
    h1 { margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>ಡೆಲಿವರಿ ಯಶಸ್ವಿ!</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Your order has been delivered</p>
    </div>
    
    <div class="content">
      <p>ಪ್ರಿಯ ${data.customerName},</p>
      <p>ನಿಮ್ಮ ಆರ್ಡರ್ <strong>#${data.orderNumber}</strong> ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿದೆ!</p>
      
      <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <p style="font-size: 18px; margin: 0 0 16px 0;">ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ</p>
        <p style="color: #6b7280; margin: 0 0 16px 0;">Share your experience and help other readers</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://srushtipublications.com'}/account" class="btn">⭐ ಪುಸ್ತಕ ರಿವ್ಯೂ ಬರೆಯಿರಿ</a>
      </div>
      
      <p style="background: #fef3c7; padding: 12px; border-radius: 8px; font-size: 14px;">
        💬 ಸಮಸ್ಯೆಯಿದ್ದರೆ ದಯವಿಟ್ಟು 7 ದಿನಗಳೊಳಗೆ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.<br>
        <span style="font-size: 13px;">If you face any issues, please contact us within 7 days.</span>
      </p>
      
      <p style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://srushtipublications.com'}/books" class="btn btn-outline">📚 ಇನ್ನಷ್ಟು ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ</a>
      </p>
    </div>
    
    <div class="footer">
      <p>ಧನ್ಯವಾದಗಳು! Thank you for shopping with us!</p>
      <p>© ${new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
ಡೆಲಿವರಿ ಯಶಸ್ವಿ! - #${data.orderNumber}

ಪ್ರಿಯ ${data.customerName},

ನಿಮ್ಮ ಆರ್ಡರ್ #${data.orderNumber} ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿದೆ!

ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ - ಪುಸ್ತಕ ರಿವ್ಯೂ ಬರೆಯಿರಿ.

ಧನ್ಯವಾದಗಳು!
ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್
    `
  })
}

// Log email to database
async function logEmail(
  type: string,
  to: string,
  subject: string,
  orderId?: string,
  templateData?: unknown
) {
  try {
    return await prisma.emailLog.create({
      data: {
        type,
        to,
        subject,
        orderId,
        templateData: templateData as any,
        status: 'pending'
      }
    })
  } catch (error) {
    console.error('Failed to log email:', error)
    return null
  }
}

// Update email log status
async function updateEmailStatus(emailId: string, status: 'sent' | 'failed', errorMessage?: string) {
  try {
    await prisma.emailLog.update({
      where: { id: emailId },
      data: {
        status,
        errorMessage,
        sentAt: status === 'sent' ? new Date() : null
      }
    })
  } catch (error) {
    console.error('Failed to update email status:', error)
  }
}

// Send email using fetch to external API (Resend, SendGrid, etc.)
async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  // Check if email service is configured
  const apiKey = process.env.EMAIL_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'noreply@srushtipublications.com'
  
  if (!apiKey) {
    console.log('📧 Email service not configured. Would send to:', to)
    console.log('Subject:', subject)
    // In development, log the email but don't fail
    return true
  }

  try {
    // Using Resend API (you can swap this for SendGrid, Mailgun, etc.)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return true
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

// Public API functions
export async function sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
  const template = emailTemplates.orderConfirmation(data)
  
  // Log the email
  const emailLog = await logEmail(
    'order_confirmation',
    data.customerEmail,
    template.subject,
    undefined,
    data
  )

  // Send the email
  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  
  // Update log status
  if (emailLog) {
    await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  }

  return success
}

export async function sendShippingUpdate(data: ShippingUpdateData): Promise<boolean> {
  const template = emailTemplates.shippingUpdate(data)
  
  const emailLog = await logEmail(
    'shipping_update',
    data.customerEmail,
    template.subject,
    undefined,
    data
  )

  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  
  if (emailLog) {
    await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  }

  return success
}

export async function sendPasswordReset(email: string, name: string, resetLink: string): Promise<boolean> {
  const template = emailTemplates.passwordReset({ customerName: name, resetLink })
  const success = await sendEmail(email, template.subject, template.html, template.text)
  return success
}

export async function sendDeliveryConfirmation(data: { 
  orderNumber: string, 
  customerName: string, 
  customerEmail: string 
}): Promise<boolean> {
  const template = emailTemplates.deliveryConfirmation(data)
  
  const emailLog = await logEmail(
    'delivery_confirmation',
    data.customerEmail,
    template.subject,
    undefined,
    data
  )

  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  
  if (emailLog) {
    await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  }

  return success
}

export { emailTemplates, logEmail, updateEmailStatus }

