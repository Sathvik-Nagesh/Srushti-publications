export const getAdminSecret = () => {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET environment variable is not set in production')
    }
    console.warn('WARNING: Using default ADMIN_SECRET. Do not use this in production.')
    return 'fallback-secret-key-change-this-in-production'
  }
  return secret
}
