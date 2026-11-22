import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import {
  Trash2, Plus, Minus, ShoppingBag, MapPin, Store,
  MessageSquare, AlertCircle, ChevronLeft,
} from 'lucide-react'

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    error,
    business,
    cart,
    currency,
    cartCount,
    cartTotalNio,
    cartTotalUsd,
    exchangeRate,
    updateQuantity,
    clearCart,
  } = useStore()

  // Checkout Form State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'efectivo_cordobas' | 'efectivo_dolares' | 'transferencia'>('efectivo_cordobas')
  const [cashAmount, setCashAmount] = useState('')
  const [validationError, setValidationError] = useState('')

  const isNio = currency === 'NIO'
  const primarySymbol = isNio ? 'C$' : '$'
  const secondarySymbol = isNio ? '$' : 'C$'
  const primaryTotal = isNio ? cartTotalNio : cartTotalUsd
  const secondaryTotal = isNio ? cartTotalUsd : cartTotalNio

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) {
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
    cart.forEach((item, index) => {
      const itemSubtotalNio = item.priceNio * item.quantity
      const variantStr = item.selectedVariantName ? ` (${item.selectedVariantName})` : ''
      const unitStr = item.unit ? ` ${item.unit}` : ''
      msg += `${index + 1}. *${item.name}*${variantStr}\n`
      msg += `   └ Cantidad: ${item.quantity}${unitStr} x C$ ${item.priceNio.toFixed(2)} = *C$ ${itemSubtotalNio.toFixed(2)}*\n`
    })

    msg += `------------------------------------------\n`
    msg += `💰 *TOTAL A PAGAR: C$ ${cartTotalNio.toFixed(2)}* (≈ $ ${cartTotalUsd.toFixed(2)} USD)\n`
    msg += `------------------------------------------\n`
    msg += `¡Muchas gracias! Espero su confirmación para coordinar el despacho. 🙏`

    const encoded = encodeURI(msg)
    const url = `https://wa.me/${storeWhatsApp}?text=${encoded}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 border-4 border-[#8b1e1e]/20 border-t-[#8b1e1e] rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Cargando carrito...</h3>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Volver al catálogo"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Tu Carrito</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu pedido
            </p>
          </div>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar carrito
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 sm:p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Explora nuestros pasillos y agrega los mejores cortes de res, cerdo, pollo y embutidos de Granada.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8b1e1e] text-white text-sm font-bold rounded-xl shadow-xs hover:bg-[#731818] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Seguir comprando
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Productos en tu carrito</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => {
                const itemTotalNio = item.priceNio * item.quantity
                return (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, 0, item.selectedVariantName)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedVariantName && (
                        <p className="text-xs text-[#8b1e1e] font-semibold mt-0.5">
                          Corte/Tipo: {item.selectedVariantName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        C$ {item.priceNio.toFixed(2)} /{item.unit || 'ud'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariantName)}
                        className="w-7 h-7 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black text-slate-900 px-2 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariantName)}
                        className="w-7 h-7 rounded bg-[#8b1e1e] hover:bg-[#731818] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0 min-w-[80px] sm:min-w-[100px]">
                      <span className="text-base font-black text-slate-900">
                        C$ {itemTotalNio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8b1e1e]" />
                  Método de Entrega
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-[#8b1e1e] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">A Domicilio</div>
                      <div className="text-xs text-slate-500 font-normal">Envío en Granada</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Retiro en Tienda</div>
                      <div className="text-xs text-slate-500 font-normal">Pasar recogiendo</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryType === 'delivery' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8b1e1e]" />
                    Dirección de Entrega
                  </h3>
                  <textarea
                    rows={3}
                    placeholder="Ej. De la Iglesia Xaldaltepe 2c al lago, casa esquinera color crema, referencias cercanas..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              )}

              {/* Customer Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8b1e1e]" />
                  Datos de Contacto
                </h3>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tu Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teléfono (Opcional, para coordinar entrega)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 8888-9999"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8b1e1e]" />
                  Forma de Pago
                </h3>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                >
                  <option value="efectivo_cordobas">Efectivo en Córdobas (C$)</option>
                  <option value="efectivo_dolares">Efectivo en Dólares ($)</option>
                  <option value="transferencia">Transferencia Bancaria (Lafise / BAC / Banpro)</option>
                </select>

                {paymentMethod.startsWith('efectivo') && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      ¿Con cuánto billete pagas? (Para preparar cambio/vuelto):
                    </label>
                    <input
                      type="text"
                      placeholder={paymentMethod === 'efectivo_cordobas' ? 'Ej. Con C$ 1,000' : 'Ej. Con $20'}
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Instrucciones de corte o pedido (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. La carne en filetes delgados, costilla troceada para sopa..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                <div className="p-5 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-base font-bold text-slate-900">Resumen del Pedido</h3>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({cart.length} productos)</span>
                    <span className="font-semibold text-slate-900">
                      C$ {cartTotalNio.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Envío en Granada</span>
                    <span className="font-medium">
                      {deliveryType === 'delivery' ? 'Gratis (coordinado)' : 'Retiro en tienda'}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between text-base font-black text-[#8b1e1e]">
                      <span>Total a pagar:</span>
                      <span>C$ {cartTotalNio.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium text-right mt-1">
                      ≈ $ {cartTotalUsd.toFixed(2)} USD
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSendWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] text-white font-extrabold py-4 px-4 rounded-xl shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Pedir por WhatsApp ahora</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 mt-3">
                    Al presionar se abrirá WhatsApp con el resumen de tu pedido para atención inmediata.
                  </p>

                  <Link
                    to="/"
                    className="block w-full text-center text-xs font-bold text-[#8b1e1e] hover:underline mt-3"
                  >
                    ← Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage