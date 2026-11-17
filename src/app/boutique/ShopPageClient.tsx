'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import type { Product, Category } from '@/types'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────────────── */

interface Filters {
  search: string
  categories: string[]
  sizes: string[]
  colors: string[]
  minPrice: string
  maxPrice: string
}

type SortKey = 'newest' | 'price_asc' | 'price_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
]

const COLOR_MAP: Record<string, string> = {
  noir: '#000000',
  blanc: '#ffffff',
  rouge: '#dc2626',
  bleu: '#2563eb',
  vert: '#16a34a',
  rose: '#ec4899',
  beige: '#d4b896',
  gris: '#6b7280',
  orange: '#ea580c',
  violet: '#7c3aed',
  jaune: '#ca8a04',
  marron: '#78350f',
}

function getColorSwatch(color: string): string {
  return COLOR_MAP[color.toLowerCase()] ?? '#a3a3a3'
}

/* ─── Component ──────────────────────────────────────────────────────── */

interface ShopPageClientProps {
  products: Product[]
  categories: Category[]
}

export default function ShopPageClient({
  products,
  categories,
}: ShopPageClientProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categories: [],
    sizes: [],
    colors: [],
    minPrice: '',
    maxPrice: '',
  })
  const [sort, setSort] = useState<SortKey>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  /* ── Derived option lists ─── */
  const allSizes = useMemo(
    () =>
      Array.from(new Set(products.flatMap((p) => p.sizes))).sort((a, b) => {
        const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        const ia = order.indexOf(a.toUpperCase())
        const ib = order.indexOf(b.toUpperCase())
        if (ia !== -1 && ib !== -1) return ia - ib
        return a.localeCompare(b)
      }),
    [products]
  )

  const allColors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors))).sort(),
    [products]
  )

  /* ── Filter + sort logic ─── */
  const filtered = useMemo(() => {
    let result = [...products]

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (filters.categories.length > 0) {
      result = result.filter(
        (p) => p.category && filters.categories.includes(p.category.slug)
      )
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((s) => p.sizes.includes(s))
      )
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        filters.colors.some((c) => p.colors.includes(c))
      )
    }

    if (filters.minPrice !== '') {
      const min = parseFloat(filters.minPrice)
      if (!isNaN(min)) result = result.filter((p) => p.price >= min)
    }

    if (filters.maxPrice !== '') {
      const max = parseFloat(filters.maxPrice)
      if (!isNaN(max)) result = result.filter((p) => p.price <= max)
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    // 'newest' is already sorted by created_at desc from server

    return result
  }, [products, filters, sort])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.categories.length) n += filters.categories.length
    if (filters.sizes.length) n += filters.sizes.length
    if (filters.colors.length) n += filters.colors.length
    if (filters.minPrice) n++
    if (filters.maxPrice) n++
    return n
  }, [filters])

  /* ── Helpers ─── */
  const toggleArray = useCallback(
    (key: 'categories' | 'sizes' | 'colors', value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key].includes(value)
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      sizes: [],
      colors: [],
      minPrice: '',
      maxPrice: '',
    })
  }, [])

  /* Close mobile drawer on outside click */
  useEffect(() => {
    if (!mobileFiltersOpen) return
    function handle(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [mobileFiltersOpen])

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileFiltersOpen])

  /* ── Filter panel (shared between desktop sidebar and mobile drawer) ─── */
  const FilterPanel = (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-black mb-4">
            Catégorie
          </h3>
          <div className="flex flex-col gap-2.5">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggleArray('categories', cat.slug)}
                  className="w-4 h-4 border border-gray-300 rounded-none accent-black cursor-pointer"
                />
                <span className="font-sans text-sm text-gray-600 group-hover:text-black transition-colors duration-150">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {allSizes.length > 0 && (
        <div>
          <h3 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-black mb-4">
            Taille
          </h3>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleArray('sizes', size)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium font-sans tracking-wider uppercase border transition-all duration-150',
                  filters.sizes.includes(size)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {allColors.length > 0 && (
        <div>
          <h3 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-black mb-4">
            Couleur
          </h3>
          <div className="flex flex-wrap gap-3">
            {allColors.map((color) => {
              const hex = getColorSwatch(color)
              const isSelected = filters.colors.includes(color)
              return (
                <button
                  key={color}
                  onClick={() => toggleArray('colors', color)}
                  title={color}
                  aria-label={`Couleur ${color}${isSelected ? ' (sélectionnée)' : ''}`}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all duration-150 relative',
                    isSelected ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke={hex === '#ffffff' ? '#000' : '#fff'}
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <h3 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-black mb-4">
          Prix (MAD)
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
            className="w-full border border-gray-200 px-3 py-2 text-sm font-sans text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="w-full border border-gray-200 px-3 py-2 text-sm font-sans text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200"
          />
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="text-left text-xs font-sans text-gray-400 hover:text-black tracking-widest uppercase border-b border-gray-200 pb-0.5 w-fit transition-colors duration-150"
        >
          Réinitialiser ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="border-b border-gray-100 py-14 px-6 text-center bg-gray-50">
        <span className="text-[10px] tracking-[0.35em] uppercase text-gray-400 font-sans">
          Découvrir
        </span>
        <h1 className="font-serif text-4xl md:text-5xl mt-3 text-black">
          Notre Boutique
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        {/* ── Top bar: search + sort + mobile filter btn ─── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              placeholder="Rechercher un produit…"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-200 text-sm font-sans text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-200 px-4 py-3 text-sm font-sans text-black focus:outline-none focus:border-black transition-colors duration-200 bg-white cursor-pointer min-w-[180px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 border border-black text-sm font-medium font-sans tracking-widest uppercase whitespace-nowrap"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filtres
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-10">
          {/* ── Desktop sidebar filters ─── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            {FilterPanel}
          </aside>

          {/* ── Product grid area ─── */}
          <div className="flex-1 min-w-0">
            {/* Count */}
            <p className="font-sans text-xs text-gray-400 tracking-widest uppercase mb-6">
              {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-7">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 4}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onReset={resetFilters} hasFilters={activeFilterCount > 0 || filters.search !== ''} />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer (bottom sheet) ─── */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Filtres"
        >
          <div
            ref={drawerRef}
            className="absolute bottom-0 left-0 right-0 bg-white max-h-[85vh] overflow-y-auto rounded-t-2xl"
          >
            {/* Drawer header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-sans text-sm font-medium tracking-[0.15em] uppercase">
                Filtres
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-gray-400">({activeFilterCount})</span>
                )}
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer les filtres"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">{FilterPanel}</div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3.5 bg-black text-white text-sm font-medium tracking-[0.2em] uppercase font-sans active:scale-95 transition-transform duration-150"
              >
                Voir {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Empty state ────────────────────────────────────────────────────── */

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void
  hasFilters: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        className="w-14 h-14 text-gray-200 mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
      <h3 className="font-serif text-2xl text-black mb-3">
        Aucun produit trouvé
      </h3>
      <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-xs mb-8">
        {hasFilters
          ? 'Aucun produit ne correspond à vos critères. Essayez de modifier vos filtres.'
          : 'La collection arrive bientôt. Revenez nous voir !'}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-8 py-3 border border-black text-black text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:bg-black hover:text-white active:scale-95"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )
}
