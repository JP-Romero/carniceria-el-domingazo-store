import React, { useState, useEffect, useMemo } from 'react'
import { Navbar } from './components/Navbar'
import { HeroBanner } from './components/HeroBanner'
import { CategoryNav } from './components/CategoryNav'
import { ProductCard } from './components/ProductCard'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { ProductDetailModal } from './components/ProductDetailModal'
import { StoreAdminModal } from './components/StoreAdminModal'
import { supabase } from './lib/supabase'
import { BusinessInfo, Category, Product, CartItem, ProductVariantOption } from './types'
import { ShoppingBag, AlertCircle, RefreshCw, Sparkles, Search, MessageSquare } from 'lucide-react'

const CART_STORAGE_KEY = 'carniceria_domingazo_cart_v1'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Store Controls
  const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Product Detail Modal State
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  // Save Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.error('Error saving cart', e)
    }
  }, [cart])

  // Fetch Public Store Data
  const loadStoreData = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: rpcError } = await supabase.rpc('get_public_store_data', {
        p_slug: 'carniceria-el-domingazo',
      })

      if (rpcError) {
        throw rpcError
      }

      if (!data) {
        throw new Error('No se encontró información para esta tienda.')
      }

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

  useEffect(() => {
    loadStoreData()
  }, [])

  const exchangeRate = business?.exchange_rate_nio_usd || 36.62

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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = p.name.toLowerCase().includes(query)
        const matchesSku = p.sku ? p.sku.toLowerCase().includes(query) : false
        const matchesBarcode = p.barcode ? p.barcode.toLowerCase().includes(query) : false
        return matchesName || matchesSku || matchesBarcode
      }

      return true
    })
  }, [products, selectedCategory, searchQuery])

  // Cart Calculations
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
  const handleAddToCart = (product: Product, selectedVariant?: ProductVariantOption | null) => {
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
        updated[existingIndex].quantity += 1
        return updated
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          priceNio,
          priceUsd,
          quantity: 1,
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

  // Get quantity in cart for a product
  const getProductCartQuantity = (productId: string) => {
    const items = cart.filter((i) => i.productId === productId)
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#8b1e1e] selection:text-white">
      {/* Supermarket Navigation */}
      <Navbar
        business={business}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cartCount}
        cartTotalNio={cartTotalNio}
        cartTotalUsd={cartTotalUsd}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <div className="w-14 h-14 border-4 border-[#8b1e1e]/20 border-t-[#8b1e1e] rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800">Cargando catálogo de productos...</h3>
            <p className="text-xs text-slate-500 mt-1">Conectando con Carnicería El Domingazo en vivo</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No se pudo cargar la tienda</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadStoreData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#731818]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* Promo Hero Carousel & Value Props (shown when not searching) */}
            {!searchQuery && <div className="hidden sm:block"><HeroBanner /></div>}

            {/* Department Categories Nav Bar */}
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalProductsCount={products.length}
              categoryCounts={categoryCounts}
            />

            {/* Catalog Grid Section */}
            <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {searchQuery
                      ? `Resultados para "${searchQuery}"`
                      : selectedCategory === 'all'
                      ? 'Todos los Productos y Cortes'
                      : categories.find((c) => c.id === selectedCategory)?.name || 'Productos'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto disponible' : 'productos disponibles'}
                  </p>
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#8b1e1e] font-bold hover:underline self-start sm:self-auto"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    No se encontraron productos
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Intenta buscando con otro término o selecciona otra categoría de la tienda.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Ver Todo el Catálogo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      cartQuantity={getProductCartQuantity(product.id)}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetail={setSelectedProductForDetail}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Floating Mobile Cart Bar if cart has items */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
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
        onClose={() => setIsCartOpen(false)}
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
        cartQuantity={selectedProductForDetail ? getProductCartQuantity(selectedProductForDetail.id) : 0}
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
        onReload={loadStoreData}
      />

      {/* Footer */}
      <Footer business={business} onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  )
}
