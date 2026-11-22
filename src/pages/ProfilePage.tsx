import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import {
  User, Phone, MapPin, Truck, CreditCard, FileText, Clock,
  LogOut, ChevronRight, ArrowRight, ShieldCheck, Award,
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const {
    user,
    cart,
    cartCount,
    currency,
    exchangeRate,
    cartTotalNio,
    cartTotalUsd,
  } = useStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState<string>('')
  const [editPhone, setEditPhone] = useState<string>('')
  const [editEmail, setEditEmail] = useState<string>('')

  const isNio = currency === 'NIO'
  const primarySymbol = isNio ? 'C$' : '$'

  // Simulated orders (in production, this would come from Supabase)
  const mockOrders = [
    {
      id: 'ORD-2026-001',
      date: '22/11/2026',
      status: 'completado',
      statusLabel: 'Entregado',
      statusColor: 'text-emerald-600',
      total: 1250,
      items: 3,
      itemsLabel: '3 productos',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'ORD-2026-002',
      date: '15/11/2026',
      status: 'en_preparacion',
      statusLabel: 'En preparación',
      statusColor: 'text-amber-600',
      total: 890,
      items: 2,
      itemsLabel: '2 productos',
      badge: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'ORD-2026-003',
      date: '08/11/2026',
      status: 'pendiente',
      statusLabel: 'Pendiente',
      statusColor: 'text-slate-600',
      total: 2140,
      items: 5,
      itemsLabel: '5 productos',
      badge: 'bg-slate-50 text-slate-700',
    },
  ]

  // Mock addresses
  const addresses = [
    {
      id: '1',
      label: 'Casa - Granada',
      address: 'De la Iglesia Xaldaltepe 2c al lago, casa esquinera color crema',
      type: 'principal',
    },
    {
      id: '2',
      label: 'Trabajo - Centro',
      address: 'Frente al Parque Central, oficina 2do piso',
      type: 'secundario',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar header for profile */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Account Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#8b1e1e]/10 text-[#8b1e1e] flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{user?.email || 'Usuario'}</h3>
                    <p className="text-xs text-slate-500">Miembro desde hoy</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">Correo electrónico</span>
                  </div>
                  <span className="text-xs text-slate-400 truncate max-w-xs">{user?.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">Teléfono</span>
                  </div>
                  <span className="text-xs text-slate-400">No registrado</span>
                </div>

                {/* Cart Count */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#8b1e1e]" />
                    <span className="text-sm text-slate-600 font-medium">Productos en carrito</span>
                  </div>
                  <span className="text-base font-bold text-[#8b1e1e]">{cartCount}</span>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName('')
                      setEditPhone('')
                      setEditEmail('')
                      setIsEditing(true)
                    }}
                    className="w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    Editar perfil
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Placeholder for order history action
                    }}
                    className="w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Ver historial de pedidos
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Volver al catálogo
                  </button>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-4">Soporte</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">WhatsApp Business</div>
                    <div className="text-xs text-slate-500">+505 7708-2552</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-slate-100">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">Horarios</div>
                    <div className="text-xs text-slate-500">Lun - Dom: 7:00 AM - 6:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Orders */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Mi cuenta</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Gestiona tus datos, direcciones y pedidos
                </p>
              </div>
            </div>

            {/* Welcome message */}
            <div className="bg-[#f8fafc] rounded-xl border border-slate-200 p-5 mb-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#8b1e1e] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">¡Hola, {user?.email || 'cliente'}!</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Bienvenido a tu cuenta de Carnicería El Domingazo. Aquí puedes ver tus pedidos
                    y gestionar tu información.
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Historial de Pedidos
                </h3>
              </div>

              <div className="divide-y divide-slate-50">
                {mockOrders.map((order) => (
                  <div key={order.id} className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-medium">
                          #{order.id.slice(-3)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">{order.id}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{order.date}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${order.badge}`}>
                          {order.statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Truck className="w-3 h-3" />
                          <span>{order.itemsLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900">{primarySymbol} {order.total.toFixed(2)}</div>
                      <button
                        type="button"
                        className="mt-1 py-1 px-3 text-xs font-medium text-[#8b1e1e] hover:bg-[#8b1e1e]/10 rounded-lg transition-colors"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ShoppingBag } from 'lucide-react'

export default ProfilePage