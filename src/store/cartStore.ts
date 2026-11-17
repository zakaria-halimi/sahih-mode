import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string, color: string, quantity: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.size === size &&
              i.color === color
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id &&
                i.size === size &&
                i.color === color
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product, size, color, quantity }],
          }
        })
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.size === size &&
                i.color === color
              )
          ),
        }))
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId &&
            i.size === size &&
            i.color === color
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'sahih-mode-cart' }
  )
)
