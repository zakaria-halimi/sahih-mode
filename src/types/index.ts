export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  category_id: string
  category?: Category
  sizes: string[]
  colors: string[]
  stock: number
  images: string[]
  status: 'visible' | 'hidden'
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Settings {
  id: string
  key: string
  value: string
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}
