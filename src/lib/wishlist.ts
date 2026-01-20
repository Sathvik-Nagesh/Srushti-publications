import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  title: string
  slug: string
  author: string
  coverImage: string
  mrp: number
  sellingPrice: number
  addedAt: Date
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  getItemCount: () => number
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const exists = get().items.find(i => i.id === item.id)
        if (!exists) {
          set(state => ({
            items: [...state.items, { ...item, addedAt: new Date() }]
          }))
        }
      },
      
      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      getItemCount: () => {
        return get().items.length
      },
      
      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'srushti-wishlist',
    }
  )
)
