import React from 'react'
import { Category } from '../types'
import { LayoutGrid } from 'lucide-react'

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
  totalProductsCount: number
  categoryCounts: Record<string, number>
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
  categoryCounts,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs sticky top-[73px] sm:top-[85px] z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Button: All categories */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#8b1e1e] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Todos los pasillos</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {/* Department aisle chips */}
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0
            if (count === 0) return null
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8b1e1e] text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
