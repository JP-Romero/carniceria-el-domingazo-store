import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store'
import { ProductCard } from '../components/ProductCard'
import { ProductVariantOption } from '../types'
import {
  Plus, Minus, ShoppingCart, Package, ShieldCheck, Truck, Star, X,
  ChevronRight, ArrowLeft, Info, Weight, Leaf, Clock, CheckCircle2,
  AlertTriangle, Flame, Zap, Award, MapPin, Phone, Heart,
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
    business,
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
  const [showDescription, setShowDescription] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAllFeatures, setShowAllFeatures] = useState(false)

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

  const inCart = cart.some(i => i.productId === product.id)
  const cartQuantity = cart.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)

  // Category name from slug
  const categorySlug = product.category_id || 'carnes'

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-1 text-xs text-slate-500 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-[#8b1e1e] font-medium whitespace-nowrap">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link
            to={`/categoria/${categorySlug}`}
            className="hover:text-[#8b1e1e] font-medium whitespace-nowrap"
          >
            {product.category_id ? product.category_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Productos'}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-slate-700 truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ──────────────── LEFT COLUMN: IMAGE GALLERY ──────────────── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
              {/* Image */}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                  <span className="text-7xl sm:text-8xl mb-3 select-none">
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

              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-black shadow-lg animate-pulse">
                    -{product.discount_percentage}% OFF
                  </span>
                </div>
              )}

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white shadow-md'
                }`}
                aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery (if multiple images) */}
            {product.image_url && (
              <div className="grid grid-cols-4 gap-2">
                {/* Thumbnails - showing same image multiple times for demonstration */}
                {[...Array(4)].map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#8b1e1e] ring-2 ring-[#8b1e1e]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={product.image_url}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Calidad<br/>Garantizada</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Envíos a<br/>Domicilio</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Fresco<br/>Todos los días</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Selección<br/>Premium</span>
              </div>
            </div>
          </div>

          {/* ──────────────── RIGHT COLUMN: PRODUCT INFO ──────────────── */}
          <div className="space-y-5">
            {/* Brand & Title */}
            <div>
              {product.brand && (
                <div className="text-xs font-extrabold text-[#8b1e1e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {product.brand}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* SKU / Code */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="font-mono">{product.sku || `SKU: ${product.id.slice(-6).toUpperCase()}`}</span>
                {product.barcode && (
                  <span className="font-mono">{product.barcode}</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg text-slate-400 line-through font-medium">
                      {primarySymbol} {origDisplay.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-black animate-pulse">
                      Ahorras {product.discount_percentage}%
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#8b1e1e]">
                    {primarySymbol} {primaryPrice.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-base text-slate-500 font-medium">/{unitLabel}</span>
                </div>
                <div className="text-sm text-slate-400 font-medium mt-1">
                  ≈ {isNio ? '$' : 'C$'} {(isNio ? effectivePriceUsd : effectivePriceNio).toLocaleString(isNio ? 'en-US' : 'es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Variant Selector */}
              {normalizedOptions.length > 1 && (
                <div className="border-t border-slate-100 p-5">
                  <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-1.5">
                    <Weight className="w-4 h-4 text-[#8b1e1e]" />
                    Presentación / Corte
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {normalizedOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all cursor-pointer group ${
                          activeVariant?.name === opt.name
                            ? 'border-[#8b1e1e] bg-[#8b1e1e]/5 text-[#8b1e1e] shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {activeVariant?.name === opt.name && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="font-semibold text-sm">{opt.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {isNio ? 'C$' : '$'} {(opt.price_nio || 0).toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="border-t border-slate-100 p-5">
                {product.stock !== null && product.stock !== undefined && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                    product.stock > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {product.stock > 0 ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        En inventario ({product.stock} disponibles)
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Bajo pedido (3-5 días)
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {inCart ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, cartQuantity - 1, activeVariant?.name)}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-black text-slate-900 px-3 min-w-[40px] text-center">
                        {cartQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, cartQuantity + 1, activeVariant?.name)}
                        className="w-10 h-10 rounded-lg bg-[#8b1e1e] hover:bg-[#731818] text-white flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-sm text-slate-600 font-semibold">
                      {unitLabel} en tu carrito
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/carrito')}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    ✓ Ya está en tu carrito — Ir al carrito
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">Cantidad:</span>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-black text-slate-900 px-2 min-w-[32px] text-center">
                        {detailQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(detailQuantity + 1)}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-slate-600 font-semibold ml-auto">
                      {detailQuantity} × {primarySymbol} {primaryPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 bg-[#8b1e1e] hover:bg-[#731818] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl shadow-md text-base transition-all cursor-pointer group"
                  >
                    <ShoppingCart className="w-6 h-6 text-[#facc15] group-hover:scale-110 transition-transform" />
                    <span>Agregar al Carrito — {primarySymbol} {(primaryPrice * detailQuantity).toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Features/Highlights */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900">Características Destacadas</h3>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showAllFeatures ? 'rotate-90' : ''}`} />
              </button>

              {showAllFeatures && (
                <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">100% Fresco</div>
                      <div className="text-[10px] text-slate-500">Directo del proveedor</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">Calidad Premium</div>
                      <div className="text-[10px] text-slate-500">Selección especial</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">Envío Rápido</div>
                      <div className="text-[10px] text-slate-500">En Granada</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">Pago Seguro</div>
                      <div className="text-[10px] text-slate-500">Efectivo o transferencia</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ──────────────── DESCRIPTION SECTION ──────────────── */}
        <section className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900">Descripción del Producto</h2>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showDescription ? 'rotate-90' : ''}`} />
            </button>

            {showDescription && (
              <div className="px-5 pb-5 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Disfruta de la mejor calidad de {product.name.toLowerCase()} de Carnicería El Domingazo.
                  Seleccionado cuidadosamente para ofrecerte frescura y sabor excepcional en cada bocado.
                  Perfecto para tus recetas familiares, asados especiales o el consumo diario con la confianza
                  de una carnicería de barrio que se preocupa por la calidad.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-green-500" />
                      Información del Producto
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Marca:</span>
                        <span className="font-medium text-slate-700">{product.brand || 'El Domingazo'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit:</span>
                        <span className="font-medium text-slate-700">{unitLabel}</span>
                      </div>
                      {product.barcode && (
                        <div className="flex justify-between">
                          <span>Código:</span>
                          <span className="font-mono font-medium text-slate-700">{product.barcode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8b1e1e]" />
                      Información de la Tienda
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Tienda:</span>
                        <span className="font-medium text-slate-700">{business?.name || 'Carnicería El Domingazo'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ubicación:</span>
                        <span className="font-medium text-slate-700">Granada, Nicaragua</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <a
                          href={`https://wa.me/${(business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          {business?.whatsapp_phone || '+505 7708-2552'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ──────────────── RELATED PRODUCTS ──────────────── */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Productos Relacionados
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Otros productos de {product.category_id ? product.category_id.replace(/-/g, ' ') : 'la misma categoría'}
                </p>
              </div>
              <Link
                to={`/categoria/${categorySlug}`}
                className="text-sm text-[#8b1e1e] font-bold hover:underline flex items-center gap-1"
              >
                Ver todos
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
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

      {/* Sticky Mobile Add to Cart Bar */}
      {inCart ? (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white border-t border-slate-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-slate-500 font-medium">En tu carrito</div>
              <div className="text-lg font-black text-[#8b1e1e]">
                {cartQuantity} {unitLabel} × {primarySymbol} {primaryPrice.toFixed(2)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/carrito')}
              className="px-4 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Ver carrito
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white border-t border-slate-200 shadow-lg p-4">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-[#8b1e1e] hover:bg-[#731818] text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5 text-[#facc15]" />
            <span>Agregar — {primarySymbol} {(primaryPrice * detailQuantity).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductPage