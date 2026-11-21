import React, { useState } from 'react'
import { Plus, Minus, Check, ShoppingCart, Tag } from 'lucide-react'
import { Product, ProductVariantOption } from '../types'

interface ProductCardProps {
  product: Product
  currency: 'NIO' | 'USD'
  exchangeRate: number
  cartQuantity: number
  onAddToCart: (product: Product, selectedVariant?: ProductVariantOption | null) => void
  onUpdateQuantity: (productId: string, quantity: number, variantName?: string | null) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  exchangeRate,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  // Detect variants if available
  const hasVariants = product.variants && product.variants.length > 0 && product.variants[0].options?.length > 0
  const firstVariantGroup = hasVariants ? product.variants![0] : null

  // Normalize options to object format
  const normalizedOptions: ProductVariantOption[] = (firstVariantGroup?.options || []).map((opt) => {
    if (typeof opt === 'string') {
      return { name: opt, price_nio: product.price_nio, price_usd: product.price_usd || undefined }
    }
    return opt
  })

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantOption | null>(
    normalizedOptions.length > 0 ? normalizedOptions[0] : null,
  )

  // Calculate pricing based on variant or base product
  const effectivePriceNio = selectedVariant?.price_nio ?? product.price_nio ?? 0
  const effectivePriceUsd =
    selectedVariant?.price_usd ??
    product.price_usd ??
    (exchangeRate > 0 ? effectivePriceNio / exchangeRate : 0)

  const isNio = currency === 'NIO'
  const primaryPrice = isNio ? effectivePriceNio : effectivePriceUsd
  const secondaryPrice = isNio ? effectivePriceUsd : effectivePriceNio
  const primarySymbol = isNio ? 'C$' : '$'
  const secondarySymbol = isNio ? '$' : 'C$'

  // Unit display label
  const unitLabel = product.unit ? (product.unit.toLowerCase().includes('libra') ? 'lb' : product.unit) : 'ud'

  return (
    <div className="product-card flex flex-col justify-between overflow-hidden bg-white p-3.5 sm:p-4 group">
      <div>
        {/* Badges / Header */}
        <div className="flex items-start justify-between gap-1 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold tracking-wide uppercase border border-amber-200/60">
            <Tag className="w-2.5 h-2.5 text-amber-600" />
            Por {unitLabel}
          </span>
          {product.stock !== null && product.stock !== undefined && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                product.stock > 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {product.stock > 0 ? 'En inventario' : 'Bajo pedido'}
            </span>
          )}
        </div>

        {/* Product Image / Illustration Placeholder */}
        <div className="relative w-full aspect-4/3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-3 group-hover:bg-slate-100/60 transition-colors">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 p-4 text-center">
              <span className="text-3xl sm:text-4xl mb-1 select-none">
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
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                El Domingazo
              </span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] mb-1.5" title={product.name}>
          {product.name}
        </h3>

        {/* Variants Selector if multiple options exist */}
        {normalizedOptions.length > 1 && (
          <div className="mb-2.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Presentación / Corte:
            </label>
            <div className="flex flex-wrap gap-1">
              {normalizedOptions.map((opt, idx) => {
                const isSelected = selectedVariant?.name === opt.name
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariant(opt)}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-[#8b1e1e] text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-baseline justify-between gap-1 mb-2.5">
          <div>
            <div className="text-base sm:text-lg font-black text-[#8b1e1e] leading-tight">
              {primarySymbol} {primaryPrice.toLocaleString(isNio ? 'es-NI' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-slate-500 ml-1">/{unitLabel}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              ≈ {secondarySymbol} {secondaryPrice.toLocaleString(isNio ? 'en-US' : 'es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Action Button: Cart Controls */}
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, cartQuantity - 1, selectedVariant?.name)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-black text-slate-900 leading-none">
                {cartQuantity}
              </span>
              <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                {unitLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, cartQuantity + 1, selectedVariant?.name)}
              className="w-8 h-8 rounded-lg bg-[#8b1e1e] hover:bg-[#731818] text-white flex items-center justify-center font-bold shadow-2xs transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(product, selectedVariant)}
            className="w-full flex items-center justify-center gap-2 bg-[#8b1e1e] hover:bg-[#731818] active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#facc15]" />
            <span>+ Agregar al Carrito</span>
          </button>
        )}
      </div>
    </div>
  )
}
