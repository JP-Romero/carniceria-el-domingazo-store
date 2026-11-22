import { createContext, useContext, useState, useEffect } from 'react'
import { BusinessInfo, Category, Product, CartItem, ProductVariantOption } from './types'
import { SortOption, PriceFilter } from './components/SortBar'
import { supabase } from './lib/supabase'

export interface UserProfile {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  created_at: string
}

export interface StoreContextValue {
  loading: boolean
  error: string | null

  business: BusinessInfo | null
  categories: Category[]
  products: Product[]

  currency: 'NIO' | 'USD'
  setCurrency: (c: 'NIO' | 'USD') => void
  exchangeRate: number

  cart: CartItem[]
  cartCount: number
  cartTotalNio: number
  cartTotalUsd: number

  searchQuery: string
  setSearchQuery: (q: string) => void

  selectedCategory: string
  setSelectedCategory: (id: string) => void

  sortBy: SortOption
  setSortBy: (s: SortOption) => void
  priceFilter: PriceFilter
  setPriceFilter: (p: PriceFilter) => void
  onlyDiscounts: boolean
  setOnlyDiscounts: (v: boolean) => void

  categoryCounts: Record<string, number>
  discountCount: number

  // --- Auth ---
  user: { id: string; email: string } | null
  setUser: (u: { id: string; email: string } | null) => void
  session: any
  setSession: (s: any) => void
  getSession: () => Promise<any>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>

  addToCart: (product: Product, variant?: ProductVariantOption | null, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number, variantName?: string | null) => void
  clearCart: () => void

  getCartQuantity: (productId: string) => number

  openCart: () => void
  closeCart: () => void
  openAdmin: () => void
  refresh: () => void
}

export const StoreContext = createContext<StoreContextValue | null>(null)
export const StoreProvider = StoreContext.Provider

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside the StoreProvider')
  return ctx
}