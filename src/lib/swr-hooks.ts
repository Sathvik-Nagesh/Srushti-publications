// SWR hooks for client-side data fetching with automatic deduplication
// Per Vercel best practices for client-side data fetching
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

// Generic fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  return res.json()
}

// Hook for fetching book data with auto-deduplication
export function useBook(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/books/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    book: data?.data,
    isLoading,
    isError: error,
    mutate
  }
}

// Hook for fetching books list
export function useBooks(params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.category) searchParams.set('category', params.category)
  if (params?.search) searchParams.set('search', params.search)

  const url = `/api/books?${searchParams.toString()}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  })

  return {
    books: data?.data?.items || [],
    total: data?.data?.total || 0,
    isLoading,
    isError: error,
    mutate
  }
}

// Hook for fetching categories - immutable (rarely changes)
export function useCategories() {
  const { data, error, isLoading } = useSWRImmutable('/api/categories', fetcher)

  return {
    categories: data?.data || [],
    isLoading,
    isError: error
  }
}

// Hook for fetching site settings - immutable
export function useSiteSettings() {
  const { data, error, isLoading } = useSWRImmutable('/api/settings', fetcher)

  return {
    settings: data?.data,
    isLoading,
    isError: error
  }
}

// Hook for fetching order by order number
export function useOrder(orderNumber: string | null) {
  const { data, error, isLoading } = useSWR(
    orderNumber ? `/api/orders/${orderNumber}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    order: data?.data,
    isLoading,
    isError: error
  }
}
