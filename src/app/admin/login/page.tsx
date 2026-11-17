'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(`Connexion échouée : ${error.message}`)
      } else {
        toast.success('Bienvenue dans l’espace administration')
        router.push('/admin')
        router.refresh()
      }
    } catch {
      toast.error('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full border border-gray-200 p-8 sm:p-10 bg-white shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.25em] font-medium uppercase text-black inline-block mb-2"
          >
            SAHIH MODE
          </Link>
          <div className="w-8 h-px bg-black mx-auto my-3" />
          <h2 className="font-serif text-lg text-black font-normal">
            Espace d&apos;Administration
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Connectez-vous pour gérer votre catalogue et vos commandes
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sahihmode.ma"
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-black outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-black outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-black text-white hover:bg-gray-900 text-xs uppercase tracking-[0.2em] font-medium transition-all disabled:opacity-50 mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
          >
            ← Retourner à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
