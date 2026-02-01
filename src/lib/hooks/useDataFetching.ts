'use client'

import useSWR, { SWRConfiguration } from 'swr'
import { 
  getCachedBooks, 
  cacheBooks, 
  getCachedCategories, 
  cacheCategories,
  getCachedBookBySlug,
  getCachedMetadata,
  cacheMetadata
} from '@/lib/clientCache'
import type { Book, Category, PaginatedResponse } from '@/lib/types'

// Default SWR config for offline-first approach
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
}

// ============ BOOKS HOOK ============

interface UseBooksOptions {
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  limit?: number
  inStock?: boolean
  isNewRelease?: boolean
  isBestSeller?: boolean
  isOnSale?: boolean
  author?: string
}

interface UseBooksResult {
  books: Book[]
  total: number
  totalPages: number
  isLoading: boolean
  isValidating: boolean
  error: Error | null
  mutate: () => void
}

export function useBooks(options: UseBooksOptions = {}): UseBooksResult {
  const queryParams = new URLSearchParams()
  
  if (options.categoryId) queryParams.set('categoryId', options.categoryId)
  if (options.search) queryParams.set('search', options.search)
  if (options.minPrice !== undefined) queryParams.set('minPrice', options.minPrice.toString())
  if (options.maxPrice !== undefined) queryParams.set('maxPrice', options.maxPrice.toString())
  if (options.sortBy) queryParams.set('sortBy', options.sortBy)
  if (options.page) queryParams.set('page', options.page.toString())
  if (options.limit) queryParams.set('limit', options.limit.toString())
  if (options.inStock) queryParams.set('inStock', 'true')
  if (options.isNewRelease) queryParams.set('isNewRelease', 'true')
  if (options.isBestSeller) queryParams.set('isBestSeller', 'true')
  if (options.isOnSale) queryParams.set('isOnSale', 'true')
  if (options.author) queryParams.set('author', options.author)
  
  const queryString = queryParams.toString()
  const cacheKey = `books:${queryString}`
  
  const fetcher = async (): Promise<PaginatedResponse<Book>> => {
    // Try cache first (for simple queries without filters)
    if (!options.search && !options.minPrice && !options.maxPrice) {
      const cached = await getCachedMetadata<PaginatedResponse<Book>>(cacheKey)
      if (cached) {
        return cached
      }
    }
    
    // Fetch from server
    const res = await fetch(`/api/books?${queryString}`)
    if (!res.ok) throw new Error('Failed to fetch books')
    
    const data = await res.json()
    
    if (data.success && data.data) {
      // API returns { success: true, data: { items: [...], total, page, ... } }
      const booksData = data.data
      
      // Cache the books array (not the paginated object)
      if (Array.isArray(booksData.items)) {
        await cacheBooks(booksData.items)
      }
      
      const response: PaginatedResponse<Book> = {
        items: booksData.items || [],
        total: booksData.total || 0,
        page: booksData.page || 1,
        limit: booksData.limit || 12,
        totalPages: booksData.totalPages || 0
      }
      
      // Cache the full response for this query
      await cacheMetadata(cacheKey, response)
      
      return response
    }
    
    throw new Error(data.error || 'Failed to fetch books')
  }
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<PaginatedResponse<Book>>(
    `/api/books?${queryString}`,
    fetcher,
    {
      ...defaultConfig,
      // Use stale data while fetching
      fallbackData: undefined,
      keepPreviousData: true,
    }
  )
  
  return {
    books: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error: error || null,
    mutate,
  }
}

// ============ SINGLE BOOK HOOK ============

interface UseBookResult {
  book: Book | null
  isLoading: boolean
  error: Error | null
}

export function useBook(slug: string): UseBookResult {
  const fetcher = async (): Promise<Book> => {
    // Try cache first
    const cached = await getCachedBookBySlug(slug)
    if (cached) {
      return cached
    }
    
    // Fetch from server
    const res = await fetch(`/api/books/${slug}`)
    if (!res.ok) throw new Error('Book not found')
    
    const data = await res.json()
    if (data.success) {
      await cacheBooks([data.data])
      return data.data
    }
    
    throw new Error(data.error || 'Book not found')
  }
  
  const { data, error, isLoading } = useSWR<Book>(
    slug ? `/api/books/${slug}` : null,
    fetcher,
    defaultConfig
  )
  
  return {
    book: data || null,
    isLoading,
    error: error || null,
  }
}

// ============ CATEGORIES HOOK ============

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: Error | null
  mutate: () => void
}

export function useCategoriesSWR(): UseCategoriesResult {
  const fetcher = async (): Promise<Category[]> => {
    // Try cache first
    const cached = await getCachedCategories()
    if (cached && cached.length > 0) {
      // Return cached but still revalidate in background
      return cached
    }
    
    // Fetch from server
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    
    const data = await res.json()
    if (data.success) {
      await cacheCategories(data.data)
      return data.data
    }
    
    throw new Error(data.error || 'Failed to fetch categories')
  }
  
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    '/api/categories',
    fetcher,
    {
      ...defaultConfig,
      revalidateOnMount: true,
      dedupingInterval: 60000, // 1 minute
    }
  )
  
  return {
    categories: data || [],
    isLoading,
    error: error || null,
    mutate,
  }
}

// ============ SEARCH HOOK WITH DEBOUNCE ============

interface UseSearchResult {
  results: Book[]
  isLoading: boolean
  error: Error | null
}

export function useSearch(query: string, limit = 10): UseSearchResult {
  const fetcher = async (): Promise<Book[]> => {
    if (!query || query.length < 2) return []
    
    // Try cache first
    const cacheKey = `search:${query}:${limit}`
    const cached = await getCachedMetadata<Book[]>(cacheKey)
    if (cached) return cached
    
    // Fetch from server
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    if (!res.ok) throw new Error('Search failed')
    
    const data = await res.json()
    if (data.success) {
      await cacheMetadata(cacheKey, data.data)
      return data.data
    }
    
    return []
  }
  
  const { data, error, isLoading } = useSWR<Book[]>(
    query && query.length >= 2 ? `/api/search?q=${query}&limit=${limit}` : null,
    fetcher,
    {
      ...defaultConfig,
      dedupingInterval: 1000,
    }
  )
  
  return {
    results: data || [],
    isLoading,
    error: error || null,
  }
}

// ============ PREFETCH HELPERS ============

export async function prefetchBooks(options: UseBooksOptions = {}): Promise<void> {
  const queryParams = new URLSearchParams()
  if (options.page) queryParams.set('page', options.page.toString())
  if (options.limit) queryParams.set('limit', options.limit.toString())
  if (options.categoryId) queryParams.set('categoryId', options.categoryId)
  
  try {
    const res = await fetch(`/api/books?${queryParams.toString()}`)
    const data = await res.json()
    if (data.success) {
      await cacheBooks(data.data)
    }
  } catch (error) {
    console.error('Prefetch failed:', error)
  }
}

export async function prefetchNextPage(currentPage: number, totalPages: number): Promise<void> {
  if (currentPage < totalPages) {
    await prefetchBooks({ page: currentPage + 1 })
  }
}
