import { getProducts, getCategories } from '@/lib/products'
import ProductsListClient from './ProductsListClient'
import type { Product, Category } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gestion des Vêtements — SAHIH MODE Admin',
}

export default async function AdminProductsPage() {
  let products: Product[] = []
  let categories: Category[] = []

  try {
    products = await getProducts()
    categories = await getCategories()
  } catch {
    // Si Supabase vide
  }

  return (
    <ProductsListClient initialProducts={products} categories={categories} />
  )
}
