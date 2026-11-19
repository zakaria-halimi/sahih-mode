import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/products'
import type { Product, Category } from '@/types'
import ShopPageClient from './ShopPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Boutique — SAHIH MODE',
  description:
    'Explorez notre collection complète : robes, hauts, pantalons, accessoires et bien plus. Filtrez par taille, couleur et prix.',
  openGraph: {
    title: 'Boutique — SAHIH MODE',
    description: 'Collections exclusives SAHIH MODE. Mode de luxe au Maroc.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function BoutiquePage() {
  let products: Product[] = []
  let categories: Category[] = []

  try {
    ;[products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ])
  } catch {
    /* Supabase not configured — render empty state */
  }

  return <ShopPageClient products={products} categories={categories} />
}
