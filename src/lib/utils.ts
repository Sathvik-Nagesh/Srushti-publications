// Utility functions for Srushti Publication

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Indian Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('kn-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date in Kannada
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('kn-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('kn-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SP${timestamp}${random}`
}

// Generate unique invoice number
export function generateInvoiceNumber(orderId: string): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = orderId.slice(-6).toUpperCase()
  return `INV${year}${month}${random}`
}

// Create URL-friendly slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Calculate discount percentage
export function calculateDiscountPercentage(mrp: number, sellingPrice: number): number {
  if (mrp <= 0) return 0
  return Math.round(((mrp - sellingPrice) / mrp) * 100)
}

// Calculate GST breakup (18% for books in India)
export function calculateGST(
  subtotal: number,
  isSameState: boolean = true
): {
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  totalWithTax: number
} {
  // Books have 0% GST in India (most books are exempt)
  // But we'll use 5% for educational books as per GST guidelines
  const gstRate = 0.05 // 5% GST for books
  const taxableAmount = subtotal
  
  let cgst = 0
  let sgst = 0
  let igst = 0
  
  if (isSameState) {
    cgst = taxableAmount * (gstRate / 2)
    sgst = taxableAmount * (gstRate / 2)
  } else {
    igst = taxableAmount * gstRate
  }
  
  const totalTax = cgst + sgst + igst
  
  return {
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalWithTax: Math.round((taxableAmount + totalTax) * 100) / 100,
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Indian phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Validate Indian pincode
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Get random items from array
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Get session ID from cookies or create new one
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}

// Indian states list
export const INDIAN_STATES = [
  { code: 'KA', name: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
  { code: 'AP', name: 'Andhra Pradesh', nameKn: 'ಆಂಧ್ರ ಪ್ರದೇಶ' },
  { code: 'TS', name: 'Telangana', nameKn: 'ತೆಲಂಗಾಣ' },
  { code: 'TN', name: 'Tamil Nadu', nameKn: 'ತಮಿಳುನಾಡು' },
  { code: 'KL', name: 'Kerala', nameKn: 'ಕೇರಳ' },
  { code: 'MH', name: 'Maharashtra', nameKn: 'ಮಹಾರಾಷ್ಟ್ರ' },
  { code: 'GJ', name: 'Gujarat', nameKn: 'ಗುಜರಾತ್' },
  { code: 'RJ', name: 'Rajasthan', nameKn: 'ರಾಜಸ್ಥಾನ' },
  { code: 'DL', name: 'Delhi', nameKn: 'ದೆಹಲಿ' },
  { code: 'UP', name: 'Uttar Pradesh', nameKn: 'ಉತ್ತರ ಪ್ರದೇಶ' },
  { code: 'MP', name: 'Madhya Pradesh', nameKn: 'ಮಧ್ಯ ಪ್ರದೇಶ' },
  { code: 'WB', name: 'West Bengal', nameKn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ' },
  { code: 'BR', name: 'Bihar', nameKn: 'ಬಿಹಾರ' },
  { code: 'OR', name: 'Odisha', nameKn: 'ಒಡಿಶಾ' },
  { code: 'PB', name: 'Punjab', nameKn: 'ಪಂಜಾಬ್' },
  { code: 'HR', name: 'Haryana', nameKn: 'ಹರಿಯಾಣ' },
  { code: 'GA', name: 'Goa', nameKn: 'ಗೋವಾ' },
  { code: 'AS', name: 'Assam', nameKn: 'ಅಸ್ಸಾಂ' },
  { code: 'JH', name: 'Jharkhand', nameKn: 'ಜಾರ್ಖಂಡ್' },
  { code: 'CG', name: 'Chhattisgarh', nameKn: 'ಛತ್ತೀಸ್‌ಗಢ' },
  { code: 'UK', name: 'Uttarakhand', nameKn: 'ಉತ್ತರಾಖಂಡ' },
  { code: 'HP', name: 'Himachal Pradesh', nameKn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ' },
  { code: 'JK', name: 'Jammu & Kashmir', nameKn: 'ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ' },
  { code: 'TR', name: 'Tripura', nameKn: 'ತ್ರಿಪುರ' },
  { code: 'MN', name: 'Manipur', nameKn: 'ಮಣಿಪುರ' },
  { code: 'ML', name: 'Meghalaya', nameKn: 'ಮೇಘಾಲಯ' },
  { code: 'NL', name: 'Nagaland', nameKn: 'ನಾಗಾಲ್ಯಾಂಡ್' },
  { code: 'AR', name: 'Arunachal Pradesh', nameKn: 'ಅರುಣಾಚಲ ಪ್ರದೇಶ' },
  { code: 'MZ', name: 'Mizoram', nameKn: 'ಮಿಜೋರಾಂ' },
  { code: 'SK', name: 'Sikkim', nameKn: 'ಸಿಕ್ಕಿಂ' },
]

// Order status labels in Kannada
export const ORDER_STATUS_LABELS: Record<string, { en: string; kn: string; color: string }> = {
  PENDING: { en: 'Pending', kn: 'ಬಾಕಿ ಇದೆ', color: 'bg-yellow-500' },
  PAID: { en: 'Paid', kn: 'ಪಾವತಿಸಲಾಗಿದೆ', color: 'bg-green-500' },
  PROCESSING: { en: 'Processing', kn: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ', color: 'bg-blue-500' },
  DISPATCHED: { en: 'Dispatched', kn: 'ಕಳುಹಿಸಲಾಗಿದೆ', color: 'bg-purple-500' },
  DELIVERED: { en: 'Delivered', kn: 'ತಲುಪಿಸಲಾಗಿದೆ', color: 'bg-emerald-500' },
  CANCELLED: { en: 'Cancelled', kn: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ', color: 'bg-red-500' },
  REFUNDED: { en: 'Refunded', kn: 'ಹಣ ಮರುಪಾವತಿ', color: 'bg-gray-500' },
}

// Payment status labels
export const PAYMENT_STATUS_LABELS: Record<string, { en: string; kn: string; color: string }> = {
  PENDING: { en: 'Pending', kn: 'ಬಾಕಿ ಇದೆ', color: 'bg-yellow-500' },
  SUCCESS: { en: 'Success', kn: 'ಯಶಸ್ವಿ', color: 'bg-green-500' },
  FAILED: { en: 'Failed', kn: 'ವಿಫಲವಾಗಿದೆ', color: 'bg-red-500' },
  REFUNDED: { en: 'Refunded', kn: 'ಹಣ ಮರುಪಾವತಿ', color: 'bg-gray-500' },
}
