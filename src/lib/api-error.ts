/**
 * Safe error handler for API routes.
 * Logs full error details SERVER-SIDE only.
 * Returns a generic message to the CLIENT to prevent info leakage.
 */

type ApiErrorOptions = {
  /** Context label for server log (e.g. 'orders/create') */
  context: string
  /** The caught error */
  error: unknown
  /** Generic client-facing message (Kannada or English) */
  clientMessage?: string
  /** HTTP status code to return */
  status?: number
}

export function handleApiError({
  context,
  error,
  clientMessage = 'ಒಂದು ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  status = 500,
}: ApiErrorOptions): { message: string; status: number } {
  // Full stack trace goes to server logs only
  if (error instanceof Error) {
    console.error(`[API Error][${context}]`, error.message, error.stack)
  } else {
    console.error(`[API Error][${context}]`, error)
  }

  return { message: clientMessage, status }
}

/**
 * Sanitize any error to extract a user-safe string
 * Never expose raw DB errors, stack traces, or internal paths.
 */
export function getSafeErrorMessage(error: unknown): string {
  // Known validation-style errors we surface explicitly
  if (error instanceof Error) {
    const msg = error.message
    // Expose certain known-safe validation messages
    if (msg.startsWith('ಸ್ಟಾಕ್') || msg.startsWith('Invalid') || msg.startsWith('Missing')) {
      return msg
    }
  }
  return 'ಒಂದು ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
}
