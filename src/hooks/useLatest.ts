import { useRef, useEffect, useCallback } from 'react'

/**
 * useLatest - Keeps a ref to the latest value
 * Per Vercel best practices: advanced-use-latest
 * 
 * Used for stable callback refs that always reference the latest value
 * without triggering re-renders or effect re-runs.
 * 
 * Impact: LOW (advanced pattern for specific use cases)
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref
}

/**
 * useStableCallback - Creates a stable callback that always uses the latest closure
 * 
 * Use this when you need a stable function reference for event handlers
 * or effects, but the function needs access to the latest state.
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useLatest(callback)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => callbackRef.current(...args)) as T, [])
}

/**
 * useDeferredValue like hook for non-urgent updates
 * Per Vercel best practices: rerender-transitions
 * 
 * For updates that don't need to be immediate, use this to
 * defer them and keep the UI responsive.
 */
export function useTransitionValue<T>(value: T): [T, boolean] {
  const [isPending, startTransition] = React.useTransition()
  const [deferredValue, setDeferredValue] = React.useState(value)
  
  React.useEffect(() => {
    startTransition(() => {
      setDeferredValue(value)
    })
  }, [value])
  
  return [deferredValue, isPending]
}

// Need to import React for useTransition
import * as React from 'react'
