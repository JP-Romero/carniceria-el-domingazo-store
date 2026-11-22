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
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-1">
      {/* Banner Carousel Card - Compact Style */}
      <div className={`relative overflow-hidden rounded-2xl ${banner.accent} text-white shadow-md transition-all duration-500`}>
        <div className="relative z-10 px-5 sm:px-10 py-6 sm:py-8 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#facc15]" />
            {banner.tag}
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-2">
            {banner.title}
          </h2>

          <p className="text-white/90 text-xs sm:text-sm mb-4 font-normal leading-relaxed line-clamp-2">
            {banner.subtitle}
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 text-[10px] font-medium text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
            {banner.badge}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Anterior"
            className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1 px-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  current === idx ? 'w-5 bg-[#facc15]' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente"
            className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Supermarket Value Props Bar - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#8b1e1e] flex items-center justify-center shrink-0 font-black text-sm">
            🥩
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate">Cortes Selectos</h4>
            <p className="text-[10px] text-slate-500 truncate">Res, cerdo y pollo fresco</p>
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-emerald-600 flex items-center justify-center shrink-0 font-black text-sm">
            🛵
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate">Delivery Rápido</h4>
            <p className="text-[10px] text-slate-500 truncate">En toda Granada</p>
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black text-sm">
            💵
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate">Pago Cómodo</h4>
            <p className="text-[10px] text-slate-500 truncate">Efectivo C$/USD o Transferencia</p>
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black text-sm">
            💬
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate">Pedidos WhatsApp</h4>
            <p className="text-[10px] text-slate-500 truncate">Atención personalizada</p>
          </div>
        </div>
      </div>
    </div>
  )
}
