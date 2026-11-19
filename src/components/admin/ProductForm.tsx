'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Category, Product } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const PRESET_COLORS = ['Noir', 'Blanc', 'Gris', 'Beige', 'Kaki', 'Marine', 'Écru']

interface ProductFormProps {
  initialData?: Product
  categories: Category[]
  isEdit?: boolean
}

export default function ProductForm({
  initialData,
  categories,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  // Form states
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '')
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.original_price ? String(initialData.original_price) : ''
  )
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || categories[0]?.id || ''
  )
  const [sizes, setSizes] = useState<string[]>(
    initialData?.sizes || ['S', 'M', 'L']
  )
  const [colors, setColors] = useState<string[]>(
    initialData?.colors || ['Noir', 'Blanc']
  )
  const [customColor, setCustomColor] = useState('')
  const [stock, setStock] = useState(
    initialData?.stock !== undefined ? String(initialData.stock) : '10'
  )
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [status, setStatus] = useState<'visible' | 'hidden'>(
    initialData?.status || 'visible'
  )
  const [featured, setFeatured] = useState<boolean>(
    initialData?.featured || false
  )

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEdit) {
      setSlug(slugify(val))
    }
  }

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size))
    } else {
      setSizes([...sizes, size])
    }
  }

  const togglePresetColor = (color: string) => {
    if (colors.includes(color)) {
      setColors(colors.filter((c) => c !== color))
    } else {
      setColors([...colors, color])
    }
  }

  const addCustomColor = () => {
    if (!customColor.trim()) return
    const formatted = customColor.trim()
    if (!colors.includes(formatted)) {
      setColors([...colors, formatted])
    }
    setCustomColor('')
  }

  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter((c) => c !== colorToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Le nom du produit est requis')
      return
    }

    if (!price || isNaN(Number(price))) {
      toast.error('Veuillez indiquer un prix valide')
      return
    }

    if (sizes.length === 0) {
      toast.error('Sélectionnez au moins une taille')
      return
    }

    if (colors.length === 0) {
      toast.error('Sélectionnez au moins une couleur')
      return
    }

    setLoading(true)

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : null,
      category_id: categoryId || null,
      sizes,
      colors,
      stock: Number(stock) || 0,
      images,
      status,
      featured,
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          id: initialData?.id,
          isEdit,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement')
      }

      toast.success(isEdit ? 'Produit modifié avec succès !' : 'Produit créé avec succès !')
      router.push('/admin/produits')
      router.refresh()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const msg = errorObj?.message || (err instanceof Error ? err.message : 'Une erreur est survenue')
      toast.error(`Erreur: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/produits"
            className="p-2 border border-gray-200 hover:border-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl text-black font-normal">
              {isEdit ? 'Modifier le produit' : 'Nouveau vêtement'}
            </h1>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Renseignez les détails du produit pour l&apos;ajouter au catalogue
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            href="/admin/produits"
            className="flex-1 sm:flex-initial text-center px-5 py-2.5 border border-gray-300 text-xs uppercase tracking-wider text-black hover:border-black transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEdit ? 'Mettre à jour' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General info */}
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Informations Générales
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ex: T-shirt Oversize Essentiel"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Identifiant URL (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: t-shirt-oversize-essentiel"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black transition-colors bg-gray-50/50 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée de la coupe, du tissu, des finitions..."
                className="w-full border border-gray-300 p-4 text-sm text-black outline-none focus:border-black transition-colors resize-y"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Photographies du Produit
            </h2>
            <ImageUpload images={images} onChange={setImages} />
          </div>

          {/* Variants (Tailles & Couleurs) */}
          <div className="bg-white border border-gray-200 p-6 space-y-6">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Tailles & Couleurs
            </h2>

            {/* Sizes */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-3">
                Tailles disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 border text-xs uppercase font-medium tracking-wider transition-all ${
                      sizes.includes(size)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-3">
                Couleurs disponibles
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => togglePresetColor(c)}
                    className={`px-3 py-1.5 border text-xs tracking-wider transition-all ${
                      colors.includes(c)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Custom color input */}
              <div className="flex gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Autre couleur..."
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomColor()
                    }
                  }}
                  className="flex-1 border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider"
                >
                  Ajouter
                </button>
              </div>

              {/* Selected colors tag list */}
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider self-center">
                    Sélectionnées :
                  </span>
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-black text-xs"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => removeColor(c)}
                        className="text-gray-400 hover:text-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col) - Pricing, Category, Status */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Tarification & Stock
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Prix de vente (MAD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 350"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Ancien prix (Promo)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="ex: 450"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black text-gray-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Laisser vide si le vêtement n&apos;est pas en promotion.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Stock disponible
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="ex: 15"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Catégorie
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Catégorie du vêtement
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-black bg-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility & Featured */}
          <div className="bg-white border border-gray-200 p-6 space-y-5">
            <h2 className="font-serif text-base text-black font-medium border-b border-gray-100 pb-3">
              Visibilité & Mise en avant
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-2">
                Statut
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('visible')}
                  className={`py-2.5 text-xs uppercase tracking-wider font-medium border transition-colors ${
                    status === 'visible'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Visible
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('hidden')}
                  className={`py-2.5 text-xs uppercase tracking-wider font-medium border transition-colors ${
                    status === 'hidden'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Masqué
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-black">
                  Produit en vedette (Accueil)
                </span>
              </label>
              <p className="text-[11px] text-gray-400 mt-1 pl-7">
                S&apos;affichera dans la section Nouveautés sur la page d&apos;accueil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
