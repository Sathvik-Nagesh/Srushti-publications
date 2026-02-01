'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book } from './types'

interface CompareState {
  books: Book[]
  maxBooks: number
  
  // Actions
  addBook: (book: Book) => boolean
  removeBook: (bookId: string) => void
  clearAll: () => void
  isInCompare: (bookId: string) => boolean
  canAdd: () => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      books: [],
      maxBooks: 3,
      
      addBook: (book: Book) => {
        const { books, maxBooks } = get()
        
        // Check if already in compare
        if (books.some(b => b.id === book.id)) {
          return false
        }
        
        // Check if max reached
        if (books.length >= maxBooks) {
          return false
        }
        
        set({ books: [...books, book] })
        return true
      },
      
      removeBook: (bookId: string) => {
        set({
          books: get().books.filter(b => b.id !== bookId)
        })
      },
      
      clearAll: () => {
        set({ books: [] })
      },
      
      isInCompare: (bookId: string) => {
        return get().books.some(b => b.id === bookId)
      },
      
      canAdd: () => {
        return get().books.length < get().maxBooks
      }
    }),
    {
      name: 'srushti-compare',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        books: state.books
      })
    }
  )
)
