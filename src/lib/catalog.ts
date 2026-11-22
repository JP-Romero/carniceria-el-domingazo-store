import { Product } from '../types'
import { SortOption, PriceFilter } from '../components/SortBar'

export interface CatalogFilters {
  /** 'all' | 'offers' | category id */
  categoryId?: string
  searchQuery?: string
  sortBy?: SortOption
  priceFilter?: PriceFilter
  onlyDiscounts?: boolean
}

export function filterAndSortProducts(products: Product[], filters: CatalogFilters = {}): Product[] {
  const {
    categoryId = 'all',
    searchQuery = '',
    sortBy = 'featured',
    priceFilter = 'all',
    onlyDiscounts = false,
  } = filters

  let result = [...products]

  if (categoryId === 'offers') {
    result = result.filter((p) => (p.discount_percentage ?? 0) > 0)
  } else if (categoryId !== 'all') {
    result = result.filter((p) => p.category_id === categoryId)
  }

  if (onlyDiscounts) {
    result = result.filter((p) => (p.discount_percentage ?? 0) > 0)
  }

  if (priceFilter !== 'all') {
    result = result.filter((p) => {
      const price = p.price_nio || 0
      switch (priceFilter) {
        case 'under_50': return price < 50
        case '50_to_100': return price >= 50 && price <= 100
        case '100_to_200': return price > 100 && price <= 200
        case 'over_200': return price > 200
        default: return true
      }
    })
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    result = result.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(query)
      const matchesSku = p.sku ? p.sku.toLowerCase().includes(query) : false
      const matchesBarcode = p.barcode ? p.barcode.toLowerCase().includes(query) : false
      return matchesName || matchesSku || matchesBarcode
    })
  }

  switch (sortBy) {
    case 'price_asc':
      result.sort((a, b) => (a.price_nio || 0) - (b.price_nio || 0))
      break
    case 'price_desc':
      result.sort((a, b) => (b.price_nio || 0) - (a.price_nio || 0))
      break
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      break
    case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name, 'es'))
      break
    case 'discount':
      result.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
      break
    case 'stock':
      result.sort((a, b) => (b.stock || 0) - (a.stock || 0))
      break
    case 'featured':
    default:
      result.sort((a, b) => {
        const aDiscount = (a.discount_percentage ?? 0) > 0 ? 1 : 0
        const bDiscount = (b.discount_percentage ?? 0) > 0 ? 1 : 0
        return bDiscount - aDiscount
      })
      break
  }

  return result
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}