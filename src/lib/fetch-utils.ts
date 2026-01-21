// Parallel data fetching utilities
// Per Vercel best practices: async-parallel, async-api-routes

/**
 * Execute multiple promises in parallel with proper error handling
 * Use this instead of sequential awaits when operations are independent
 * 
 * Impact: CRITICAL (2-10× improvement)
 */
export async function fetchParallel<T extends readonly unknown[]>(
  ...promises: { [K in keyof T]: Promise<T[K]> }
): Promise<T> {
  return Promise.all(promises) as Promise<T>
}

/**
 * Start fetches early, await late pattern for API routes
 * Allows independent operations to run in parallel
 * 
 * Example usage:
 * const userPromise = fetchUser()
 * const configPromise = fetchConfig()
 * // Do other work...
 * const [user, config] = await fetchParallel(userPromise, configPromise)
 */
export function startFetch<T>(fetchFn: () => Promise<T>): Promise<T> {
  return fetchFn()
}

/**
 * Fetch with timeout to prevent hanging requests
 */
export async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
  )
  return Promise.race([promise, timeout])
}

/**
 * Fetch multiple resources, returning results even if some fail
 * Uses Promise.allSettled for graceful degradation
 */
export async function fetchAllSettled<T extends readonly unknown[]>(
  ...promises: { [K in keyof T]: Promise<T[K]> }
): Promise<{ [K in keyof T]: T[K] | null }> {
  const results = await Promise.allSettled(promises)
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  ) as { [K in keyof T]: T[K] | null }
}

/**
 * Retry a fetch operation with exponential backoff
 */
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelayMs?: number
    maxDelayMs?: number
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 10000 } = options
  
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}
