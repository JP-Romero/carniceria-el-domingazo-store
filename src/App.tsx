import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { ProductDetailModal } from './components/ProductDetailModal'
import { StoreAdminModal } from './components/StoreAdminModal'
import { SortOption, PriceFilter } from './components/SortBar'
import { supabase } from './lib/supabase'
import { BusinessInfo, Category, Product, CartItem, ProductVariantOption } from './types'
import { StoreContext, StoreContextValue } from './store'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'

const CART_STORAGE_KEY = 'carniceria_domingazo_cart_v1'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all')
  const [onlyDiscounts, setOnlyDiscounts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Store Controls
  const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO')

  // Product Detail Modal State
  const [cartQuantityForDetail, setCartQuantityForDetail] = useState(0)

  const exchangeRate = business?.exchange_rate_nio_usd || 36.62

  const location = useLocation()
  const navigate = useNavigate()

  // Save Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.error('Error saving cart', e)
    }
  }, [cart])

  // Fetch Public Store Data
  const fetchStoreData = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: rpcError } = await supabase.rpc('get_public_store_data', {
        p_slug: 'carniceria-el-domingazo',
      })

      if (rpcError) throw rpcError
      if (!data) throw new Error('No se encontró información para esta tienda.')

      setBusiness(data.business)
      setCategories(data.categories || [])
      setProducts(data.products || [])
    } catch (err: any) {
      console.error('Error loading store data:', err)
      setError(err?.message || 'Error al conectar con la tienda en línea.')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchStoreData()
  }, [])

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1
      }
    })
    return counts
  }, [products])

  // Discount count
  const discountCount = useMemo(() => {
    return products.filter((p) => p.discount_percentage && p.discount_percentage > 0).length
  }, [products])

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const cartTotalNio = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceNio * item.quantity, 0)
  }, [cart])

  const cartTotalUsd = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0)
  }, [cart])

  // Cart Actions
  const handleAddToCart = (product: Product, selectedVariant?: ProductVariantOption | null, quantity: number = 1) => {
    const variantName = selectedVariant?.name || null
    const priceNio = selectedVariant?.price_nio ?? product.price_nio ?? 0
    const priceUsd =
      selectedVariant?.price_usd ??
      product.price_usd ??
      (exchangeRate > 0 ? priceNio / exchangeRate : 0)

    const cartItemId = `${product.id}_${variantName || 'default'}`

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === cartItemId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          priceNio,
          priceUsd,
          quantity,
          selectedVariantName: variantName,
          imageUrl: product.image_url,
          availableStock: product.stock,
        }
        return [...prev, newItem]
      }
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number, variantName?: string | null) => {
    const cartItemId = `${productId}_${variantName || 'default'}`
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.id !== cartItemId)
      }
      return prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    })
  }

  const handleClearCart = () => {
    setCart([])
  }

  const getProductCartQuantity = (productId: string) => {
    const items = cart.filter((i) => i.productId === productId)
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const openAdmin = () => setIsAdminOpen(true)

  const store: StoreContextValue = {
    loading,
    error,
    business,
    categories,
    products,
    currency,
    setCurrency,
    exchangeRate,
    cart,
    cartCount,
    cartTotalNio,
    cartTotalUsd,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter,
    onlyDiscounts,
    setOnlyDiscounts,
    categoryCounts,
    discountCount,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    getCartQuantity: getProductCartQuantity,
    openCart,
    closeCart,
    openAdmin,
    refresh: fetchStoreData,
  }

  // Open product detail modal with its current cart quantity
  const openProductDetail = (product: Product) => {
    setSelectedProductForDetail(product)
    setCartQuantityForDetail(getProductCartQuantity(product.id))
  }

  return (
    <StoreContext.Provider value={store}>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#8b1e1e] selection:text-white">
        <Navbar
          business={business}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          currency={currency}
          setCurrency={setCurrency}
          cartCount={cartCount}
          cartTotalNio={cartTotalNio}
          cartTotalUsd={cartTotalUsd}
          onOpenCart={openCart}
          onOpenAdmin={openAdmin}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/404" element={<Navigate to="/" replace />} />
            <Route element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating Mobile Cart Bar if cart has items */}
        {cartCount > 0 && (
          <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
            <button
              type="button"
              onClick={openCart}
              className="w-full bg-[#8b1e1e] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#facc15] text-[#8b1e1e] text-xs font-black flex items-center justify-center">
                  {cartCount}
                </span>
                <span className="text-xs font-bold">Ver Carrito</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black">
                  {currency === 'NIO'
                    ? `C$ ${cartTotalNio.toFixed(2)}`
                    : `$ ${cartTotalUsd.toFixed(2)}`}
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          items={cart}
          currency={currency}
          totalNio={cartTotalNio}
          totalUsd={cartTotalUsd}
          exchangeRate={exchangeRate}
          business={business}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProductForDetail}
          currency={currency}
          exchangeRate={exchangeRate}
          cartQuantity={cartQuantityForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Store Admin & Product Manager Modal */}
        <StoreAdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          business={business}
          categories={categories}
          products={products}
          onReload={fetchStoreData}
        />

        {/* Footer */}
        <Footer business={business} onOpenAdmin={openAdmin} />
      </div>
    </StoreContext.Provider>
  )
}

export default App
