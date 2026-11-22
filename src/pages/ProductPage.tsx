import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store'
import { ProductCard } from '../components/ProductCard'
import { ProductVariantOption } from '../types'
import {
  Plus, Minus, ShoppingCart, Package, ShieldCheck, Truck, Star, X,
  ChevronRight, Tag, ArrowLeft,
} from 'lucide-react'

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    loading,
    error,
    products,
    currency,
    exchangeRate,
    cart,
    addToCart,
    updateQuantity,
  } = useStore()

  // Find the product
  const product = products.find((p) => p.id === id)

  // Variants
  const hasVariants = product?.variants && product.variants.length > 0 && product.variants[0].options?.length > 0
  const firstVariantGroup = hasVariants ? product!.variants![0] : null

  const normalizedOptions: ProductVariantOption[] = (firstVariantGroup?.options || []).map((opt) => {
    if (typeof opt === 'string') {
      return { name: opt, price_nio: product?.price_nio, price_usd: product?.price_usd || undefined }
    }
    return opt
  })

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantOption | null>(
    normalizedOptions.length > 0 ? normalizedOptions[0] : null,
  )
  const [detailQuantity, setDetailQuantity] = useState(1)

  // Pricing
  const activeVariant = selectedVariant ?? normalizedOptions[0] ?? null
  const effectivePriceNio = activeVariant?.price_nio ?? product?.price_nio ?? 0
  const effectivePriceUsd =
    activeVariant?.price_usd ??
    product?.price_usd ??
    (exchangeRate > 0 ? effectivePriceNio / exchangeRate : 0)
  const isNio = currency === 'NIO'
  const primaryPrice = isNio ? effectivePriceNio : effectivePriceUsd
  const primarySymbol = isNio ? 'C$' : '$'
  const unitLabel = product?.unit ? (product.unit.toLowerCase().includes('libra') ? 'lb' : product.unit) : 'ud'
  const hasDiscount = product?.discount_percentage && product.discount_percentage > 0

  // Original price
  const origPriceNio = product?.original_price_nio ?? product?.price_nio
  const origPriceUsd =
    product?.original_price_usd ?? product?.price_usd ?? (exchangeRate > 0 ? (activeVariant?.price_nio ?? 0) / exchangeRate : 0)
  const origDisplay = isNio ? origPriceNio : origPriceUsd

  const handleAdd = () => {
    if (!product) return
    addToCart(product, activeVariant, detailQuantity)
    navigate('/carrito')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 border-4 border-[#8b1e1e]/20 border-t-[#8b1e1e] rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Cargando producto...</h3>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Producto no encontrado</h3>
        <p className="text-xs text-slate-500 mb-4">
          Este producto no está disponible o el enlace es incorrecto.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl"
        >
          Ver Catálogo
        </button>
      </div>
    )
  }

  // Related products (same category)
  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 6)

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#8b1e1e] font-medium">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        {product.category_id && (
          <>
            <Link to={`/categoria/${product.category_id}`} className="hover:text-[#8b1e1e] font-medium">
              {product.category_id}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-slate-700 truncate">{product.name}</span>
      </div>

      {/* Product detail layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left column: Image + info */}
          <div className="space-y-4">
            {/* Image */}
            <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                  <span className="text-6xl sm:text-7xl mb-2 select-none">
                    {product.name.toLowerCase().includes('pollo')
                      ? '🍗'
                      : product.name.toLowerCase().includes('cerdo') || product.name.toLowerCase().includes('posta')
                      ? '🥓'
                      : product.name.toLowerCase().includes('res') || product.name.toLowerCase().includes('lomo')
                      ? '🥩'
                      : product.name.toLowerCase().includes('chorizo') || product.name.toLowerCase().includes('embutido')
                      ? '🌭'
                      : product.name.toLowerCase().includes('queso') || product.name.toLowerCase().includes('crema')
                      ? '🧀'
                      : '🛒'}
                  </span>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Carnicería El Domingazo
                  </span>
                </div>
              )}
            </div>

            {/* Product info cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center">Calidad<br/>Garantizada</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center">Envíos a<br/>Domicilio</span>
              </div>
            </div>
          </div>

          {/* Right column: Details */}
          <div className="space-y-4">
            {/* Brand & name */}
            {product.brand && (
              <div className="text-xs font-extrabold text-[#8b1e1e] uppercase tracking-wider mb-1">
                {product.brand}
              </div>
            )}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-2 mb-1">
              {hasDiscount && (
                <>
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {primarySymbol} {origDisplay.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-black">
                    -{product.discount_percentage}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#8b1e1e]">
                {primarySymbol} {primaryPrice.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-slate-500 font-medium">/{unitLabel}</span>
            </div>
            <div className="text-sm text-slate-400 font-medium">
              ≈ {isNio ? '$' : 'C$'} {(isNio ? effectivePriceUsd : effectivePriceNio).toLocaleString(isNio ? 'en-US' : 'es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Variants */}
            {normalizedOptions.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Presentación / Corte:
                </label>
                <div className="flex flex-wrap gap-2">
                  {normalizedOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(opt)}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        activeVariant?.name === opt.name
                          ? 'bg-[#8b1e1e] text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {product.stock !== null && product.stock !== undefined && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                product.stock > 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {product.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    En inventario — Listo para despacho
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5" />
                    Bajo pedido — Tiempo de espera
                  </>
                )}
              </div>
            )}

            {/* Quantity + add to cart */}
            {cart.some(i => i.productId === product.id) ? (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        const qty = cart.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)
                        updateQuantity(product.id, qty - 1, activeVariant?.name)
                      }}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black text-slate-900 px-2 min-w-[32px] text-center">
                      {cart.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const qty = cart.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)
                        updateQuantity(product.id, qty + 1, activeVariant?.name)
                      }}
                      className="w-9 h-9 rounded-lg bg-[#8b1e1e] hover:bg-[#731818] text-white flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-600 font-semibold">
                    {unitLabel} en tu carrito
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/carrito')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  ✓ Ya está en tu carrito — Ir al carrito
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black text-slate-900 px-2 min-w-[32px] text-center">
                      {detailQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDetailQuantity(detailQuantity + 1)}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-600 font-semibold">
                    {detailQuantity} × {primarySymbol} {primaryPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 bg-[#8b1e1e] hover:bg-[#731818] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md text-sm sm:text-base transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-[#facc15]" />
                  <span>Agregar al Carrito — {primarySymbol} {(primaryPrice * detailQuantity).toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Productos relacionados
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  exchangeRate={exchangeRate}
                  cartQuantity={cart.filter(i => i.productId === p.id).reduce((s, i) => s + i.quantity, 0)}
                  onAddToCart={(pp, v) => addToCart(pp, v)}
                  onUpdateQuantity={(pid, qty, vn) => updateQuantity(pid, qty, vn)}
                  onOpenDetail={(pp) => navigate(`/producto/${pp.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default ProductPage