import React from 'react'
import { MapPin, Phone, Clock, ShieldCheck, Heart, Settings, Mail, Facebook, Instagram } from 'lucide-react'
import { BusinessInfo } from '../types'
import { Link } from 'react-router-dom'

interface FooterProps {
  business: BusinessInfo | null
  onOpenAdmin?: () => void
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 mt-12 border-t-4 border-[#8b1e1e]">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {/* COMPRA */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Compra</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/categorias" className="hover:text-white transition-colors">Categorías</Link></li>
              <li><Link to="/categoria/Ofertas" className="hover:text-white transition-colors">Ofertas de la semana</Link></li>
              <li><Link to="/buscar" className="hover:text-white transition-colors">Buscar productos</Link></li>
            </ul>
          </div>

          {/* MI CUENTA */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Mi Cuenta</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Crear cuenta</Link></li>
              <li><Link to="/mi-cuenta/pedidos" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
              <li><Link to="/mi-cuenta/direcciones" className="hover:text-white transition-colors">Mis Direcciones</Link></li>
              <li><Link to="/mi-cuenta/favoritos" className="hover:text-white transition-colors">Favoritos</Link></li>
            </ul>
          </div>

          {/* AYUDA AL CLIENTE */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Ayuda al cliente</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href={`tel:${business?.phone || '+50522222222'}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                  Contáctanos
                </a>
              </li>
              <li><Link to="/ayuda/preguntas-frecuentes" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/legal/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/legal/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/legal/devoluciones" className="hover:text-white transition-colors">Política de Devoluciones</Link></li>
            </ul>
          </div>

          {/* APP DOWNLOADS */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Descarga la app</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-colors text-xs"
              >
                <span className="text-white">📱</span>
                <span className="text-white font-medium">App Store</span>
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-colors text-xs"
              >
                <span className="text-[#4CAF50]">📱</span>
                <span className="text-white font-medium">Google Play</span>
              </a>
            </div>
          </div>

          {/* BRAND INFO */}
          <div className="lg:col-span-2">
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
                  Carnicería & Supermercado · Granada, Nicaragua
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-4">
              Tu carnicería de confianza en Granada. Cortes selectos de res, cerdo y pollo de primera calidad con entrega rápida a domicilio y atención personalizada.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Frescura garantizada en cada libra
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8" />

        {/* Payment Methods & Social */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Payment Methods */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aceptamos:</span>
            <div className="flex items-center gap-2">
              <div className="w-14 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.1/flags/4x3/ni.svg" alt="Visa" className="w-10 h-6 object-contain" />
              </div>
              <div className="w-14 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="w-10 h-6 object-contain" />
              </div>
              <div className="w-20 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm font-bold text-slate-700 text-xs">
                Tarjeta El Domingazo
              </div>
              <div className="w-14 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm font-bold text-slate-700 text-xs">
                Efectivo
              </div>
              <div className="w-14 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm font-bold text-slate-700 text-xs">
                Transferencia
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              aria-label="Facebook"
            >
              <div className="text-white text-sm">f</div>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              aria-label="Instagram"
            >
              <div className="text-white text-sm font-medium">ig</div>
            </a>
            <a
              href={`https://wa.me/${(business?.whatsapp_phone || '+50577082552').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#22c55e] flex items-center justify-center hover:bg-[#16a34a] transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="space-x-4 flex-wrap">
            <span>© {currentYear} Carnicería El Domingazo. Todos los derechos reservados.</span>
            <Link to="/legal/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link to="/legal/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
            <Link to="/ayuda/preguntas-frecuentes" className="hover:text-white transition-colors">Preguntas Frecuentes</Link>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Tienda en línea impulsada por</span>
            <span className="font-bold text-white">MI PYME</span>
            <span>🚀</span>
          </div>
        </div>
      </div>
    </footer>
  )
}