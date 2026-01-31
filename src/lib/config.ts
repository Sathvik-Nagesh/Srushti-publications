/**
 * Get the admin secret key for signing/verification
 * In production, ADMIN_SECRET should be set in environment variables
 * In development, a fallback is used for convenience
 */
export const getAdminSecret = (): string => {
  const secret = process.env.ADMIN_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // In production, log warning but don't crash - use a generated fallback
      // This allows the app to run but sessions won't persist across deploys
      console.warn('⚠️ ADMIN_SECRET not set in production. Please add it to environment variables.')
      return 'temporary-fallback-' + (process.env.VERCEL_URL || 'local')
    }
    // Development fallback
    console.warn('WARNING: Using default ADMIN_SECRET. Do not use this in production.')
    return 'development-secret-key-change-in-production'
  }
  
  return secret
}

