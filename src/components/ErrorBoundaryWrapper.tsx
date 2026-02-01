'use client'

import { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface Props {
  children: ReactNode
}

/**
 * Client-side wrapper for Error Boundary to be used in server components
 */
export default function ErrorBoundaryWrapper({ children }: Props) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
