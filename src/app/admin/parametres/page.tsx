'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, MessageCircle, Store, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Settings
  const [whatsappNumber, setWhatsappNumber] = useState('212600000000')
  const [storeName, setStoreName] = useState('SAHIH MODE')
  const [heroTitle, setHeroTitle] = useState('L’ÉLÉGANCE REDÉFINIE')
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Collection contemporaine pensée pour les esprits exigeants.'
  )
  const [aboutText, setAboutText] = useState(
    'SAHIH MODE est une marque marocaine fondée sur les principes d’élégance, de pureté des lignes et d’excellence des matières.'
  )

  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        let data: { key: string; value: string }[] = []
        if (res.ok) {
          const json = await res.json()
          data = json.settings || []
        } else {
          const { data: dbData } = await supabase.from('settings').select('*')
          data = (dbData as { key: string; value: string }[]) || []
        }

        if (data && data.length > 0) {
          data.forEach((item: { key: string; value: string }) => {
            if (item.key === 'whatsapp_number' || item.key === 'whatsapp_phone') setWhatsappNumber(item.value)
            if (item.key === 'store_name') setStoreName(item.value)
            if (item.key === 'hero_title') setHeroTitle(item.value)
            if (item.key === 'hero_subtitle') setHeroSubtitle(item.value)
            if (item.key === 'about_text') setAboutText(item.value)
          })
        }
      } catch {
        // En local avant Supabase
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const settingsToSave = [
      { key: 'whatsapp_number', value: whatsappNumber.trim() },
      { key: 'whatsapp_phone', value: whatsappNumber.trim() },
      { key: 'store_name', value: storeName.trim() },
      { key: 'hero_title', value: heroTitle.trim() },
      { key: 'hero_subtitle', value: heroSubtitle.trim() },
      { key: 'about_text', value: aboutText.trim() },
    ]

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToSave }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      toast.success('Paramètres enregistrés avec succès !')
      router.refresh()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const msg = errorObj?.message || (err instanceof Error ? err.message : 'Erreur de sauvegarde')
      toast.error(`Erreur: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-1">
            Configuration
          </p>
          <h1 className="font-serif text-3xl text-black font-normal">
            Paramètres de la Boutique
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Gérez votre numéro de vente WhatsApp et les textes de votre vitrine
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Enregistrer</span>
        </button>
      </div>

      {/* WhatsApp Configuration Card */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-black font-medium">
              Numéro de Commande WhatsApp
            </h2>
            <p className="text-xs text-gray-500 font-light">
              Toutes les commandes des clients seront envoyées vers ce numéro
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
            Numéro de téléphone WhatsApp (avec indicatif pays, sans espace ni +)
          </label>
          <div className="relative max-w-md">
            <span className="absolute left-3.5 top-2.5 text-sm text-gray-400 font-mono">
              +
            </span>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) =>
                setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))
              }
              placeholder="212600000000"
              className="w-full border border-gray-300 pl-8 pr-4 py-2.5 text-sm text-black outline-none focus:border-black font-mono tracking-wider"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Exemple pour le Maroc : <strong>212612345678</strong> (sans le 0 initial).
          </p>
        </div>
      </div>

      {/* Store Identity */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 border border-black flex items-center justify-center">
            <Store className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-black font-medium">
              Identité de la Boutique
            </h2>
            <p className="text-xs text-gray-500 font-light">
              Nom et textes affichés aux visiteurs
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
            Nom de la Marque
          </label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black max-w-md"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
            Titre Principal (Bannière Accueil)
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
            Sous-titre (Bannière Accueil)
          </label>
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
            Texte de Présentation / À Propos
          </label>
          <textarea
            rows={4}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full border border-gray-300 p-4 text-sm text-black outline-none focus:border-black resize-y"
          />
        </div>
      </div>
    </form>
  )
}
