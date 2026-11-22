import React, { useState, useEffect } from 'react'
import {
  X, Lock, KeyRound, Save, Plus, Trash2, Edit3, Image, DollarSign,
  AlertCircle, CheckCircle2, RefreshCw, Phone, MapPin, Clock, ArrowRight, Eye
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BusinessInfo, Category, Product } from '../types'

const PIN_STORAGE_KEY = 'carniceria_admin_pin'

interface StoreAdminModalProps {
  isOpen: boolean
  onClose: () => void
  business: BusinessInfo | null
  categories: Category[]
  products: Product[]
  onReload: () => Promise<void>
}

export const StoreAdminModal: React.FC<StoreAdminModalProps> = ({
  isOpen,
  onClose,
  business,
  categories,
  products,
  onReload,
}) => {
  const [pin, setPin] = useState<string>(() => localStorage.getItem(PIN_STORAGE_KEY) || '')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products')

  // Search in admin products
  const [adminSearch, setAdminSearch] = useState('')
  const [selectedCatFilter, setSelectedCatFilter] = useState('all')

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Settings State
  const [settingsWhatsapp, setSettingsWhatsapp] = useState('')
  const [settingsAddress, setSettingsAddress] = useState('')
  const [settingsCoverage, setSettingsCoverage] = useState('')
  const [settingsHours, setSettingsHours] = useState('')
  const [settingsRate, setSettingsRate] = useState('36.80')
  const [settingsNewPin, setSettingsNewPin] = useState('')

  // Verify stored PIN on open
  useEffect(() => {
    if (isOpen) {
      setStatusMessage(null)
      const storedPin = localStorage.getItem(PIN_STORAGE_KEY)
      if (storedPin) {
        verifyPin(storedPin, false)
      } else {
        setIsUnlocked(false)
      }

      if (business) {
        setSettingsWhatsapp(business.whatsapp_phone || business.phone || '+505 7708-2552')
        setSettingsAddress(business.address || 'Granada, Nicaragua')
        setSettingsCoverage(business.coverage_area || 'Todo el casco urbano de Granada')
        setSettingsHours(business.opening_hours || 'Lunes a Domingo: 6:00 AM - 6:00 PM')
        setSettingsRate(String(business.exchange_rate_nio_usd || 36.80))
      }
    }
  }, [isOpen, business])

  const verifyPin = async (inputPin: string, showToast = true) => {
    try {
      setPinError('')
      const { data, error } = await supabase.rpc('verify_store_admin_pin', {
        p_slug: 'carniceria-el-domingazo',
        p_pin: inputPin.trim(),
      })

      if (error || !data || !data.success) {
        setIsUnlocked(false)
        setPinError(data?.error || 'PIN incorrecto. Intenta con el PIN por defecto (1234).')
        return
      }

      setPin(inputPin.trim())
      localStorage.setItem(PIN_STORAGE_KEY, inputPin.trim())
      setIsUnlocked(true)
      setPinInput('')
      if (showToast) {
        setStatusMessage({ type: 'success', text: 'Acceso de administrador concedido.' })
      }
    } catch (err: any) {
      setPinError('Error de conexión al validar el PIN.')
    }
  }

  const handleLogoutAdmin = () => {
    localStorage.removeItem(PIN_STORAGE_KEY)
    setPin('')
    setIsUnlocked(false)
    setEditingProduct(null)
    setStatusMessage(null)
  }

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !editingProduct.name?.trim()) return

    try {
      setIsSaving(true)
      setStatusMessage(null)

      const payload = {
        id: editingProduct.id || null,
        name: editingProduct.name.trim(),
        price_nio: Number(editingProduct.price_nio || 0),
        price_usd: Number(editingProduct.price_usd || 0),
        unit: editingProduct.unit || 'lb',
        image_url: editingProduct.image_url?.trim() || null,
        category_id: editingProduct.category_id || null,
        stock: Number(editingProduct.stock ?? 10),
        barcode: editingProduct.barcode?.trim() || null,
        sku: editingProduct.sku?.trim() || null,
      }

      const { data, error } = await supabase.rpc('save_store_product', {
        p_slug: 'carniceria-el-domingazo',
        p_pin: pin,
        p_product: payload,
      })

      if (error || !data || !data.success) {
        throw new Error(data?.error || error?.message || 'Error al guardar el producto.')
      }

      setStatusMessage({ type: 'success', text: `Producto "${editingProduct.name}" guardado correctamente.` })
      setEditingProduct(null)
      await onReload()
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al guardar producto.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete / Deactivate Product
  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas retirar "${prodName}" de la tienda?`)) {
      return
    }

    try {
      setIsSaving(true)
      const { data, error } = await supabase.rpc('delete_store_product', {
        p_slug: 'carniceria-el-domingazo',
        p_pin: pin,
        p_product_id: prodId,
      })

      if (error || !data || !data.success) {
        throw new Error(data?.error || error?.message || 'Error al retirar el producto.')
      }

      setStatusMessage({ type: 'success', text: `"${prodName}" retirado del catálogo.` })
      await onReload()
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al retirar el producto.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      setStatusMessage(null)

      const payload = {
        whatsapp_phone: settingsWhatsapp.trim(),
        address: settingsAddress.trim(),
        coverage_area: settingsCoverage.trim(),
        opening_hours: settingsHours.trim(),
        exchange_rate_nio_usd: parseFloat(settingsRate) || 36.80,
        new_pin: settingsNewPin.trim() || undefined,
      }

      const { data, error } = await supabase.rpc('save_store_settings', {
        p_slug: 'carniceria-el-domingazo',
        p_pin: pin,
        p_settings: payload,
      })

      if (error || !data || !data.success) {
        throw new Error(data?.error || error?.message || 'Error al guardar configuración.')
      }

      if (settingsNewPin.trim()) {
        setPin(settingsNewPin.trim())
        localStorage.setItem(PIN_STORAGE_KEY, settingsNewPin.trim())
        setSettingsNewPin('')
      }

      setStatusMessage({ type: 'success', text: 'Configuración de la tienda actualizada con éxito.' })
      await onReload()
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al guardar configuración.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  // Filtered admin products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !adminSearch.trim() || p.name.toLowerCase().includes(adminSearch.toLowerCase().trim())
    const matchesCat = selectedCatFilter === 'all' || p.category_id === selectedCatFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8b1e1e] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#facc15]" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Administración de Tienda</h2>
              <p className="text-xs text-white/80">Carnicería El Domingazo · Catálogo, Precios e Imágenes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="text-xs bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md font-medium transition-colors"
                title="Bloquear sesión de administración"
              >
                Cerrar sesión
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Body */}
        {!isUnlocked ? (
          /* PIN Entry Screen */
          <div className="p-8 text-center max-w-sm mx-auto my-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#8b1e1e] flex items-center justify-center mb-4 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">PIN de Seguridad</h3>
            <p className="text-xs text-slate-500 mb-5">
              Ingresa tu PIN de administración para editar productos, precios, fotos e información de la tienda.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                verifyPin(pinInput)
              }}
              className="w-full space-y-4"
            >
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN (por defecto 1234)"
                  autoFocus
                  className="w-full text-center tracking-widest text-2xl font-bold py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e] focus:border-transparent bg-slate-50"
                />
                {pinError && <p className="text-xs text-red-600 mt-2 font-medium">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#8b1e1e] hover:bg-[#731919] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                Ingresar al Administrador
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Admin Workspace */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Subnav Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products')
                  setEditingProduct(null)
                }}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'border-[#8b1e1e] text-[#8b1e1e] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🥩 Productos & Precios</span>
                <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
                  {products.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings')
                  setEditingProduct(null)
                }}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'border-[#8b1e1e] text-[#8b1e1e] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⚙️ Configuración Tienda</span>
              </button>
            </div>

            {/* Tab: Products & Prices */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {editingProduct ? (
                  /* Form: Edit / Add Product */
                  <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl mx-auto bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-[#8b1e1e]" />
                        {editingProduct.id ? `Editar: ${editingProduct.name}` : 'Nuevo Producto para la Tienda'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nombre del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="ej. Posta Corona Especial"
                          className="w-full text-sm font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                        />
                      </div>

                      {/* Price NIO */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Precio en Córdobas (C$) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">C$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={editingProduct.price_nio ?? ''}
                            onChange={(e) => {
                              const nio = parseFloat(e.target.value) || 0
                              const rate = business?.exchange_rate_nio_usd || 36.80
                              const usd = rate > 0 ? Number((nio / rate).toFixed(2)) : 0
                              setEditingProduct({
                                ...editingProduct,
                                price_nio: nio,
                                price_usd: usd,
                              })
                            }}
                            placeholder="0.00"
                            className="w-full text-sm font-bold pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Price USD */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Precio en Dólares (USD $)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingProduct.price_usd ?? ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price_usd: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="w-full text-sm font-bold pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Unidad de Medida
                        </label>
                        <select
                          value={editingProduct.unit || 'lb'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                          className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                        >
                          <option value="lb">Libra (lb)</option>
                          <option value="lt">Litro (lt)</option>
                          <option value="u">Unidad (u)</option>
                          <option value="pq">Paquete (pq)</option>
                          <option value="kg">Kilogramo (kg)</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Categoría
                        </label>
                        <select
                          value={editingProduct.category_id || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value || null })}
                          className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                        >
                          <option value="">Sin categoría</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Stock */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Stock Disponible
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={editingProduct.stock ?? 10}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          URL de Imagen del Producto
                        </label>
                        <input
                          type="url"
                          value={editingProduct.image_url || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                          placeholder="https://... o /logo-domingazo.jpg"
                          className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Image Live Preview */}
                    {editingProduct.image_url && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                        <img
                          src={editingProduct.image_url}
                          alt="Vista previa"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-100"
                          onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                        />
                        <div className="text-xs text-slate-500">
                          <strong className="text-slate-700 block font-bold">Vista previa de imagen</strong>
                          Así se verá la foto de este producto en el catálogo.
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 rounded-lg bg-[#8b1e1e] hover:bg-[#731919] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Guardando...' : 'Guardar Producto'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Products List & Quick Action Bar */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="flex gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Buscar producto a editar..."
                          className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e]"
                        />
                        <select
                          value={selectedCatFilter}
                          onChange={(e) => setSelectedCatFilter(e.target.value)}
                          className="text-xs font-bold px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="all">Todas</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            name: '',
                            price_nio: 0,
                            price_usd: 0,
                            unit: 'lb',
                            stock: 10,
                            category_id: categories[0]?.id || null,
                          })
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Nuevo Producto
                      </button>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredProducts.map((p) => {
                        const cat = categories.find((c) => c.id === p.category_id)
                        return (
                          <div
                            key={p.id}
                            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:shadow-sm transition-shadow"
                          >
                            <div className="flex gap-3">
                              <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                                {p.image_url ? (
                                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Image className="w-6 h-6 text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] uppercase font-black text-[#8b1e1e] block truncate">
                                  {cat?.name || 'General'}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 truncate" title={p.name}>
                                  {p.name}
                                </h5>
                                <div className="mt-1 flex items-baseline gap-1.5">
                                  <strong className="text-sm font-black text-slate-900">
                                    C$ {Number(p.price_nio || 0).toFixed(2)}
                                  </strong>
                                  <span className="text-[11px] text-slate-400 font-semibold">
                                    / {p.unit || 'lb'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-500 font-medium">
                                Stock: {p.stock ?? 'N/A'} {p.unit}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingProduct({ ...p })}
                                  className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                                  title="Retirar de la tienda"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Store Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-5 max-w-xl mx-auto w-full space-y-4">
                <h4 className="text-sm font-black text-slate-800 pb-2 border-b border-slate-200">
                  Configuración Operativa de la Tienda
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp para recibir pedidos de clientes *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={settingsWhatsapp}
                      onChange={(e) => setSettingsWhatsapp(e.target.value)}
                      placeholder="+505 7708-2552"
                      className="w-full text-xs font-bold pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Los clientes enviarán sus carritos a este número directamente estructurados con total e ítems.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección física / Casco urbano
                  </label>
                  <input
                    type="text"
                    value={settingsAddress}
                    onChange={(e) => setSettingsAddress(e.target.value)}
                    placeholder="Granada, Nicaragua"
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cobertura de envíos
                  </label>
                  <input
                    type="text"
                    value={settingsCoverage}
                    onChange={(e) => setSettingsCoverage(e.target.value)}
                    placeholder="Envíos a Domicilio en Granada y Alrededores"
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={settingsHours}
                    onChange={(e) => setSettingsHours(e.target.value)}
                    placeholder="Lunes a Domingo: 6:00 AM - 6:00 PM"
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tasa de Cambio Oficial (C$ por 1 USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsRate}
                    onChange={(e) => setSettingsRate(e.target.value)}
                    placeholder="36.80"
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cambiar PIN de Administrador (Opcional)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={settingsNewPin}
                    onChange={(e) => setSettingsNewPin(e.target.value)}
                    placeholder="Dejar en blanco para mantener el actual"
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8b1e1e] focus:outline-none bg-white"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg bg-[#8b1e1e] hover:bg-[#731919] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
