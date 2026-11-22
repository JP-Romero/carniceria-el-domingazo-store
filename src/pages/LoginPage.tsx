import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { User, Phone, ShieldCheck, ArrowRight, Home, Mail, Loader2, X } from 'lucide-react'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, signIn, signUp, signOut, resetPassword } = useStore()

  const [step, setStep] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleLogin = async () => {
    setIsSubmitting(true)
    try {
      await signIn(email, password)
      setIsSubmitting(false)
      navigate('/')
    } catch (e) {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async () => {
    setIsSubmitting(true)
    try {
      await signUp(email, password, name, phone)
      setIsSubmitting(false)
      navigate('/')
    } catch (e) {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleReset = async () => {
    setShowReset(true)
    try {
      await resetPassword(email)
      setShowReset(false)
    } catch (e) {
      setShowReset(false)
    }
  }

  if (user?.id) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-[#f8fafc]">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm text-slate-500">Ingresar</span>
            </Link>
            {user?.id ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Cerrar sesión"
              >
                <X className="w-3.5 h-3.5" />
                Cerrar
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <span>Ingresar</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          {/* Auth Tabs */}
          <div className="border-b border-slate-100 mb-6">
            <button
              type="button"
              onClick={() => setStep('login')}
              className={`flex-1 py-3 text-sm font-medium text-[#8b1e1e] border-b-2 border-transparent transition-all ${step === 'login' ? 'border-[#8b1e1e] text-[#8b1e1e]' : 'text-slate-500'}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setStep('register')}
              className={`flex-1 py-3 text-sm font-medium text-slate-500 transition-all ${step === 'register' ? 'text-[#8b1e1e]' : ''}`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Correo electrónico *
              </label>
              <input
                type="email"
                placeholder="Ej. juan.perez@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Contraseña *
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
              />
            </div>

            {/* Name (only for register) */}
            {step === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                />
              </div>
            )}

            {/* Phone (only for register) */}
            {step === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  placeholder="Ej. 8888-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
                />
              </div>
            )}

            {/* CTA */}
            <button
              type="button"
              onClick={step === 'login' ? handleLogin : handleRegister}
              className="w-full flex items-center justify-center gap-2 bg-[#8b1e1e] text-white font-extrabold py-4 px-6 rounded-xl shadow-md shadow-[#8b1e1e]/30 text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#731818] hover:shadow-[#8b1e1e]/50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : step === 'login' ? (
                <span>Iniciar sesión</span>
              ) : (
                <span>Crear cuenta</span>
              )}
            </button>
          </div>

          {/* Register extra note */}
          {step === 'register' && (
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              El teléfono es opcional y servirá para coordinar entregas por WhatsApp.
            </p>
          )}

          {/* Forgot password */}
          <p className="text-xs text-slate-400 mt-4">
            ¿Olvidaste tu contraseña?
            <span
              onClick={() => setShowReset(!showReset)}
              className="hover:text-[#8b1e1e] underline underline-offset-2 font-medium cursor-pointer"
            >
              Restablecer
            </span>
          </p>

          {/* Reset password form */}
          {showReset && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="Ej. juan.perez@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8b1e1e]/20 focus:border-[#8b1e1e]"
              />
              <button
                type="button"
                onClick={handleReset}
                className="w-full mt-3 py-2 bg-[#8b1e1e] text-white text-sm font-bold rounded-xl transition-all hover:bg-[#731818]"
              >
                Enviar enlace
              </button>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Revisa tu bandeja de entrada.
              </p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="p-6 sm:p-8 border-t border-slate-100 bg-[#f8fafc] text-xs text-slate-500">
          <p className="leading-relaxed">
            Al ingresar, tu carrito se guardará y podrás ver tu historial de pedidos. Si prefieres
            continuar sin cuenta, puedes usar WhatsApp directamente.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage