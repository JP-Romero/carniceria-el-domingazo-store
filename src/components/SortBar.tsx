import React from 'react'
import { ArrowDownUp, Tag, SlidersHorizontal, X } from 'lucide-react'

export type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'discount' | 'stock'

export type PriceFilter = 'all' | 'under_50' | '50_to_100' | '100_to_200' | 'over_200'

interface SortBarProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  priceFilter: PriceFilter
  onPriceFilterChange: (filter: PriceFilter) => void
  onlyDiscounts: boolean
  onToggleDiscounts: () => void
  discountCount: number
  totalCount: number
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'name_asc', label: 'Nombre: A a Z' },
  { value: 'name_desc', label: 'Nombre: Z a A' },
  { value: 'discount', label: 'Mayor Descuento' },
  { value: 'stock', label: 'Disponibilidad' },
]

const PRICE_FILTERS: { value: PriceFilter; label: string }[] = [
  { value: 'all', label: 'Todos los precios' },
  { value: 'under_50', label: 'Menos de C$50' },
  { value: '50_to_100', label: 'C$50 - C$100' },
  { value: '100_to_200', label: 'C$100 - C$200' },
  { value: 'over_200', label: 'Más de C$200' },
]

export const SortBar: React.FC<SortBarProps> = ({
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange,
  onlyDiscounts,
  onToggleDiscounts,
  discountCount,
  totalCount,
}) => {
  const hasActiveFilters = priceFilter !== 'all' || onlyDiscounts || sortBy !== 'featured'

  return (
    <div className="mb-4 space-y-3">
      {/* Top Row: Sort + Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Dropdown */}
        <div className="relative">
          <ArrowDownUp className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] cursor-pointer appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Discount Toggle */}
        <button
          type="button"
          onClick={onToggleDiscounts}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            onlyDiscounts
              ? 'bg-red-600 text-white border-red-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Ofertas</span>
          {discountCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              onlyDiscounts ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'
            }`}>
              {discountCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onSortChange('featured')
              onPriceFilterChange('all')
              if (onlyDiscounts) onToggleDiscounts()
            }}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-slate-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}

        {/* Result Count */}
        <span className="ml-auto text-[11px] text-slate-400 font-medium hidden sm:inline">
          {totalCount} producto{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Price Filter Chips (Always visible) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <SlidersHorizontal className="w-3 h-3 text-slate-400" />
        {PRICE_FILTERS.map((pf) => (
          <button
            key={pf.value}
            type="button"
            onClick={() => onPriceFilterChange(pf.value)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              priceFilter === pf.value
                ? 'bg-[#8b1e1e] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {pf.label}
          </button>
        ))}
      </div>
    </div>
  )
}