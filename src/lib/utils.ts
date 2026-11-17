import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}

export function generateProductWhatsAppMessage(params: {
  storeName: string
  productName: string
  size: string
  color: string
  quantity: number
  price: number
}): string {
  const total = params.price * params.quantity
  return `Bonjour ${params.storeName}, je souhaite commander :\n${params.productName} - Taille ${params.size} - ${params.color} - Quantité ${params.quantity} - Prix ${formatPrice(params.price)}\nTotal : ${formatPrice(total)}\nMerci de valider ma commande.`
}

export function generateCartWhatsAppMessage(params: {
  storeName: string
  items: Array<{
    name: string
    size: string
    color: string
    quantity: number
    price: number
  }>
  total: number
}): string {
  const lines = params.items.map(
    (item) =>
      `• ${item.name} - Taille ${item.size} - ${item.color} - Qté ${item.quantity} - ${formatPrice(item.price * item.quantity)}`
  )
  return `Bonjour ${params.storeName}, je souhaite commander :\n\n${lines.join('\n')}\n\nTotal : ${formatPrice(params.total)}\nMerci de valider ma commande.`
}
