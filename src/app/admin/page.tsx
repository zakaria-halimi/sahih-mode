import Link from 'next/link'
import Image from 'next/image'
import {
  Shirt,
  FolderTree,
  Eye,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { getProducts, getCategories } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import type { Product, Category } from '@/types'

export default async function AdminDashboardPage() {
  let products: Product[] = []
  let categories: Category[] = []

  try {
    // Dans l'admin, on peut récupérer les produits
    products = await getProducts()
    categories = await getCategories()
  } catch {
    // Si la DB n'est pas encore prête
  }

  const visibleCount = products.filter((p) => p.status === 'visible').length
  const featuredCount = products.filter((p) => p.featured).length
  const recentProducts = products.slice(0, 5)

  const stats = [
    {
      label: 'Total Vêtements',
      value: products.length,
      icon: Shirt,
      sub: 'Catalogue complet',
    },
    {
      label: 'Produits Visibles',
      value: visibleCount,
      icon: Eye,
      sub: 'En ligne sur la boutique',
    },
    {
      label: 'En Vedette',
      value: featuredCount,
      icon: Star,
      sub: 'Affichés sur l’accueil',
    },
    {
      label: 'Catégories',
      value: categories.length,
      icon: FolderTree,
      sub: 'Rayons actifs',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-1">
            Tableau de Bord
          </p>
          <h1 className="font-serif text-3xl text-black font-normal">
            Aperçu de la Boutique
          </h1>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            href="/admin/produits/nouveau"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau vêtement</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white border border-gray-200 p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  {s.label}
                </span>
                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div>
                <p className="font-serif text-3xl text-black font-light mb-1">
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 font-light">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl text-black font-normal">
              Derniers Vêtements Ajoutés
            </h2>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Articles récents de votre collection
            </p>
          </div>
          <Link
            href="/admin/produits"
            className="text-xs uppercase tracking-wider text-black hover:text-gray-600 font-medium inline-flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs uppercase tracking-wider">
            Aucun vêtement pour l&apos;instant.
            <div className="mt-4">
              <Link
                href="/admin/produits/nouveau"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter le premier article
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Article</th>
                  <th className="pb-3 font-medium">Catégorie</th>
                  <th className="pb-3 font-medium">Prix</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((p) => {
                  const img =
                    p.images?.[0] ||
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-12 bg-gray-100 border border-gray-200 shrink-0 overflow-hidden">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-serif font-medium text-black block truncate max-w-[180px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {p.category?.name || '—'}
                      </td>
                      <td className="py-4 font-medium text-black">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-4 text-gray-600">{p.stock} pcs</td>
                      <td className="py-4">
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
                      <td className="py-4 text-right">
                        <Link
                          href={`/admin/produits/${p.id}/modifier`}
                          className="text-black hover:underline uppercase tracking-wider text-[11px] font-medium"
                        >
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick guide */}
      <div className="bg-black text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Commande WhatsApp
          </span>
          <h3 className="font-serif text-xl font-normal">
            Configurer le numéro de réception des commandes
          </h3>
          <p className="text-xs text-gray-400 font-light mt-1 max-w-xl">
            Toutes les commandes des clients sur le site ouvrent une discussion
            WhatsApp vers votre numéro avec les détails complets du panier.
          </p>
        </div>
        <Link
          href="/admin/parametres"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs uppercase tracking-wider font-medium hover:bg-gray-100 transition-colors shrink-0"
        >
          <span>Gérer le numéro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
