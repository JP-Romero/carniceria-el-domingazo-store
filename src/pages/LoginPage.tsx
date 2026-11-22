import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { User, Phone, ShieldCheck, ArrowRight, Home } from 'lucide-react'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { business } = useStore()

  const storeWhatsApp = (business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')
  const waUrl = `https://wa.me/${storeWhatsApp}`

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 sm:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <span className="text-[#8b1e1e]">Ingresar</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Acceso al Pedido</h2>
              <p className="text-sm text-slate-500">
                Coordina tu pedido directamente con Carnicería El Domingazo
              </p>
            </div>

            <div className="space-y-5">
              {/* Phone Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  Tu Teléfono
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="Ej. 8888-9999 o +505 7708-2552"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  Tu Nombre
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                  />
                </div>
              </div>

              {/* CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] text-white font-extrabold py-4 px-4 rounded-xl shadow-md shadow-emerald-500/20 text-sm sm:text-base transition-all cursor-pointer block"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Continuar por WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                No necesitas contraseña. Tu nombre y teléfono nos servirán para confirmar tu pedido y
                coordinar la entrega a domicilio en Granada.
              </p>

              {/* Notes */}
              <div className="border border-slate-200 rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-700">¿Cómo funciona?</div>
                    <div className="text-[10px] text-slate-500 leading-relaxed">
                      1. Abres WhatsApp con tu teléfono y nombre.<br/>
                      2. Nos comunicas lo que deseas comprar.<br/>
                      3. Coordinamos entrega a domicilio o retiro en tienda.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center gap-4 text-xs text-slate-400">
              <span>¿Necesitas ayuda?</span>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#8b1e1e] font-medium">
                Escríbenos
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <a href="#" className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2">
            Volver al catálogo
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage