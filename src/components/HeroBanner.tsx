import React, { useState, useEffect } from 'react'
import { Sparkles, ShieldCheck, Clock, Truck, ChevronRight, ChevronLeft } from 'lucide-react'

const BANNERS = [
  {
    tag: 'FRESCO DEL DÍA',
    title: 'Cortes Selectos de Res y Cerdo',
    subtitle: 'Lomo, posta, costilla, molida y cortes especiales con el mejor grosor para tu asado familiar o negocio.',
    accent: 'bg-gradient-to-r from-[#8b1e1e] via-[#991b1b] to-[#7f1d1d]',
    badge: '100% Calidad Garantizada',
  },
  {
    tag: 'OFERTAS POR LIBRA',
    title: 'Pollo Fresco y Embutidos Artesanales',
    subtitle: 'Chorizos criollos, mortadela, salchichón y pechuga al mejor precio de toda Granada.',
    accent: 'bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#78350f]',
    badge: 'Precios Especiales al Por Mayor',
  },
  {
    tag: 'PEDIDOS FÁCILES',
    title: 'Haz tu pedido en línea y recibe en tu puerta',
    subtitle: 'Elige tus productos, confirma tu dirección y paga contra entrega en efectivo o transferencia bancaria.',
    accent: 'bg-gradient-to-r from-[#065f46] via-[#047857] to-[#0f766e]',
    badge: 'Envíos Rápidos en Granada',
  },
]

export const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % BANNERS.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)

  const banner = BANNERS[current]

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-2">
      {/* Banner Carousel Card */}
      <div className={`relative overflow-hidden rounded-2xl ${banner.accent} text-white shadow-lg transition-all duration-500`}>
        <div className="relative z-10 px-6 sm:px-12 py-8 sm:py-12 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
            {banner.tag}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            {banner.title}
          </h2>

          <p className="text-white/90 text-sm sm:text-base mb-5 font-normal leading-relaxed">
            {banner.subtitle}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/25 text-xs font-medium text-white/90">
            <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
            {banner.badge}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Anterior"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5 px-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  current === idx ? 'w-6 bg-[#facc15]' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Supermarket Value Props Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8b1e1e] flex items-center justify-center shrink-0 font-black text-lg">
            🥩
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Cortes Selectos</h4>
            <p className="text-[11px] text-slate-500">Res, cerdo y pollo fresco</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center shrink-0 font-black text-lg">
            🛵
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Delivery Rápido</h4>
            <p className="text-[11px] text-slate-500">En toda Granada, Nicaragua</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black text-lg">
            💵
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Pago Cómodo</h4>
            <p className="text-[11px] text-slate-500">Efectivo C$/USD o Transferencia</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black text-lg">
            💬
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Pedidos WhatsApp</h4>
            <p className="text-[11px] text-slate-500">Atención ágil y personalizada</p>
          </div>
        </div>
      </div>
    </div>
  )
}
