import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HeroBanner } from '../components/HeroBanner'
import { CategoryNav } from '../components/CategoryNav'
import { ProductCard } from '../components/ProductCard'
import { SortBar } from '../components/SortBar'
import { useStore } from '../store'
import { filterAndSortProducts } from '../lib/catalog'
import { Search, AlertCircle, RefreshCw } from 'lucide-react'

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const {
    loading,
    error,
    business,
    categories,
    products,
    currency,
    exchangeRate,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter,
    onlyDiscounts,
    setOnlyDiscounts,
    searchQuery,
    cart,
    cartCount,
    cartTotalNio,
    cartTotalUsd,
    discountCount,
    categoryCounts,
    refresh,
    addToCart,
    updateQuantity,
  } = useStore()

  // Find category by slug or handle 'offers'
  const isOffers = slug === 'offers' || slug === 'ofertas'
  let categoryId = 'all'
  let categoryName = 'Productos'

  if (isOffers) {
    categoryId = 'offers'
    categoryName = 'Ofertas y Descuentos'
  } else {
    const found = categories.find((c) => c.id === slug || c.name.toLowerCase() === slug.toLowerCase())
    if (found) {
      categoryId = found.id
      categoryName = found.name
    }
  }

  // Sync the global selectedCategory so the category bar highlights the current category
  useEffect(() => {
    setSelectedCategory(categoryId)
  }, [categoryId, setSelectedCategory])

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id)
    if (id === 'all') {
      navigate('/')
    } else {
      navigate(`/categoria/${id}`)
    }
  }

  const filteredProducts = filterAndSortProducts(products, {
    categoryId,
    searchQuery,
    sortBy,
    priceFilter,
    onlyDiscounts,
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 border-4 border-[#8b1e1e]/20 border-t-[#8b1e1e] rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Cargando catálogo de productos...</h3>
        <p className="text-xs text-slate-500 mt-1">Conectando con Carnicería El Domingazo en vivo</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No se pudo cargar la tienda</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#731818]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Promo Hero Carousel & Value Props (shown when not searching) */}
      {!searchQuery && <div className="hidden sm:block"><HeroBanner /></div>}

      {/* Department Categories Nav Bar with current category highlighted */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        totalProductsCount={products.length}
        categoryCounts={categoryCounts}
        discountCount={discountCount}
      />

      {/* Catalog Grid Section - filtered by this category */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Section Header with category name and back link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {categoryName}
            </h2>
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-[#8b1e1e] font-bold hover:underline"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>

        {/* Sort & Filter Bar */}
        <SortBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          onlyDiscounts={onlyDiscounts}
          onToggleDiscounts={() => setOnlyDiscounts(!onlyDiscounts)}
          discountCount={discountCount}
          totalCount={filteredProducts.length}
        />

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
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                exchangeRate={exchangeRate}
                cartQuantity={cart.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)}
                onAddToCart={(p, v) => addToCart(p, v)}
                onUpdateQuantity={(pid, qty, vn) => updateQuantity(pid, qty, vn)}
                onOpenDetail={(p) => navigate(`/producto/${p.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default CategoryPage