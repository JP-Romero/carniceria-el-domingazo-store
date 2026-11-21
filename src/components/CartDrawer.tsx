import React, { useState } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, Send, MapPin, Store, MessageSquare, AlertCircle } from 'lucide-react'
import { CartItem, BusinessInfo } from '../types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  currency: 'NIO' | 'USD'
  totalNio: number
  totalUsd: number
  exchangeRate: number
  business: BusinessInfo | null
  onUpdateQuantity: (productId: string, quantity: number, variantName?: string | null) => void
  onClearCart: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  totalNio,
  totalUsd,
  exchangeRate,
  business,
  onUpdateQuantity,
  onClearCart,
}) => {
  // Checkout Form State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'efectivo_cordobas' | 'efectivo_dolares' | 'transferencia'>('efectivo_cordobas')
  const [cashAmount, setCashAmount] = useState('')
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const isNio = currency === 'NIO'
  const primarySymbol = isNio ? 'C$' : '$'
  const secondarySymbol = isNio ? '$' : 'C$'
  const primaryTotal = isNio ? totalNio : totalUsd
  const secondaryTotal = isNio ? totalUsd : totalNio

  // Format WhatsApp Message & Open
  const handleSendWhatsAppOrder = () => {
    if (items.length === 0) {
      setValidationError('Tu carrito está vacío.')
      return
    }

    if (!customerName.trim()) {
      setValidationError('Por favor ingresa tu nombre completo.')
      return
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setValidationError('Por favor ingresa la dirección exacta de entrega en Granada.')
      return
    }

    setValidationError('')

    // Generate neat, professional message modeled for butcher orders
    const storeWhatsApp = (business?.whatsapp_phone || '+505 7708-2552').replace(/[^0-9]/g, '')

    let msg = `🛒 *NUEVO PEDIDO - CARNICERÍA EL DOMINGAZO*\n`
    msg += `------------------------------------------\n`
    msg += `👤 *Cliente:* ${customerName.trim()}\n`
    if (customerPhone.trim()) {
      msg += `📞 *Teléfono:* ${customerPhone.trim()}\n`
    }
    msg += `📦 *Modalidad:* ${deliveryType === 'delivery' ? '🛵 Envío a Domicilio' : '🏪 Retiro en Tienda (Granada)'}\n`
    if (deliveryType === 'delivery') {
      msg += `📍 *Dirección de Entrega:* ${deliveryAddress.trim()}\n`
    }
    msg += `💳 *Método de Pago:* ${
      paymentMethod === 'efectivo_cordobas'
        ? `Efectivo en Córdobas (C$)${cashAmount ? ` - Paga con: C$ ${cashAmount}` : ''}`
        : paymentMethod === 'efectivo_dolares'
        ? `Efectivo en Dólares ($)${cashAmount ? ` - Paga con: $ ${cashAmount}` : ''}`
        : 'Transferencia Bancaria (Lafise / BAC / Banpro)'
    }\n`

    if (notes.trim()) {
      msg += `📝 *Indicaciones/Cortes:* ${notes.trim()}\n`
    }

    msg += `\n🥩 *DETALLE DE PRODUCTOS:*\n`
    items.forEach((item, index) => {
      const itemSubtotalNio = item.priceNio * item.quantity
      const variantStr = item.selectedVariantName ? ` (${item.selectedVariantName})` : ''
      const unitStr = item.unit ? ` ${item.unit}` : ''
      msg += `${index + 1}. *${item.name}*${variantStr}\n`
      msg += `   └ Cantidad: ${item.quantity}${unitStr} x C$ ${item.priceNio.toFixed(2)} = *C$ ${itemSubtotalNio.toFixed(2)}*\n`
    })

    msg += `------------------------------------------\n`
    msg += `💰 *TOTAL A PAGAR: C$ ${totalNio.toFixed(2)}* (≈ $ ${totalUsd.toFixed(2)} USD)\n`
    msg += `------------------------------------------\n`
    msg += `¡Muchas gracias! Espero su confirmación para coordinar el despacho. 🙏`

    const encoded = encodeURI(msg)
    const url = `https://wa.me/${storeWhatsApp}?text=${encoded}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-[#8b1e1e] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#facc15]" />
              <div>
                <h2 className="text-base font-bold leading-tight">Tu Carrito de Compras</h2>
                <p className="text-[11px] text-white/80">
                  {items.length} {items.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-xs"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5">
                  Explora nuestros pasillos y agrega los mejores cortes de res, cerdo, pollo y embutidos de Granada.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#731818] transition-colors"
                >
                  Ver Catálogo de Productos
                </button>
              </div>
            ) : (
              <>
                {/* Product List */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const itemTotalNio = item.priceNio * item.quantity
                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          {item.selectedVariantName && (
                            <p className="text-[11px] text-[#8b1e1e] font-semibold">
                              Corte/Tipo: {item.selectedVariantName}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500">
                            C$ {item.priceNio.toFixed(2)} /{item.unit || 'ud'}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.selectedVariantName)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-slate-900 px-1 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.selectedVariantName)}
                            className="w-6 h-6 rounded bg-[#8b1e1e] hover:bg-[#731818] text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right shrink-0 min-w-[65px]">
                          <span className="text-xs font-black text-slate-900">
                            C$ {itemTotalNio.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Delivery Type Selector */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-800 block mb-2">
                    Método de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 shrink-0 text-[#8b1e1e]" />
                      <div className="text-xs">
                        <div>A Domicilio</div>
                        <div className="text-[10px] text-slate-500 font-normal">Envío en Granada</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Store className="w-4 h-4 shrink-0 text-[#8b1e1e]" />
                      <div className="text-xs">
                        <div>Retiro en Tienda</div>
                        <div className="text-[10px] text-slate-500 font-normal">Pasar recogiendo</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-2.5 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Tu Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e] focus:border-[#8b1e1e]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Teléfono de Contacto (Opcional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 8888-9999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e] focus:border-[#8b1e1e]"
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Dirección exacta de entrega en Granada *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej. De la Iglesia Xaldaltepe 2c al lago, casa esquinera color crema"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e] focus:border-[#8b1e1e]"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Forma de Pago:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e] focus:border-[#8b1e1e]"
                    >
                      <option value="efectivo_cordobas">Efectivo en Córdobas (C$)</option>
                      <option value="efectivo_dolares">Efectivo en Dólares ($)</option>
                      <option value="transferencia">Transferencia Bancaria (Lafise / BAC / Banpro)</option>
                    </select>
                  </div>

                  {paymentMethod.startsWith('efectivo') && (
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">
                        ¿Con cuánto billete pagas? (Para preparar cambio/vuelto):
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Con C$ 1,000 o $20"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Instrucciones de corte o pedido (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. La carne en filetes delgados, costilla troceada para sopa..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#8b1e1e]"
                    />
                  </div>

                  {validationError && (
                    <div className="flex items-center gap-1.5 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                  Total del Pedido:
                </span>
                <div className="text-right">
                  <div className="text-xl font-black text-[#8b1e1e]">
                    C$ {totalNio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    ≈ $ {totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pedir por WhatsApp ahora</span>
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Al presionar el botón se abrirá WhatsApp con el resumen de tu pedido para atención inmediata.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
