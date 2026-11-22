import React, { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingCart, X, Package, Star, ShieldCheck, Truck } from 'lucide-react'
import { Product, ProductVariantOption } from '../types'

interface ProductDetailModalProps {
  product: Product | null
  currency: 'NIO' | 'USD'
  exchangeRate: number
  cartQuantity: number
  onClose: () => void
  onAddToCart: (product: Product, selectedVariant?: ProductVariantOption | null) => void
  onUpdateQuantity: (productId: string, quantity: number, variantName?: string | null) => void
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  exchangeRate,
  cartQuantity,
  onClose,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantOption | null>(null)
  const [detailQuantity, setDetailQuantity] = useState(1)

  useEffect(() => {
    if (product) {
      const hasVariants = product.variants && product.variants.length > 0 && product.variants[0].options?.length > 0
      const firstVariantGroup = hasVariants ? product.variants![0] : null
      const normalizedOptions: ProductVariantOption[] = (firstVariantGroup?.options || []).map((opt) => {
        if (typeof opt === 'string') {
          return { name: opt, price_nio: product.price_nio, price_usd: product.price_usd || undefined }
        }
        return opt
      })
      setSelectedVariant(normalizedOptions.length > 0 ? normalizedOptions[0] : null)
      setDetailQuantity(1)
    }
  }, [product?.id])

  if (!product) return null

  const hasVariants = product.variants && product.variants.length > 0 && product.variants[0].options?.length > 0
  const firstVariantGroup = hasVariants ? product.variants![0] : null

  const normalizedOptions: ProductVariantOption[] = (firstVariantGroup?.options || []).map((opt) => {
    if (typeof opt === 'string') {
      return { name: opt, price_nio: product.price_nio, price_usd: product.price_usd || undefined }
    }
    return opt
  })

  const effectivePriceNio = selectedVariant?.price_nio ?? product.price_nio ?? 0
  const effectivePriceUsd = selectedVariant?.price_usd ?? product.price_usd ?? (exchangeRate > 0 ? effectivePriceNio / exchangeRate : 0)
  const isNio = currency === 'NIO'
  const primaryPrice = isNio ? effectivePriceNio : effectivePriceUsd
  const primarySymbol = isNio ? 'C$' : '$'
  const unitLabel = product.unit ? (product.unit.toLowerCase().includes('libra') ? 'lb' : product.unit) : 'ud'

  const origPriceNio = product.original_price_nio ?? product.price_nio
  const origPriceUsd = product.original_price_usd ?? product.price_usd ?? (exchangeRate > 0 ? origPriceNio / exchangeRate : 0)
  const origDisplay = isNio ? origPriceNio : origPriceUsd
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0

  const handleDetailAdd = () => {
    for (let i = 0; i < detailQuantity; i++) {
      onAddToCart(product, selectedVariant)
    }
    onClose()
  }

  const handleDetailQuantityChange = (newQty: number) => {
    if (newQty <= 0) {
      onClose()
      return
    }
    onUpdateQuantity(product.id, newQty, selectedVariant?.name)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row overflow-y-auto">
            {/* Left: Image */}
            <div className="w-full sm:w-2/5 bg-slate-50 flex items-center justify-center p-6 sm:p-8 shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full max-w-[280px] aspect-square object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-300">
                  <span className="text-6xl mb-2 select-none">
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

            {/* Right: Details */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="text-xs font-extrabold text-[#8b1e1e] uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                {hasDiscount && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-black">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3">
                {product.name}
              </h2>

              <div className="mb-4">
                {hasDiscount && (
                  <div className="text-sm text-slate-400 line-through font-medium mb-1">
                    {primarySymbol} {origDisplay.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs ml-1">/{unitLabel}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#8b1e1e]">
                    {primarySymbol} {primaryPrice.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/{unitLabel}</span>
                </div>
                <div className="text-sm text-slate-400 font-medium mt-1">
                  ≈ {isNio ? '$' : 'C$'} {(isNio ? effectivePriceUsd : effectivePriceNio).toLocaleString(isNio ? 'en-US' : 'es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {normalizedOptions.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Presentación / Corte:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {normalizedOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                          selectedVariant?.name === opt.name
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

              {product.stock !== null && product.stock !== undefined && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 ${
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

              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[9px] text-slate-500 font-medium text-center">Calidad<br/>Garantizada</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span className="text-[9px] text-slate-500 font-medium text-center">Envíos a<br/>Domicilio</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] text-slate-500 font-medium text-center">Frescura<br/>Garantizada</span>
                </div>
              </div>

              {cartQuantity > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleDetailQuantityChange(cartQuantity - 1)}
                        className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-base font-black text-slate-900 px-2 min-w-[32px] text-center">
                        {cartQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDetailQuantityChange(cartQuantity + 1)}
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
                    onClick={onClose}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    ✓ Ya está en tu carrito — Seguir comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
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
                    onClick={handleDetailAdd}
                    className="w-full flex items-center justify-center gap-2 bg-[#8b1e1e] hover:bg-[#731818] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md text-sm sm:text-base transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5 text-[#facc15]" />
                    <span>Agregar al Carrito — {primarySymbol} {(primaryPrice * detailQuantity).toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}