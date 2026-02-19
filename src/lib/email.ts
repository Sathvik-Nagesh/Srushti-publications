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
  invoiceUrl?: string   // Link to view invoice online
  orderId?: string      // DB id, used to build invoice URL if not provided
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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://srushtipublications.com'

// Shared header/footer HTML for consistent branding
const emailHeader = (icon: string, heading: string, subheading: string, color = '#d97706') => `
<div style="background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%); padding: 36px 40px; text-align: center; border-radius: 16px 16px 0 0;">
  <div style="font-size: 40px; margin-bottom: 8px;">${icon}</div>
  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.5px;">${heading}</h1>
  <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${subheading}</p>
</div>`

const emailFooter = () => `
<div style="background: #f8f9fa; padding: 28px 40px; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e5e7eb;">
  <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">ಸಂಪರ್ಕ: <a href="mailto:support@srushtipublications.com" style="color: #d97706; text-decoration: none;">support@srushtipublications.com</a></p>
  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.</p>
</div>`

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="kn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: 'Noto Sans Kannada', 'Segoe UI', Arial, sans-serif; color: #1f2937;">
  <div style="max-width: 600px; margin: 32px auto; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); overflow: hidden;">
    ${content}
  </div>
</body>
</html>`

// Email templates in Kannada
const emailTemplates = {
  orderConfirmation: (data: OrderEmailData) => {
    const invoiceLink = data.invoiceUrl || `${APP_URL}/api/orders/${data.orderId}/invoice`

    const html = emailWrapper(`
      ${emailHeader('✅', 'ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!', 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪುಸ್ತಕ ಶೀಘ್ರದಲ್ಲೇ ತಲುಪುತ್ತದೆ')}

      <div style="background: white; padding: 36px 40px;">
        <p style="margin: 0 0 8px 0; font-size: 16px;">ಪ್ರಿಯ <strong>${data.customerName}</strong>,</p>
        <p style="margin: 0 0 28px 0; color: #4b5563; line-height: 1.6;">ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಪ್ರಾರಂಭಿಸುತ್ತೇವೆ.</p>

        <!-- Order Number Banner -->
        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 1px solid #d97706; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 24px;">📦</span>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: 600;">ಆರ್ಡರ್ ಸಂಖ್ಯೆ</div>
            <div style="font-size: 20px; font-weight: 700; color: #92400e; letter-spacing: 1px;">#${data.orderNumber}</div>
          </div>
        </div>

        <!-- Items -->
        <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">📚 ಆರ್ಡರ್ ಮಾಡಿದ ಪುಸ್ತಕಗಳು</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${data.items.map(item => `
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 12px 0;">
              <div style="font-weight: 600; font-size: 14px; color: #1f2937;">${item.title}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${item.author} &nbsp;×&nbsp; ${item.quantity}</div>
            </td>
            <td style="text-align: right; padding: 12px 0; font-weight: 600; color: #1f2937; white-space: nowrap;">₹${item.totalPrice.toFixed(2)}</td>
          </tr>`).join('')}
        </table>

        <!-- Price Summary -->
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">ಉಪಮೊತ್ತ</td>
              <td style="text-align: right; padding: 5px 0; font-size: 14px;">₹${data.subtotal.toFixed(2)}</td>
            </tr>
            ${data.discount > 0 ? `<tr>
              <td style="padding: 5px 0; color: #059669; font-size: 14px;">ರಿಯಾಯಿತಿ</td>
              <td style="text-align: right; padding: 5px 0; font-size: 14px; color: #059669;">-₹${data.discount.toFixed(2)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">ಶಿಪ್ಪಿಂಗ್</td>
              <td style="text-align: right; padding: 5px 0; font-size: 14px;">${data.shippingCharge === 0 ? '<span style="color:#059669">ಉಚಿತ</span>' : `₹${data.shippingCharge.toFixed(2)}`}</td>
            </tr>
            ${data.taxAmount > 0 ? `<tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">GST</td>
              <td style="text-align: right; padding: 5px 0; font-size: 14px;">₹${data.taxAmount.toFixed(2)}</td>
            </tr>` : ''}
            <tr style="border-top: 2px solid #e5e7eb; margin-top: 8px;">
              <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 16px;">ಒಟ್ಟು ಮೊತ್ತ</td>
              <td style="text-align: right; padding: 12px 0 0 0; font-weight: 700; font-size: 18px; color: #d97706;">₹${data.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 28px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #1d4ed8; margin-bottom: 8px;">📍 ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ</div>
          <div style="font-weight: 600; color: #1f2937;">${data.customerName}</div>
          <div style="color: #4b5563; font-size: 14px; margin-top: 4px; line-height: 1.6;">
            ${data.shippingAddress}<br>
            ${data.shippingCity}, ${data.shippingState} – ${data.shippingPincode}<br>
            📞 ${data.customerPhone}
          </div>
        </div>

        <!-- Delivery Notice -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; font-size: 14px; color: #166534;">
          🚚 ನಿಮ್ಮ ಆರ್ಡರ್ <strong>5-7 ವ್ಯಾಪಾರ ದಿನಗಳಲ್ಲಿ</strong> ತಲುಪುತ್ತದೆ. ರವಾನೆಯಾದ ನಂತರ ಟ್ರ್ಯಾಕಿಂಗ್ ವಿವರಗಳನ್ನು ಕಳುಹಿಸುತ್ತೇವೆ.
        </div>

        <!-- CTA Buttons -->
        <div style="text-align: center; margin-bottom: 8px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="${APP_URL}/account" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            📋 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ
          </a>
          <a href="${invoiceLink}" style="display: inline-block; background: white; color: #d97706; border: 2px solid #d97706; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            🧾 ಇನ್‌ವಾಯ್ಸ್ ವೀಕ್ಷಿಸಿ
          </a>
        </div>
      </div>

      ${emailFooter()}
    `)

    return {
      subject: `✅ ಆರ್ಡರ್ ದೃಢೀಕರಣ #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
      html,
      text: `ಆರ್ಡರ್ ದೃಢೀಕರಣ - #${data.orderNumber}

ಪ್ರಿಯ ${data.customerName},
ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!

ಆರ್ಡರ್ ಸಂಖ್ಯೆ: #${data.orderNumber}
ಒಟ್ಟು: ₹${data.totalAmount.toFixed(2)}

ಶಿಪ್ಪಿಂಗ್: ${data.shippingAddress}, ${data.shippingCity}, ${data.shippingState} - ${data.shippingPincode}

ಇನ್‌ವಾಯ್ಸ್: ${invoiceLink}

ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`
    }
  },

  shippingUpdate: (data: ShippingUpdateData) => {
    const html = emailWrapper(`
      ${emailHeader('🚚', 'ನಿಮ್ಮ ಆರ್ಡರ್ ರವಾನೆಯಾಗಿದೆ!', `ಆರ್ಡರ್ #${data.orderNumber} ಮಾರ್ಗದಲ್ಲಿದೆ`, '#059669')}

      <div style="background: white; padding: 36px 40px;">
        <p style="margin: 0 0 28px 0;">ಪ್ರಿಯ <strong>${data.customerName}</strong>, ನಿಮ್ಮ ಆರ್ಡರ್ ರವಾನೆಯಾಗಿದೆ!</p>

        <div style="background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 28px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #166534; margin-bottom: 8px; font-weight: 600;">ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ</div>
          <div style="font-size: 28px; font-weight: 700; color: #059669; letter-spacing: 3px; font-family: monospace;">${data.trackingNumber}</div>
          <div style="font-size: 13px; color: #6b7280; margin-top: 8px;">ಕೊರಿಯರ್: <strong>${data.courierName}</strong></div>
          ${data.estimatedDelivery ? `<div style="font-size: 13px; margin-top: 6px; color: #374151;">📅 ಅಂದಾಜು ಡೆಲಿವರಿ: <strong>${data.estimatedDelivery}</strong></div>` : ''}
        </div>

        ${data.trackingUrl ? `<div style="text-align: center; margin-bottom: 24px;">
          <a href="${data.trackingUrl}" style="display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            🔍 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ
          </a>
        </div>` : ''}

        <div style="background: #fef3c7; border-radius: 10px; padding: 14px 18px; font-size: 14px; color: #92400e;">
          💡 ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ದಯವಿಟ್ಟು ಮನೆಯಲ್ಲಿ ಅಥವಾ ಯಾರಾದರೂ ಇರಲಿ.
        </div>
      </div>

      ${emailFooter()}
    `)

    return {
      subject: `🚚 ಶಿಪ್ಮೆಂಟ್ ಅಪ್ಡೇಟ್ - #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
      html,
      text: `ಶಿಪ್ಮೆಂಟ್ ಅಪ್ಡೇಟ್ - #${data.orderNumber}
ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ: ${data.trackingNumber}
ಕೊರಿಯರ್: ${data.courierName}
ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`
    }
  },

  passwordReset: (data: { customerName: string, resetLink: string }) => {
    const html = emailWrapper(`
      ${emailHeader('🔐', 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ', 'ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ರೀಸೆಟ್ ಲಿಂಕ್')}

      <div style="background: white; padding: 36px 40px;">
        <p style="margin: 0 0 16px 0;">ನಮಸ್ಕಾರ <strong>${data.customerName}</strong>,</p>
        <p style="margin: 0 0 28px 0; color: #4b5563; line-height: 1.6;">ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮರುಹೊಂದಿಸಲು ವಿನಂತಿಯನ್ನು ನಾವು ಸ್ವೀಕರಿಸಿದ್ದೇವೆ. ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ:</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.resetLink}" style="display: inline-block; background: #d97706; color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px;">
            ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ →
          </a>
        </div>

        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.6;">
            ⚠️ ಈ ಲಿಂಕ್ <strong>1 ಗಂಟೆ ಮಾತ್ರ</strong> ಮಾನ್ಯವಾಗಿರುತ್ತದೆ ಮತ್ತು ಒಮ್ಮೆ ಮಾತ್ರ ಬಳಸಬಹುದು.<br>
            ನೀವು ಇದನ್ನು ವಿನಂತಿಸದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್ ನಿರ್ಲಕ್ಷಿಸಿ.
          </p>
        </div>

        <p style="font-size: 12px; color: #9ca3af; margin: 0;">ಲಿಂಕ್ ಕ್ಲಿಕ್ ಆಗದಿದ್ದರೆ ಈ URL ಕಾಪಿ ಮಾಡಿ:<br>
          <span style="color: #6b7280; word-break: break-all;">${data.resetLink}</span>
        </p>
      </div>

      ${emailFooter()}
    `)

    return {
      subject: `🔐 ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
      html,
      text: `ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ - ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್

ನಮಸ್ಕಾರ ${data.customerName},
ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು: ${data.resetLink}

ಈ ಲಿಂಕ್ 1 ಗಂಟೆ ಮಾತ್ರ ಮಾನ್ಯ.`
    }
  },

  deliveryConfirmation: (data: { orderNumber: string, customerName: string, customerEmail: string }) => {
    const html = emailWrapper(`
      ${emailHeader('🎉', 'ಡೆಲಿವರಿ ಯಶಸ್ವಿ!', `ಆರ್ಡರ್ #${data.orderNumber} ತಲುಪಿದೆ`, '#059669')}

      <div style="background: white; padding: 36px 40px;">
        <p style="margin: 0 0 20px 0;">ಪ್ರಿಯ <strong>${data.customerName}</strong>, ನಿಮ್ಮ ಪುಸ್ತಕ ತಲುಪಿದೆ! ನಮ್ಮಿಂದ ಖರೀದಿಸಿದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು 🙏</p>

        <div style="background: #f0fdf4; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 28px;">
          <p style="font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ!</p>
          <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">ನಿಮ್ಮ ರಿವ್ಯೂ ಇತರ ಓದುಗರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ</p>
          <a href="${APP_URL}/account" style="display: inline-block; background: #d97706; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            ⭐ ರಿವ್ಯೂ ಬರೆಯಿರಿ
          </a>
        </div>

        <div style="background: #fef3c7; border-radius: 10px; padding: 14px 18px; font-size: 14px; color: #92400e; margin-bottom: 24px;">
          💬 ಯಾವುದೇ ಸಮಸ್ಯೆಯಿದ್ದರೆ ದಯವಿಟ್ಟು <strong>7 ದಿನಗಳೊಳಗೆ</strong> ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.
        </div>

        <div style="text-align: center;">
          <a href="${APP_URL}/books" style="display: inline-block; background: white; color: #d97706; border: 2px solid #d97706; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            📚 ಇನ್ನಷ್ಟು ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ
          </a>
        </div>
      </div>

      ${emailFooter()}
    `)

    return {
      subject: `🎉 ಡೆಲಿವರಿ ಯಶಸ್ವಿ! - #${data.orderNumber} | ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`,
      html,
      text: `ಡೆಲಿವರಿ ಯಶಸ್ವಿ! - #${data.orderNumber}
ಧನ್ಯವಾದಗಳು ${data.customerName}!
ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್`
    }
  }
}

// Log email to database
async function logEmail(type: string, to: string, subject: string, orderId?: string, templateData?: unknown) {
  try {
    return await prisma.emailLog.create({
      data: { type, to, subject, orderId, templateData: templateData as any, status: 'pending' }
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
      data: { status, errorMessage, sentAt: status === 'sent' ? new Date() : null }
    })
  } catch (error) {
    console.error('Failed to update email status:', error)
  }
}

// Send email using Resend API
async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const apiKey = process.env.EMAIL_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ <noreply@srushtipublications.com>'

  if (!apiKey) {
    // Dev mode: log but don't fail
    console.log('📧 [DEV] Email not configured — would send to:', to)
    console.log('   Subject:', subject)
    return true
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: fromEmail, to: [to], subject, html, text })
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
  const emailLog = await logEmail('order_confirmation', data.customerEmail, template.subject, undefined, data)
  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  if (emailLog) await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  return success
}

export async function sendShippingUpdate(data: ShippingUpdateData): Promise<boolean> {
  const template = emailTemplates.shippingUpdate(data)
  const emailLog = await logEmail('shipping_update', data.customerEmail, template.subject, undefined, data)
  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  if (emailLog) await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  return success
}

export async function sendPasswordReset(email: string, name: string, resetLink: string): Promise<boolean> {
  const template = emailTemplates.passwordReset({ customerName: name, resetLink })
  return sendEmail(email, template.subject, template.html, template.text)
}

export async function sendDeliveryConfirmation(data: {
  orderNumber: string,
  customerName: string,
  customerEmail: string
}): Promise<boolean> {
  const template = emailTemplates.deliveryConfirmation(data)
  const emailLog = await logEmail('delivery_confirmation', data.customerEmail, template.subject, undefined, data)
  const success = await sendEmail(data.customerEmail, template.subject, template.html, template.text)
  if (emailLog) await updateEmailStatus(emailLog.id, success ? 'sent' : 'failed')
  return success
}

export { emailTemplates, logEmail, updateEmailStatus }
