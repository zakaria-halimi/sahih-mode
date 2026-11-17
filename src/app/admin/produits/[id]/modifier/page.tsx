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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('products') as any)
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
