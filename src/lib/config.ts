/**
 * Get the admin secret key for signing/verification
 * In production, ADMIN_SECRET should be set in environment variables
 * In development, a fallback is used for convenience
 */
export const getAdminSecret = (): string => {
  const secret = process.env.ADMIN_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // Sentinel: Enforce secure configuration in production
      throw new Error('CRITICAL SECURITY ERROR: ADMIN_SECRET environment variable is not set. The application cannot start securely.')
    }
    // Development fallback
    console.warn('WARNING: Using default ADMIN_SECRET. Do not use this in production.')
    return 'development-secret-key-change-in-production'
  }
  
  return secret
}
