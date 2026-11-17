import { getCategories } from '@/lib/products'
import ProductForm from '@/components/admin/ProductForm'
import type { Category } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nouveau Vêtement — SAHIH MODE Admin',
}

export default async function NewProductPage() {
  let categories: Category[] = []
  try {
    categories = await getCategories()
  } catch {
    // Si catégories pas encore insérées
  }

  return <ProductForm categories={categories} isEdit={false} />
}
