'use client'

import { useEffect, ReactNode } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Every hour
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])
}

interface ServiceWorkerProviderProps {
  children: ReactNode
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  useServiceWorker()
  return children
}

// Helper to check online status
export function useOnlineStatus() {
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online')
      // Trigger sync if needed
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
          // Use type assertion for sync property
          const reg = registration as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }
          reg.sync?.register('sync-cart')
        })
      }
    }
    
    const handleOffline = () => {
      console.log('Gone offline')
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
}
