import React from 'react'
import { CategoryGrid } from './CategoryGrid'
import { Category } from '../types'

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
  // Filter categories that have products
  const visibleCategories = categories.filter((cat) => (categoryCounts[cat.id] || 0) > 0)

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs sticky top-[73px] sm:top-[85px] z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <CategoryGrid
          categories={visibleCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          totalProductsCount={totalProductsCount}
          categoryCounts={categoryCounts}
        />
      </div>
    </div>
  )
}
