import { publicSupabase } from '@/lib/supabase/public'
import type { Product, Category } from '@/types'

// ─── Filter shape ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  categorySlug?: string
  search?: string
  sizes?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  featured?: boolean
}

// ─── Helper: map raw DB row → typed Product ───────────────────────────────────

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    price: row.price as number,
    original_price: row.original_price as number | undefined,
    category_id: row.category_id as string,
    category: row.categories
      ? mapCategory(row.categories as Record<string, unknown>)
      : undefined,
    sizes: (row.sizes as string[]) ?? [],
    colors: (row.colors as string[]) ?? [],
    stock: row.stock as number,
    images: (row.images as string[]) ?? [],
    status: row.status as 'visible' | 'hidden',
    featured: row.featured as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | undefined,
    created_at: row.created_at as string,
  }
}

// ─── getProducts ──────────────────────────────────────────────────────────────

/**
 * Fetch visible products with optional filters.
 * Filters: category slug, full-text search, sizes, colors, price range.
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  const supabase = publicSupabase

  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('status', 'visible')
    .order('created_at', { ascending: false })

  if (filters.categorySlug) {
    // Join through the relationship: filter by category slug
    query = query.eq('categories.slug', filters.categorySlug)
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  if (filters.sizes && filters.sizes.length > 0) {
    // products where sizes array overlaps with the requested sizes
    query = query.overlaps('sizes', filters.sizes)
  }

  if (filters.colors && filters.colors.length > 0) {
    query = query.overlaps('colors', filters.colors)
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getProducts] Supabase error:', error.message)
    return []
  }

  // When filtering by category slug via a join, Supabase returns null for the
  // joined table when there's no match — filter those out.
  const rawData = (data as unknown as Array<Record<string, unknown>>) ?? []
  const rows = rawData.filter(
    (row) => !filters.categorySlug || row.categories !== null
  )

  return rows.map((row) => mapProduct(row))
}

// ─── getProductBySlug ─────────────────────────────────────────────────────────

/**
 * Fetch a single product by slug, including its category.
 * Returns null when not found or hidden.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = publicSupabase

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('status', 'visible')
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      // PGRST116 = "not found" — not an error worth logging
      console.error('[getProductBySlug] Supabase error:', error.message)
    }
    return null
  }

  if (!data) return null

  return mapProduct(data as Record<string, unknown>)
}

// ─── getFeaturedProducts ──────────────────────────────────────────────────────

/**
 * Fetch all featured, visible products (up to 12).
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true })
}

// ─── getCategories ────────────────────────────────────────────────────────────

/**
 * Fetch all categories ordered alphabetically.
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = publicSupabase

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('[getCategories] Supabase error:', error.message)
    return []
  }

  return (data ?? []).map((row) =>
    mapCategory(row as Record<string, unknown>)
  )
}

// ─── getSettings ──────────────────────────────────────────────────────────────

/**
 * Fetch all settings rows and return them as a plain key → value map.
 */
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = publicSupabase

  const { data, error } = await supabase.from('settings').select('key, value')

  if (error) {
    console.error('[getSettings] Supabase error:', error.message)
    return {}
  }

  const rawData = (data as unknown as Array<{ key: string; value: string }>) ?? []
  return rawData.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})
}

// ─── getSetting ───────────────────────────────────────────────────────────────

/**
 * Get a single setting by key, with an optional default value.
 */
export async function getSetting(
  key: string,
  defaultValue = ''
): Promise<string> {
  const supabase = publicSupabase

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error('[getSetting] Supabase error:', error.message)
    }
    return defaultValue
  }

  const rawItem = data as unknown as { value: string }
  return rawItem.value ?? defaultValue
}
