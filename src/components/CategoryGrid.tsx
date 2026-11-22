import React, { useMemo } from 'react'
import { Category } from '../types'
import { LayoutGrid } from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
  totalProductsCount: number
  categoryCounts: Record<string, number>
}

const CATEGORY_ICONS: Record<string, string> = {
  'carnes': '🥩',
  'res': '🥩',
  'cerdo': '🥓',
  'pollo': '🍗',
  'aves': '🍗',
  'embutidos': '🌭',
  'chorizo': '🌭',
  'frutas': '🍎',
  'verduras': '🥬',
  'vegetales': '🥬',
  'lacteos': '🧀',
  'queso': '🧀',
  'abarrotes': '🫘',
  'granos': '🫘',
  'bebidas': '🥤',
  'panaderia': '🍞',
  'pan': '🍞',
  'congelados': '🧊',
  'congelado': '🧊',
  'pescado': '🐟',
  'mariscos': '🦐',
  'mascotas': '🐾',
  'aseo': '🧹',
  'hogar': '🧹',
  'personal': '🧴',
  'default': '🛒',
}

const CATEGORY_IMAGES: Record<string, string> = {
  'carnes': 'https://images.unsplash.com/photo-1607623814075-e51df35b6f82?w=400&h=400&fit=crop',
  'res': 'https://images.unsplash.com/photo-1607623814075-e51df35b6f82?w=400&h=400&fit=crop',
  'cerdo': 'https://images.unsplash.com/photo-1529692236671-f1f6b9c929b9?w=400&h=400&fit=crop',
  'pollo': 'https://images.unsplash.com/photo-1604503468506-aeeb3d8b1b03?w=400&h=400&fit=crop',
  'aves': 'https://images.unsplash.com/photo-1604503468506-aeeb3d8b1b03?w=400&h=400&fit=crop',
  'embutidos': 'https://images.unsplash.com/photo-1544025162-d7694cb9f320?w=400&h=400&fit=crop',
  'frutas': 'https://images.unsplash.com/photo-1619566636858-adf3d46d3633?w=400&h=400&fit=crop',
  'verduras': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
  'vegetales': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
  'lacteos': 'https://images.unsplash.com/photo-1550583724-b2692b85b4150?w=400&h=400&fit=crop',
  'abarrotes': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop',
  'bebidas': 'https://images.unsplash.com/photo-1544145945-f90425340c7b?w=400&h=400&fit=crop',
  'panaderia': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
  'congelados': 'https://images.unsplash.com/photo-1580217885578-da5f5e7b6b7f?w=400&h=400&fit=crop',
  'mascotas': 'https://images.unsplash.com/photo-1546527868-e85b3d3a7c7a?w=400&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
}

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key !== 'default' && lower.includes(key)) return icon
  }
  return CATEGORY_ICONS.default
}

function getCategoryImage(name: string): string | undefined {
  const lower = name.toLowerCase()
  for (const [key, img] of Object.entries(CATEGORY_IMAGES)) {
    if (key !== 'default' && lower.includes(key)) return img
  }
  return CATEGORY_IMAGES.default
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
  categoryCounts,
}) => {
  // Filter categories that have products
  const visibleCategories = useMemo(() => {
    return categories.filter((cat) => (categoryCounts[cat.id] || 0) > 0)
  }, [categories, categoryCounts])

  if (visibleCategories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Nuestras Categorías
        </h2>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-xs text-[#8b1e1e] font-bold hover:underline"
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-3 sm:gap-4">
        {/* "Todos" Card */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
            selectedCategory === 'all'
              ? 'border-[#8b1e1e] bg-[#8b1e1e] text-white shadow-md'
              : 'border-slate-200 bg-white text-slate-700 hover:border-[#8b1e1e]/40 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all ${
              selectedCategory === 'all'
                ? 'bg-white/20'
                : 'bg-slate-100 group-hover:bg-red-50'
            }`}
          >
            <LayoutGrid className={`w-6 h-6 sm:w-7 sm:h-7 ${selectedCategory === 'all' ? 'text-white' : 'text-[#8b1e1e]'}`} />
          </div>
          <div className="text-center">
            <span className={`block text-[10px] sm:text-xs font-bold leading-tight ${selectedCategory === 'all' ? 'text-white' : 'text-slate-800'}`}>
              Todos
            </span>
            <span className={`block text-[9px] sm:text-[10px] font-semibold ${selectedCategory === 'all' ? 'text-white/80' : 'text-slate-400'}`}>
              {totalProductsCount} prod.
            </span>
          </div>
        </button>

        {/* Category Cards */}
        {visibleCategories.map((cat) => {
          const count = categoryCounts[cat.id] || 0
          const isSelected = selectedCategory === cat.id
          const icon = getCategoryIcon(cat.name)
          const img = getCategoryImage(cat.name)

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
                isSelected
                  ? 'border-[#8b1e1e] bg-[#8b1e1e] text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#8b1e1e]/40 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl overflow-hidden transition-all ${
                  isSelected
                    ? 'bg-white/20'
                    : 'bg-slate-100 group-hover:bg-red-50'
                }`}
              >
                {img ? (
                  <img
                    src={img}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="select-none">{icon}</span>
                )}
              </div>
              <div className="text-center min-w-0">
                <span className={`block text-[10px] sm:text-xs font-bold leading-tight truncate max-w-full ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {cat.name}
                </span>
                <span className={`block text-[9px] sm:text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {count} prod.
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}