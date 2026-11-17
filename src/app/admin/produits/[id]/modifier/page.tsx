import { notFound } from 'next/navigation'
import { getCategories } from '@/lib/products'
import { createServerClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Modifier le Vêtement — SAHIH MODE Admin',
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerClient()

  let product: Product | null = null
  let categories = []

  try {
    categories = await getCategories()

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()

    if (error || !data) {
      notFound()
    }

    product = data as unknown as Product
  } catch {
    notFound()
  }

  if (!product) {
    notFound()
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      isEdit={true}
    />
  )
}
