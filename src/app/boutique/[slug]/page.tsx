import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProducts } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ─── Dynamic metadata ───────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = params?.slug

  try {
    const product = await getProductBySlug(slug)
    if (!product) {
      return { title: 'Produit introuvable — SAHIH MODE' }
    }

    const image = product.images?.[0] ?? '/og-image.jpg'

    return {
      title: `${product.name} — SAHIH MODE`,
      description:
        product.description ||
        `Découvrez ${product.name} sur SAHIH MODE. Mode de luxe au Maroc.`,
      openGraph: {
        title: `${product.name} — SAHIH MODE`,
        description:
          product.description ||
          `Découvrez ${product.name} sur SAHIH MODE.`,
        images: [{ url: image, width: 800, height: 1067, alt: product.name }],
        type: 'article',
      },
    }
  } catch {
    return { title: 'SAHIH MODE' }
  }
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params?.slug

  let product: Product | null = null
  let relatedProducts: Product[] = []

  try {
    product = await getProductBySlug(slug)

    if (product?.category?.slug) {
      const all = await getProducts({ categorySlug: product.category.slug })
      relatedProducts = all
        .filter((p) => p.id !== product!.id)
        .slice(0, 4)
    }
  } catch {
    /* Supabase query fallback */
  }

  if (!product) {
    notFound()
  }

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  )
}
