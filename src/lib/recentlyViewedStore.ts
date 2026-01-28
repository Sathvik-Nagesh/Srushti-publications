'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book } from './types'

interface RecentlyViewedState {
  books: Book[]
  maxBooks: number
  
  // Actions
  addBook: (book: Book) => void
  clearAll: () => void
  getBooks: () => Book[]
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      books: [],
      maxBooks: 10,
      
      addBook: (book: Book) => {
        const { books, maxBooks } = get()
        
        // Remove if already exists (will add to front)
        const filtered = books.filter(b => b.id !== book.id)
        
        // Add to front and limit
        const updated = [book, ...filtered].slice(0, maxBooks)
        
        set({ books: updated })
      },
      
      clearAll: () => {
        set({ books: [] })
      },
      
      getBooks: () => {
        return get().books
      }
    }),
    {
      name: 'srushti-recently-viewed',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        books: state.books.map(b => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          author: b.author,
          coverImage: b.coverImage,
          mrp: b.mrp,
          sellingPrice: b.sellingPrice,
          stockQuantity: b.stockQuantity,
          isNewRelease: b.isNewRelease,
          isBestSeller: b.isBestSeller,
          isOnSale: b.isOnSale
        }))
      })
    }
  )
)
