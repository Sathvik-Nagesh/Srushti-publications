import { z } from 'zod'

/**
 * Edge-compatible HTML sanitization
 * Replaces isomorphic-dompurify which uses jsdom and causes ESM issues on Vercel
 */

// HTML entities for escaping
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char] || char)
}

/**
 * Remove HTML tags from string
 */
function stripTags(str: string): string {
  // Remove all HTML tags
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]+>/g, '') // Remove all other tags
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
}

/**
 * Sanitizes a string by stripping HTML tags and escaping dangerous characters.
 * Useful for cleaning user input before storage or display.
 */
export const sanitize = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return ''
  
  return stripTags(dirty)
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
}

/**
 * Sanitizes and escapes a string for safe HTML display
 */
export const sanitizeAndEscape = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return ''
  return escapeHtml(sanitize(dirty))
}

/**
 * Sanitizes a rich text string - for now, we just strip dangerous content
 * In a real app, you might want to use a whitelist-based approach on the client
 */
export const sanitizeRichText = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return ''
  
  // Remove dangerous patterns but keep basic HTML
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}

// Common Validation Schemas
export const schemas = {
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is too short').max(100).transform(sanitize),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional().nullable(),
  uuid: z.string().uuid()
}

