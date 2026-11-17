'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import Badge from './Badge'
import { ProductCardSkeleton } from './Skeleton'

/* ─── Props ──────────────────────────────────────────────────────────── */

interface ProductCardProps {
  product: Product
  priority?: boolean
  loading?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ProductCard({
  product,
  priority = false,
  loading = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [hovered, setHovered] = useState(false)

  if (loading) return <ProductCardSkeleton />

  const {
    slug,
    name,
    price,
    original_price,
    images,
    featured,
    category,
  } = product

  const primaryImage = images?.[0] ?? null
  const secondImage = images?.[1] ?? null

  const isPromo = original_price !== undefined && original_price > price
  const discountPct = isPromo
    ? Math.round(((original_price! - price) / original_price!) * 100)
    : 0

  const href = `/boutique/${slug}`

  return (
    <article
      className={cn(
        'group flex flex-col gap-3',
        'product-card-hover'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image wrapper ─────────────────────────────────────── */}
      <Link href={href} className="relative block overflow-hidden aspect-[3/4] bg-gray-50">
        {/* Primary image */}
        {primaryImage && !imageError ? (
          <Image
            src={primaryImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-all duration-500',
              // zoom on hover
              hovered ? 'scale-105' : 'scale-100',
              // fade out when second image is available
              secondImage && hovered ? 'opacity-0' : 'opacity-100'
            )}
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-300 text-xs tracking-widest uppercase">
              No image
            </span>
          </div>
        )}

        {/* Second image (shown on hover) */}
        {secondImage && (
          <Image
            src={secondImage}
            alt={`${name} — vue alternative`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-opacity duration-500 absolute inset-0',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isPromo && (
            <Badge variant="promo" discount={discountPct} />
          )}
          {featured && !isPromo && (
            <Badge variant="nouveau" />
          )}
        </div>

        {/* "Voir le produit" overlay */}
        <div
          className={cn(
            'absolute inset-0 flex items-end justify-center pb-5 z-10',
            'transition-opacity duration-200',
            hovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="inline-flex items-center justify-center px-6 py-2.5 bg-white/90 backdrop-blur-[2px] text-black text-[11px] font-medium tracking-[0.18em] uppercase">
            Voir le produit
          </span>
        </div>
      </Link>

      {/* ── Info ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 px-0.5">
        {/* Category */}
        {category?.name && (
          <span className="text-[10px] text-gray-400 tracking-widest uppercase">
            {category.name}
          </span>
        )}

        {/* Name */}
        <Link
          href={href}
          className="text-sm font-medium text-black leading-snug hover:text-gray-600 transition-colors duration-200 line-clamp-2"
        >
          {name}
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn('text-sm font-medium', isPromo && 'text-black')}>
            {formatPrice(price)}
          </span>
          {isPromo && original_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(original_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
