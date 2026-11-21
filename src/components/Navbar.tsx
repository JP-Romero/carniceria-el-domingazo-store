import React from 'react'
import { Search, ShoppingBag, Phone, MapPin, X } from 'lucide-react'
import { BusinessInfo } from '../types'

interface NavbarProps {
  business: BusinessInfo | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  currency: 'NIO' | 'USD'
  setCurrency: (c: 'NIO' | 'USD') => void
  cartCount: number
  cartTotalNio: number
  cartTotalUsd: number
  onOpenCart: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  business,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  cartCount,
  cartTotalNio,
  cartTotalUsd,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#8b1e1e] text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#facc15]" />
              Granada, Nicaragua
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">
              🛵 Envíos a Domicilio y Retiro en Tienda
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${(business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#facc15] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#22c55e]" />
              <span>Pedidos WhatsApp: <strong>{business?.whatsapp_phone || '+505 7708-2552'}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={business?.logo_url || '/logo-domingazo.jpg'}
              alt={business?.name || 'Carnicería El Domingazo'}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#8b1e1e] object-cover shadow-sm bg-white"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                CARNICERÍA <span className="text-[#8b1e1e]">EL DOMINGAZO</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                Calidad, Frescura y los Mejores Cortes en Granada
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar carne de res, cerdo, pollo, embutidos, verduras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Currency Toggle & Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency('NIO')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currency === 'NIO'
                    ? 'bg-[#8b1e1e] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mostrar precios en Córdobas"
              >
                C$ NIO
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-[#8b1e1e] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mostrar precios en Dólares"
              >
                $ USD
              </button>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-[#8b1e1e] hover:bg-[#731818] active:scale-95 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold shadow-md shadow-[#8b1e1e]/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#facc15]" />
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] text-slate-200 font-medium leading-none">Mi Carrito</span>
                <span className="text-xs font-bold leading-none">
                  {currency === 'NIO'
                    ? `C$ ${cartTotalNio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `$ ${cartTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="bg-[#facc15] text-[#8b1e1e] text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar en el catálogo de productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
