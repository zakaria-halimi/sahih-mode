'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Category, Product } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface ProductsListClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductsListClient({
  initialProducts,
  categories,
}: ProductsListClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === '' || p.category_id === selectedCategory

    const matchesStatus =
      selectedStatus === '' || p.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Delete product
  const handleDelete = async () => {
    if (!productToDelete) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      toast.success(`Le produit "${productToDelete.name}" a été supprimé`)
      router.refresh()
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const msg = errorObj?.message || (err instanceof Error ? err.message : 'Erreur de suppression')
      toast.error(`Échec de suppression : ${msg}`)
    } finally {
      setDeleting(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-1">
            Catalogue
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-black font-normal">
            Gestion des Vêtements
          </h1>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''} au total
          </p>
        </div>

        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-medium transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un vêtement</span>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom ou identifiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-black bg-white"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2.5 text-xs outline-none focus:border-black bg-white cursor-pointer"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 px-3 py-2.5 text-xs outline-none focus:border-black bg-white cursor-pointer"
        >
          <option value="">Tous les statuts</option>
          <option value="visible">Visible</option>
          <option value="hidden">Masqué</option>
        </select>
      </div>

      {/* Products Content */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs uppercase tracking-wider">
            Aucun vêtement ne correspond aux critères.
          </div>
        ) : (
          <>
            {/* ── Mobile Card List (md:hidden) ────────────────────── */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredProducts.map((p) => {
                const img =
                  p.images?.[0] ||
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'

                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="relative w-20 h-24 bg-gray-100 border border-gray-200 shrink-0 overflow-hidden">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                        {p.featured && (
                          <span className="absolute top-1 left-1 bg-black text-white p-0.5">
                            <Star className="w-3 h-3 fill-white" />
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-sm font-medium text-black truncate">
                            {p.name}
                          </h3>
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold shrink-0 ${
                              p.status === 'visible'
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {p.status === 'visible' ? 'Visible' : 'Masqué'}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {p.category?.name || 'Sans catégorie'}
                        </p>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-semibold text-black">
                            {formatPrice(p.price)}
                          </span>
                          {p.original_price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(p.original_price)}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-500 mt-1">
                          Stock : <strong className={p.stock > 0 ? 'text-black' : 'text-red-500'}>{p.stock} pcs</strong>
                        </p>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/boutique/${p.slug}`}
                        target="_blank"
                        className="flex-1 py-2 px-3 border border-gray-200 text-center text-xs uppercase tracking-wider text-gray-600 hover:text-black flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Aperçu</span>
                      </Link>
                      <Link
                        href={`/admin/produits/${p.id}/modifier`}
                        className="flex-1 py-2 px-3 bg-black text-white text-center text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        className="p-2 border border-red-200 text-red-600 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Desktop Table (hidden md:block) ─────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Photo</th>
                    <th className="py-3 px-4 font-semibold">Nom & Slug</th>
                    <th className="py-3 px-4 font-semibold">Catégorie</th>
                    <th className="py-3 px-4 font-semibold">Prix (MAD)</th>
                    <th className="py-3 px-4 font-semibold">Tailles</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Statut</th>
                    <th className="py-3 px-4 font-semibold">Vedette</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const img =
                      p.images?.[0] ||
                      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Photo */}
                        <td className="py-3 px-4">
                          <div className="relative w-12 h-14 bg-gray-100 border border-gray-200 overflow-hidden">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <div className="max-w-[200px]">
                            <span className="font-serif font-medium text-black block truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              /{p.slug}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-gray-600">
                          {p.category?.name || '—'}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-black">
                            {formatPrice(p.price)}
                          </span>
                          {p.original_price && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              {formatPrice(p.original_price)}
                            </span>
                          )}
                        </td>

                        {/* Sizes */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[120px]">
                            {p.sizes?.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-700"
                              >
                                {s}
                              </span>
                            ))}
                            {(p.sizes?.length || 0) > 4 && (
                              <span className="text-[10px] text-gray-400 self-center">
                                +{p.sizes.length - 4}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              p.stock > 0 ? 'text-black' : 'text-red-500'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium ${
                              p.status === 'visible'
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {p.status === 'visible' ? 'Visible' : 'Masqué'}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-4">
                          {p.featured ? (
                            <Star className="w-4 h-4 text-black fill-black" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/boutique/${p.slug}`}
                              target="_blank"
                              title="Voir sur le site"
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/admin/produits/${p.id}/modifier`}
                              title="Modifier"
                              className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              title="Supprimer"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        title="Supprimer ce vêtement"
        message={`Êtes-vous certain de vouloir supprimer définitivement "${productToDelete?.name}" ? Cette action est irréversible.`}
        confirmText={deleting ? 'Suppression...' : 'Supprimer définitivement'}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  )
}
