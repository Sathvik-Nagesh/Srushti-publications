// Cart Store using Zustand
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book, CartItem } from './types'

interface CartState {
  items: CartItem[]
  sessionId: string
  isLoading: boolean
  
  // Actions
  addItem: (book: Book, quantity?: number) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  setSessionId: (id: string) => void
  
  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getItem: (bookId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: '',
      isLoading: false,
      
      addItem: (book: Book, quantity: number = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item.bookId === book.id)
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map(item =>
              item.bookId === book.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, book.stockQuantity) }
                : item
            ),
          })
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            quantity: Math.min(quantity, book.stockQuantity),
            price: book.sellingPrice,
            bookId: book.id,
            book,
          }
          set({ items: [...items, newItem] })
        }
      },
      
      removeItem: (bookId: string) => {
        set({
          items: get().items.filter(item => item.bookId !== bookId),
        })
      },
      
      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(bookId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.bookId === bookId
              ? { ...item, quantity: Math.min(quantity, item.book.stockQuantity) }
              : item
          ),
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      setSessionId: (id: string) => {
        set({ sessionId: id })
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItem: (bookId: string) => {
        return get().items.find(item => item.bookId === bookId)
      },
    }),
    {
      name: 'srushti-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
)

// Hook to get cart totals
export function useCartTotals() {
  const items = useCartStore(state => state.items)
  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  // Calculate savings (MRP - Selling Price)
  const totalMrp = items.reduce((total, item) => total + (item.book.mrp * item.quantity), 0)
  const savings = totalMrp - subtotal
  
  return {
    subtotal,
    itemCount,
    totalMrp,
    savings,
    savingsPercentage: totalMrp > 0 ? Math.round((savings / totalMrp) * 100) : 0,
  }
}
