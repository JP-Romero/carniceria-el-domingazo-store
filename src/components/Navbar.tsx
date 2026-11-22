import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingBag, Phone, MapPin, X, User, Clock,
  Mail, Menu, Settings, LogIn, Home, ChevronDown, LogOut, Package,
} from 'lucide-react'
import { BusinessInfo } from '../types'

interface NavbarProps {
  business: BusinessInfo | null
  user: { id: string; email: string } | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  currency: 'NIO' | 'USD'
  setCurrency: (c: 'NIO' | 'USD') => void
  cartCount: number
  cartTotalNio: number
  cartTotalUsd: number
  onOpenCart: () => void
  onOpenAdmin?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  business,
  user,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  cartCount,
  cartTotalNio,
  cartTotalUsd,
  onOpenCart,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const whatsappPhone = (business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* ═══════════════ LEVEL 1: Top Info Bar ═══════════════ */}
      <div className="bg-[#8b1e1e] text-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-8 text-[11px] sm:text-xs">
            {/* Left: Location & Hours */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#facc15] shrink-0" />
                <span className="hidden sm:inline">De la Alcaldia 2c al Sur, Granada</span>
                <span className="sm:hidden">Granada, NI</span>
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-white/80">
                <Clock className="w-3 h-3 text-[#facc15] shrink-0" />
                Lun - Dom: 6:00 AM - 8:00 PM
              </span>
            </div>

            {/* Right: Phone, Email, Social */}
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#facc15] transition-colors"
              >
                <Phone className="w-3 h-3 text-[#4ade80] shrink-0" />
                <span className="hidden sm:inline">{business?.whatsapp_phone || '+505 7708-2552'}</span>
              </a>
              <a
                href={`mailto:${business?.email || 'info@domingazo.com'}`}
                className="hidden lg:flex items-center gap-1.5 hover:text-[#facc15] transition-colors"
              >
                <Mail className="w-3 h-3 text-[#facc15] shrink-0" />
                <span>{business?.email || 'info@domingazo.com'}</span>
              </a>
              <div className="hidden lg:flex items-center gap-2.5">
                <a href="#" className="hover:text-[#facc15] transition-colors text-xs font-bold" aria-label="Facebook">
                  f
                </a>
                <a href="#" className="hover:text-[#facc15] transition-colors text-xs font-bold" aria-label="Instagram">
                  ig
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ LEVEL 2: Main Header ═══════════════ */}
      <div className="border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-3 sm:py-4">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#8b1e1e] transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src={business?.logo_url || '/logo-domingazo.jpg'}
                alt={business?.name || 'Carniceria El Domingazo'}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#8b1e1e] object-cover shadow-sm bg-white"
              />
              <div className="hidden xs:block sm:block">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                  EL <span className="text-[#8b1e1e]">DOMINGAZO</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
                  Carniceria & Supermercado
                </p>
              </div>
            </Link>

            {/* Search Bar - Center, Large (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8" ref={searchRef}>
              <div className="relative w-full">
                <div className={`relative flex items-center transition-all ${
                  searchFocused ? 'ring-2 ring-[#8b1e1e]/20 border-[#8b1e1e]' : 'border-slate-300'
                } bg-slate-50 rounded-full border`}>
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar productos, marcas y mas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full pl-11 pr-24 py-2.5 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="absolute right-2 bg-[#8b1e1e] hover:bg-[#731818] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      Buscar
                    </button>
                  )}
                </div>
                {/* Search Suggestions Dropdown */}
                {searchFocused && searchQuery.length > 1 && (
                  <div className="absolute top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">Sugerencias de busqueda</span>
                    </div>
                    <div className="py-1">
                      {['Carne de res', 'Pollo fresco', 'Cerdo', 'Chorizo', 'Queso', 'Verduras'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSearchQuery(s)
                            setSearchFocused(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700">{s}</span>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">Presiona Enter para buscar</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
              {/* Home Link */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-[#8b1e1e] hover:bg-red-50 rounded-lg text-xs font-semibold transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </button>

              {/* Currency Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrency('NIO')}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                    currency === 'NIO'
                      ? 'bg-[#8b1e1e] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  C$
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                    currency === 'USD'
                      ? 'bg-[#8b1e1e] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  $
                </button>
              </div>

              {/* User Menu / Login (Desktop) */}
              {user ? (
                <div ref={userMenuRef} className="relative inline-block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUserMenuOpen(!userMenuOpen)
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium hidden xl:inline">{user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          navigate('/profile')
                        }}
                        className="w-full flex items-center gap-2 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-[#8b1e1e]" />
                        Mi perfil
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          navigate('/carrito')
                        }}
                        className="w-full flex items-center gap-2 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#8b1e1e]" />
                        Mi carrito
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          navigate('/login')
                        }}
                        className="w-full flex items-center gap-2 py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-[#8b1e1e] hover:bg-red-50 rounded-lg text-xs font-semibold transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Admin Button */}
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                  title="Panel de administracion"
                >
                  <Settings className="w-3.5 h-3.5 text-[#8b1e1e]" />
                </button>
              )}

              {/* Divider */}
              <div className="hidden sm:block w-px h-7 bg-slate-200" />

              {/* Cart Button - Compact with total */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-[#8b1e1e] hover:bg-[#731818] active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold shadow-sm transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#facc15]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#facc15] text-[#8b1e1e] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[9px] text-white/70 font-medium leading-none">Mi Carrito</span>
                  <span className="text-xs font-black leading-none block mt-0.5">
                    {currency === 'NIO'
                      ? `C$ ${cartTotalNio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `$ ${cartTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                {cartCount === 0 && (
                  <div className="text-left hidden sm:block">
                    <span className="block text-[9px] text-white/70 font-medium leading-none">Mi Carrito</span>
                    <span className="text-xs font-bold leading-none block mt-0.5 text-white/90">C$ 0.00</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar carne, pollo, embutidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ Mobile Menu Drawer ═══════════════ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={business?.logo_url || '/logo-domingazo.jpg'}
                    alt="Logo"
                    className="w-10 h-10 rounded-full border-2 border-[#8b1e1e] object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">EL DOMINGAZO</h3>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">Carniceria & Supermercado</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 space-y-1">
              <button
                onClick={() => {
                  navigate('/')
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <Home className="w-4 h-4 text-[#8b1e1e]" />
                Inicio / Catálogo
              </button>
              <button
                onClick={() => {
                  navigate('/carrito')
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#8b1e1e]" />
                Mi Carrito
              </button>
              {user ? (
                <button
                  onClick={() => {
                    navigate('/profile')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-700 text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-[#8b1e1e]" />
                  Mi Perfil
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-700 text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#8b1e1e]" />
                  Ingresar / Mi cuenta
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-700 text-sm font-medium transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#8b1e1e]" />
                  Administrar tienda
                </button>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 mt-2">
              <p className="px-3 text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Contacto</p>
              <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-[#8b1e1e] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                {business?.whatsapp_phone || '+505 7708-2552'}
              </a>
              <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#8b1e1e]" />
                Granada, Nicaragua
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Lun - Dom: 6:00 AM - 8:00 PM
              </div>
            </div>

            {/* Mobile Currency */}
            <div className="p-3 border-t border-slate-100">
              <p className="px-3 text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Moneda</p>
              <div className="flex items-center gap-2 px-3">
                <button
                  type="button"
                  onClick={() => setCurrency('NIO')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    currency === 'NIO'
                      ? 'bg-[#8b1e1e] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  C$ Cordobas
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    currency === 'USD'
                      ? 'bg-[#8b1e1e] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  $ Dolares
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
