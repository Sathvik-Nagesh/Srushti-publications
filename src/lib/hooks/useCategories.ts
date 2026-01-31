'use client'

import { useState, useEffect, useCallback } from 'react'

interface Category {
  id: string
  name: string
  nameEn?: string
  slug: string
  description?: string
  image?: string
  bookCount: number
  isActive: boolean
  sortOrder: number
}

// Simple in-memory cache for categories
let cachedCategories: Category[] | null = null
let isFetching = false
let listeners: ((cats: Category[]) => void)[] = []
let lastFetchTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Function to invalidate cache (call this after admin updates)
export function invalidateCategoryCache() {
  cachedCategories = null
  lastFetchTime = 0
}

// Function to refresh categories
export async function refreshCategories(): Promise<Category[]> {
  invalidateCategoryCache()
  const res = await fetch('/api/categories', { cache: 'no-store' })
  const data = await res.json()
  if (data.success) {
    cachedCategories = data.data
    lastFetchTime = Date.now()
    return data.data
  }
  return []
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedCategories || [])
  const [isLoading, setIsLoading] = useState(!cachedCategories)
  const [error, setError] = useState<string | null>(null)
  
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    // Check if cache is still valid
    const isCacheValid = cachedCategories && (Date.now() - lastFetchTime < CACHE_TTL)
    
    if (isCacheValid && !forceRefresh) {
      setCategories(cachedCategories!)
      setIsLoading(false)
      return
    }

    // If already fetching, register as listener
    if (isFetching && !forceRefresh) {
      listeners.push((cats) => {
        setCategories(cats)
        setIsLoading(false)
      })
      return
    }

    isFetching = true
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/categories', {
        next: { revalidate: 300 } // 5 min revalidation
      })
      const data = await res.json()
      
      if (data.success) {
        cachedCategories = data.data
        lastFetchTime = Date.now()
        setCategories(data.data)
        
        // Notify all listeners
        listeners.forEach(l => l(data.data))
        listeners = []
      } else {
        setError('Failed to load categories')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      isFetching = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // If cache exists and is valid, no need to fetch
    if (cachedCategories && (Date.now() - lastFetchTime < CACHE_TTL)) {
      return
    }
    fetchCategories()
  }, [fetchCategories])

  const refresh = useCallback(() => {
    return fetchCategories(true)
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    refresh
  }
}

// Default export for backward compatibility
export default useCategories
