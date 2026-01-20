/**
 * Security Utilities for Input Sanitization and Validation
 * Prevents XSS, SQL injection, and other common attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and encodes special characters
 */
export function sanitizeHTML(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize input for safe display
 * Removes potentially dangerous characters while preserving readability
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove potential script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
}

/**
 * Sanitize for database queries (basic protection)
 * Note: Always use parameterized queries in production
 */
export function sanitizeForDB(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, '')
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): { valid: boolean; sanitized: string } {
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  return {
    valid: emailRegex.test(sanitized),
    sanitized
  }
}

/**
 * Validate and sanitize phone number (Indian format)
 */
export function sanitizePhone(phone: string): { valid: boolean; sanitized: string } {
  // Remove all non-digit characters
  const sanitized = phone.replace(/\D/g, '')
  
  // Check for valid Indian phone number (10 digits, optionally with +91)
  const isValid = /^(\+?91)?[6-9]\d{9}$/.test(sanitized) || /^[6-9]\d{9}$/.test(sanitized)
  
  // Return just the 10-digit number
  const normalized = sanitized.slice(-10)
  
  return {
    valid: isValid,
    sanitized: normalized
  }
}

/**
 * Validate and sanitize pincode (Indian format)
 */
export function sanitizePincode(pincode: string): { valid: boolean; sanitized: string } {
  const sanitized = pincode.replace(/\D/g, '')
  const isValid = /^[1-9][0-9]{5}$/.test(sanitized)
  
  return {
    valid: isValid,
    sanitized
  }
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): { valid: boolean; sanitized: string } {
  const sanitized = url.trim()
  
  try {
    const parsed = new URL(sanitized)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, sanitized: '' }
    }
    return { valid: true, sanitized: parsed.href }
  } catch {
    return { valid: false, sanitized: '' }
  }
}

/**
 * Sanitize slug for URLs
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphen and alphanumeric
    .replace(/[^a-z0-9\u0C80-\u0CFF-]/g, '') // Includes Kannada Unicode range
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
}

/**
 * Rate limit tracker for client-side
 * Returns true if action should be allowed
 */
class ClientRateLimiter {
  private actions: Map<string, number[]> = new Map()
  
  canPerformAction(
    actionId: string, 
    maxActions: number = 10, 
    windowMs: number = 60000
  ): boolean {
    const now = Date.now()
    const timestamps = this.actions.get(actionId) || []
    
    // Remove old timestamps
    const recentTimestamps = timestamps.filter(t => now - t < windowMs)
    
    if (recentTimestamps.length >= maxActions) {
      return false
    }
    
    recentTimestamps.push(now)
    this.actions.set(actionId, recentTimestamps)
    return true
  }
  
  reset(actionId: string): void {
    this.actions.delete(actionId)
  }
}

export const clientRateLimiter = new ClientRateLimiter()

/**
 * Generate CSRF token (for forms)
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Content Security Policy helper
 */
export const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://checkout.razorpay.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'connect-src': ["'self'", 'https://api.razorpay.com'],
  'frame-src': ['https://api.razorpay.com', 'https://checkout.razorpay.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

export function buildCSP(): string {
  return Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}
