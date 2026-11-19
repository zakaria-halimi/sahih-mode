'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Category } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  // Form states for new or edit
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      } else {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        if (error) throw error
        setCategories((data as unknown as Category[]) || [])
      }
    } catch {
      // Supabase pas encore configuré
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingId) {
      setSlug(slugify(val))
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setName('')
    setSlug('')
    setDescription('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim() || null,
    }

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          id: editingId,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement')
      }

      toast.success(editingId ? 'Catégorie mise à jour !' : 'Catégorie ajoutée !')
      cancelEdit()
      fetchCategories()
      router.refresh()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const msg = errorObj?.message || (err instanceof Error ? err.message : 'Une erreur est survenue')
      toast.error(`Erreur : ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      const res = await fetch(`/api/admin/categories?id=${categoryToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      toast.success('Catégorie supprimée')
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      router.refresh()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const msg = errorObj?.message || (err instanceof Error ? err.message : 'Erreur de suppression')
      toast.error(`Impossible de supprimer : ${msg}`)
    } finally {
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-1">
          Organisation
        </p>
        <h1 className="font-serif text-3xl text-black font-normal">
          Gestion des Catégories
        </h1>
        <p className="text-xs text-gray-500 font-light mt-1">
          Créez les rayons pour structurer le catalogue de vêtements
        </p>
      </div>

      {/* Create / Edit Form */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-serif text-base text-black font-medium mb-4 flex items-center justify-between">
          <span>
            {editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </span>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-gray-400 hover:text-black uppercase tracking-wider flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Annuler
            </button>
          )}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-1.5">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ex: Hauts & T-shirts"
                className="w-full border border-gray-300 px-3.5 py-2 text-xs outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-1.5">
                Identifiant URL (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: hauts-t-shirts"
                className="w-full border border-gray-300 px-3.5 py-2 text-xs outline-none focus:border-black bg-gray-50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black mb-1.5">
              Description (optionnelle)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description affichée sur la boutique..."
              className="w-full border border-gray-300 px-3.5 py-2 text-xs outline-none focus:border-black"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{editingId ? 'Mettre à jour' : 'Ajouter'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50/70">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-black">
            Catégories Existantes ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs uppercase tracking-wider text-gray-400">
            Aucune catégorie créée pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <h3 className="font-serif text-base text-black font-medium">
                    {cat.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-400 mt-0.5">
                    <span className="font-mono">/{cat.slug}</span>
                    {cat.description && (
                      <>
                        <span>•</span>
                        <span className="text-gray-500 font-light truncate max-w-sm">
                          {cat.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        title="Supprimer cette catégorie"
        message={`Êtes-vous certain de vouloir supprimer la catégorie "${categoryToDelete?.name}" ? Les produits associés ne seront pas supprimés mais n'auront plus de catégorie.`}
        confirmText="Supprimer"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  )
}
