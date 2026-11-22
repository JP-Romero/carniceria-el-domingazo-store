import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { CartItem } from '../types'
import {
  Trash2, Plus, Minus, ShoppingBag, MapPin, Store,
  MessageSquare, AlertCircle, ChevronLeft, ArrowRight,
  ChevronRight, CheckCircle2, User, Phone, Clock, CreditCard,
  Truck, Gift, ShieldCheck, Award, Copy, Download, FileText,
} from 'lucide-react'

type Step = 'details' | 'delivery' | 'payment' | 'confirm'

type PaymentMethod = 'efectivo_cordobas' | 'efectivo_dolares' | 'transferencia'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo_cordobas: 'Efectivo en Córdobas (C$)',
  efectivo_dolares: 'Efectivo en Dólares ($)',
  transferencia: 'Transferencia Bancaria',
}

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
    addToCart,
  } = useStore()

  // Checkout Multi-step state
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [stepsCompleted, setStepsCompleted] = useState<Record<Step, boolean>>({
    details: false,
    delivery: false,
    payment: false,
    confirm: false,
  })

  // Form State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo_cordobas')
  const [cashAmount, setCashAmount] = useState('')
  const [notesCompleted, setNotesCompleted] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSending, setIsSending] = useState(false)

  const isNio = currency === 'NIO'
  const primarySymbol = isNio ? 'C$' : '$'
  const secondarySymbol = isNio ? '$' : 'C$'
  const primaryTotal = isNio ? cartTotalNio : cartTotalUsd
  const secondaryTotal = isNio ? cartTotalUsd : cartTotalNio

  // ---- Validations ----
  const validateDetails = (): boolean => {
    const e: Record<string, string> = {}
    if (!customerName.trim()) e.name = 'Ingresa tu nombre completo'
    if (customerPhone.trim() && !/^[0-9\s\-]{7,}$/.test(customerPhone.trim())) {
      e.phone = 'Teléfono inválido'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateDelivery = (): boolean => {
    const e: Record<string, string> = {}
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      e.address = 'Ingresa la dirección de entrega'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = (): boolean => {
    const e: Record<string, string> = {}
    if (paymentMethod.startsWith('efectivo') && !cashAmount.trim()) {
      e.cash = 'Indica con cuánto pagas (para preparar cambio)'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const canGoNext = (step: Step): boolean => {
    switch (step) {
      case 'details': return validateDetails()
      case 'delivery': return validateDelivery()
      case 'payment': return validatePayment()
      default: return true
    }
  }

  const goNext = () => {
    if (!canGoNext(currentStep)) return
    const order: Step[] = ['details', 'delivery', 'payment', 'confirm']
    const idx = order.indexOf(currentStep)
    if (idx < order.length - 1) {
      setCurrentStep(order[idx + 1])
    }
  }

  const goPrev = () => {
    const order: Step[] = ['details', 'delivery', 'payment', 'confirm']
    const idx = order.indexOf(currentStep)
    if (idx > 0) setCurrentStep(order[idx - 1])
  }

  const handleSendWhatsAppOrder = () => {
    if (!validateDetails() || !validateDelivery() || !validatePayment()) return
    setIsSending(true)

    const storeWhatsApp = (business?.whatsapp_phone || '+505 7708-2552').replace(/[^0-9]/g, '')

    const itemLines = cart.map((item, index) => {
      const itemSubtotalNio = item.priceNio * item.quantity
      const variantStr = item.selectedVariantName ? ` (${item.selectedVariantName})` : ''
      const unitStr = item.unit ? ` ${item.unit}` : ''
      return `${index + 1}. *${item.name}*${variantStr}\n   └ Cantidad: ${item.quantity}${unitStr} x ${primarySymbol} ${item.priceNio.toFixed(2)} = *${primarySymbol} ${itemSubtotalNio.toFixed(2)}*`
    }).join('\n')

    const cashStr = cashAmount.trim() ? ` - Paga con: ${primarySymbol} ${cashAmount}` : ''
    const paymentLabel = paymentMethod.startsWith('efectivo')
      ? `Efectivo ${paymentMethod === 'efectivo_cordobas' ? 'en Córdobas' : 'en Dólares'} (${primarySymbol})${cashStr}`
      : paymentMethod === 'transferencia'
        ? 'Transferencia Bancaria (Lafise / BAC / Banpro)'
        : 'Efectivo'

    let msg = `🛒 *NUEVO PEDIDO - CARNICERÍA EL DOMINGAZO*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `👤 *Cliente:* ${customerName.trim()}\n`
    if (customerPhone.trim()) {
      msg += `📞 *Teléfono:* ${customerPhone.trim()}\n`
    }
    msg += `📦 *Modalidad:* ${deliveryType === 'delivery' ? '🛵 Envío a Domicilio' : '🏪 Retiro en Tienda (Granada)'}\n`
    if (deliveryType === 'delivery') {
      msg += `📍 *Dirección:* ${deliveryAddress.trim()}\n`
    }
    msg += `💳 *Pago:* ${paymentLabel}\n`
    if (notes.trim()) {
      msg += `📝 *Notas:* ${notes.trim()}\n`
    }
    msg += `\n🥩 *PRODUCTOS:*\n${itemLines}\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `💰 *TOTAL:* ${primarySymbol} ${primaryTotal.toFixed(2)} (≈ ${secondarySymbol} ${secondaryTotal.toFixed(2)} USD)\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `¡Gracias por elegir El Domingazo! 🙏`

    setTimeout(() => {
      setIsSending(false)
      setStepsCompleted(prev => ({ ...prev, confirm: true }))
      const encoded = encodeURI(msg)
      const url = `https://wa.me/${storeWhatsApp}?text=${encoded}`
      window.open(url, '_blank')
    }, 800)
  }

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 border-4 border-[#8b1e1e]/20 border-t-[#8b1e1e] rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Cargando carrito...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No se pudo cargar el carrito</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#8b1e1e] text-white text-xs font-bold rounded-xl"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  // ---- Empty State ----
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-[#8b1e1e]/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[#8b1e1e]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Explora nuestros pasillos y agrega los mejores cortes de res, cerdo, pollo y embutidos de Granada.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8b1e1e] text-white text-sm font-bold rounded-xl shadow-md shadow-[#8b1e1e]/25 hover:bg-[#731818] hover:shadow-[#8b1e1e]/40 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Seguir comprando
          </Link>
        </div>
      </div>
    )
  }

  // ---- Step Label ----
  const stepLabels: Record<Step, { label: string; icon: React.ReactNode }> = {
    details: { label: 'Datos del Cliente', icon: <User className="w-5 h-5" /> },
    delivery: { label: 'Entrega', icon: <Truck className="w-5 h-5" /> },
    payment: { label: 'Pago', icon: <CreditCard className="w-5 h-5" /> },
    confirm: { label: 'Confirmar Pedido', icon: <FileText className="w-5 h-5" /> },
  }

  // ---- Cart Item Row (reusable) ----
  const CartItemRow = ({ item }: { item: CartItem }) => {
    const itemTotalNio = item.priceNio * item.quantity
    const isNioLocal = currency === 'NIO'
    return (
      <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-50 last:border-0">
        <div className="flex items-center gap-3 shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              🛒
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">{item.name}</h4>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, 0, item.selectedVariantName)}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                aria-label="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {item.selectedVariantName && (
              <p className="text-[10px] text-[#8b1e1e] font-semibold mt-0.5">
                Corte/Tipo: {item.selectedVariantName}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {primarySymbol} {item.priceNio.toFixed(2)} /{item.unit || 'ud'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariantName)}
            className="w-7 h-7 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-black text-slate-900 px-2 min-w-[28px] text-center">{item.quantity}</span>
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
            {primarySymbol} {itemTotalNio.toFixed(2)}
          </span>
        </div>
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
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu pedido
            </p>
          </div>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearCart()
              setCurrentStep('details')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar carrito
          </button>
        )}
      </div>

      {/* ========================================
         STEP: DETAILS
         ======================================== */}
      {currentStep === 'details' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress */}
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                1
              </div>
              <span className="text-slate-500 font-medium">1 de 4</span>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[#8b1e1e] font-bold">Datos del Cliente</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#8b1e1e]" />
                Tus Datos
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                    Nombre y Apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value)
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                      }}
                      className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] border ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                    Teléfono (opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="Ej. 8888-9999 o +505 7708-2552"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value)
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
                      }}
                      className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] border ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#8b1e1e]" />
                Notas del Pedido
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                    Instrucciones de corte o preparación *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <textarea
                      rows={3}
                      placeholder="Ej. La carne en filetes delgados, costilla troceada para sopa, embutidos en paquetes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Deja en blanco si no tienes instrucciones especiales
                  </p>
                </div>
              </div>
            </div>

            {/* Order Preview */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8b1e1e]" />
                Resumen del Pedido
              </h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">Subtotal</span>
                  <span className="text-lg font-black text-slate-900">
                    {primarySymbol} {primaryTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-500">
                  <span>Envío</span>
                  <span className="font-medium">{deliveryType === 'delivery' ? 'Gratis (coordinado)' : 'Retiro en tienda'}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-[#8b1e1e]">
                    {primarySymbol} {primaryTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium text-right mt-0.5">
                  ≈ {secondarySymbol} {secondaryTotal.toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext('details')}
                className={`w-full flex items-center justify-center gap-2 bg-[#8b1e1e] text-white font-extrabold py-4 px-4 rounded-xl shadow-md shadow-[#8b1e1e]/30 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  canGoNext('details')
                    ? 'hover:bg-[#731818] hover:shadow-[#8b1e1e]/50'
                    : ''
                }`}
              >
                <ChevronRight className="w-5 h-5" />
                <span>Siguiente: Entrega</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
         STEP: DELIVERY
         ======================================== */}
      {currentStep === 'delivery' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center font-bold text-xs shadow-sm">2</div>
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">1</div>
              </div>
              <span className="text-slate-500 font-medium">2 de 4</span>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[#8b1e1e] font-bold">Método de Entrega</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Delivery Type */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8b1e1e]" />
                ¿Cómo quieres recibir tu pedido?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
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
                  className={`p-5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
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

            {/* Address Field (only for delivery) */}
            {deliveryType === 'delivery' && (
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8b1e1e]" />
                  Dirección de Entrega
                </h3>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                    Dirección exacta en Granada *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej. De la Iglesia Xaldaltepe 2c al lago, casa esquinera color crema, referencias cercanas..."
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value)
                      if (errors.address) setErrors(prev => ({ ...prev, address: '' }))
                    }}
                    className={`w-full px-4 py-3.5 bg-slate-50 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] border ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {errors.address && (
                    <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">
                    Cobertura: todo el casco urbano de Granada. Envíos coordinados vía WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Cart Preview */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8b1e1e]" />
                Tu Pedido
              </h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateDelivery()) goNext()
                }}
                className="flex items-center justify-center gap-2 bg-[#8b1e1e] text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-[#8b1e1e]/30 hover:bg-[#731818] transition-all"
              >
                Siguiente: Pago
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
         STEP: PAYMENT
         ======================================== */}
      {currentStep === 'payment' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center font-bold text-xs shadow-sm">3</div>
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">2</div>
              </div>
              <span className="text-slate-500 font-medium">3 de 4</span>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[#8b1e1e] font-bold">Método de Pago</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8b1e1e]" />
                ¿Cómo quieres pagar?
              </h3>

              <div className="space-y-3">
                {[
                  { value: 'efectivo_cordobas' as const, label: 'Efectivo en Córdobas', subtitle: 'C$', icon: <Award className="w-4 h-4 text-[#8b1e1e]" /> },
                  { value: 'efectivo_dolares' as const, label: 'Efectivo en Dólares', subtitle: '$', icon: <Award className="w-4 h-4 text-[#b45309]" /> },
                  { value: 'transferencia' as const, label: 'Transferencia Bancaria', subtitle: 'Lafise / BAC / Banpro', icon: <FileText className="w-4 h-4 text-slate-500" /> },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`w-full border rounded-xl text-left flex items-center gap-3 p-4 transition-all cursor-pointer ${
                      paymentMethod === method.value
                        ? 'border-[#8b1e1e] bg-red-50/50 text-[#8b1e1e] font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#8b1e1e]/10 text-[#8b1e1e] flex items-center justify-center shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{method.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{method.subtitle}</div>
                    </div>
                    {paymentMethod === method.value && (
                      <CheckCircle2 className="w-4 h-4 text-[#8b1e1e]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash amount for effective payments */}
            {paymentMethod.startsWith('efectivo') && (
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  ¿Con cuánto pagas? *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                    {primarySymbol}
                  </span>
                  <input
                    type="text"
                    placeholder={`Ej. ${paymentMethod === 'efectivo_cordobas' ? '1,000' : '20'}`}
                    value={cashAmount}
                    onChange={(e) => {
                      setCashAmount(e.target.value)
                      if (errors.cash) setErrors(prev => ({ ...prev, cash: '' }))
                    }}
                    className={`w-full pl-8 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e] border ${errors.cash ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
                {errors.cash && (
                  <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.cash}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-2">
                  Indicamos al repartidor para preparar el cambio/vuelto exacto.
                </p>
              </div>
            )}

            {/* Cart Preview */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8b1e1e]" />
                Tu Pedido
              </h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">Total</span>
                  <span className="text-lg font-black text-slate-900">{primarySymbol} {cartTotalNio.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validatePayment()) goNext()
                }}
                className="flex items-center justify-center gap-2 bg-[#8b1e1e] text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-[#8b1e1e]/30 hover:bg-[#731818] transition-all"
              >
                Siguiente: Confirmar
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
         STEP: CONFIRM
         ======================================== */}
      {currentStep === 'confirm' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center font-bold text-xs shadow-sm">4</div>
              </div>
              <span className="text-slate-500 font-medium">4 de 4</span>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[#8b1e1e] font-bold">Confirmar Pedido</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
            {/* Success Checkmark */}
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">¡Pedido listo!</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Revisa tus datos y confirma el pedido. Se abrirá WhatsApp para coordinar la entrega.
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#f8fafc] rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-slate-500" />
                  Resumen
                </h3>
              </div>

              {/* Customer */}
              <div className="flex items-start gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Cliente</div>
                  <div className="text-sm text-slate-900 font-medium">{customerName}</div>
                </div>
                {customerPhone && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Teléfono</div>
                    <div className="text-sm text-slate-900 font-medium">{customerPhone}</div>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="flex items-start gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Entrega</div>
                  <div className="text-sm text-slate-900 font-medium">
                    {deliveryType === 'delivery' ? 'A Domicilio' : 'Retiro en Tienda'}
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="text-xs text-slate-500 mt-1">{deliveryAddress}</div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-start gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Pago</div>
                  <div className="text-sm text-slate-900 font-medium">
                    {PAYMENT_LABELS[paymentMethod]}
                    {cashAmount.trim() ? ` — ${primarySymbol} ${cashAmount}` : ''}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider text-[10px] mb-2">
                  <span>Productos</span>
                  <span>{itemCount}</span>
                </div>
                <div className="space-y-1.5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{item.name}</div>
                        {item.selectedVariantName && (
                          <div className="text-[10px] text-slate-500">{item.selectedVariantName}</div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.unit || 'ud'} × {primarySymbol} {item.priceNio.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {primarySymbol} {(item.priceNio * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">Total a pagar</span>
                  <span className="text-xl font-black text-[#8b1e1e]">
                    {primarySymbol} {primaryTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium text-right mt-0.5">
                  ≈ {secondarySymbol} {secondaryTotal.toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes.trim() && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Instrucciones</div>
                    <div className="text-sm text-slate-600 mt-0.5">{notes}</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                disabled={isSending}
                className={`w-full flex items-center justify-center gap-2 bg-[#22c55e] text-white font-extrabold py-4 px-4 rounded-xl shadow-md shadow-emerald-500/30 text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  !isSending ? 'hover:bg-[#16a34a] hover:shadow-emerald-500/50' : ''
                }`}
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando por WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    <span>Confirmar Pedido por WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                Al presionar, se abrirá WhatsApp con el resumen completo de tu pedido. Un asesor te responderá para coordinar la entrega.
              </p>

              <Link
                to="/"
                className="block w-full text-center text-xs font-bold text-[#8b1e1e] hover:underline mt-2 flex items-center justify-center gap-1"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default CartPage