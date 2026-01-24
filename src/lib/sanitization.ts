import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

/**
 * Sanitizes a string by stripping HTML tags and potentially dangerous characters.
 * Useful for cleaning user input before storage or display.
 */
export const sanitize = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all tags by default for text fields (names, etc)
    ALLOWED_ATTR: []
  }) as string
}

/**
 * Sanitizes a rich text string allows safe HTML tags.
 * Useful for descriptions or reviews if rich text is enabled.
 */
export const sanitizeRichText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  }) as string
}

// Common Validation Schemas
export const schemas = {
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is too short').max(100).transform(sanitize),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional().nullable(),
  uuid: z.string().uuid()
}
