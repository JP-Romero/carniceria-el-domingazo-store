export interface BusinessInfo {
  id: string
  name: string
  slug: string
  phone?: string | null
  whatsapp_phone?: string | null
  email?: string | null
  address?: string | null
  coverage_area?: string | null
  opening_hours?: string | null
  logo_url?: string | null
  currency_default: string
  exchange_rate_nio_usd: number
}

export interface Category {
  id: string
  name: string
  color?: string | null
}

export interface ProductVariantOption {
  name: string
  price_nio?: number
  price_usd?: number
  inventory_factor?: number
}

export interface ProductVariantGroup {
  name: string
  options: (string | ProductVariantOption)[]
}

export interface Product {
  id: string
  category_id?: string | null
  name: string
  brand?: string | null
  barcode?: string | null
  sku?: string | null
  price_nio: number
  original_price_nio?: number | null
  price_usd?: number | null
  original_price_usd?: number | null
  discount_percentage?: number | null
  unit?: string | null
  image_url?: string | null
  stock?: number | null
  variants?: ProductVariantGroup[] | null
}

export interface CartItem {
  id: string
  productId: string
  name: string
  unit?: string | null
  priceNio: number
  priceUsd: number
  quantity: number
  selectedVariantName?: string | null
  imageUrl?: string | null
  availableStock?: number | null
}
