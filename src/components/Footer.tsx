import React from 'react'
import { MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react'
import { BusinessInfo } from '../types'

interface FooterProps {
  business: BusinessInfo | null
}

export const Footer: React.FC<FooterProps> = ({ business }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12 border-t-4 border-[#8b1e1e]">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={business?.logo_url || '/logo-domingazo.jpg'}
                alt="Carnicería El Domingazo"
                className="w-12 h-12 rounded-full border-2 border-white object-cover bg-white"
              />
              <div>
                <h3 className="text-lg font-black text-white leading-none">
                  CARNICERÍA <span className="text-[#facc15]">EL DOMINGAZO</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Abarrotes · Carnes · Vegetales · Calidad y Frescura
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-4">
              Tu tienda de carnes y abarrotes de confianza en Granada, Nicaragua. Ofrecemos cortes selectos de res, cerdo y pollo de primera calidad con entrega rápida a domicilio y atención personalizada.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Frescura garantizada en cada libra
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Contacto y Ubicación
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#facc15] shrink-0 mt-0.5" />
                <span>Granada, Nicaragua</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                <a
                  href={`https://wa.me/${(business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {business?.whatsapp_phone || '+505 7708-2552'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Lunes a Domingo: 6:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Fast Delivery Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Modalidades de Compra
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                <span className="font-bold text-white block mb-0.5">🛵 A Domicilio</span>
                <span>Coordinamos envíos rápidos en todo el casco urbano de Granada.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                <span className="font-bold text-white block mb-0.5">🏪 Retiro en Tienda</span>
                <span>Haz tu pedido por la web y pasa a recogerlo listo y empacado.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Carnicería El Domingazo. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Tienda en línea impulsada por</span>
            <span className="font-bold text-white">MI PYME</span>
            <span>🚀</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
