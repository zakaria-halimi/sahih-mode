'use client'

import { useEffect, useState } from 'react'
import Link from 'next/image'
import Image from 'next/image'
import NextLink from 'next/link'
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import {
  formatPrice,
  buildWhatsAppUrl,
  generateCartWhatsAppMessage,
} from '@/lib/utils'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartStore((s) => s.total())
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleWhatsAppOrder = () => {
    const phone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'
    const message = generateCartWhatsAppMessage({
      storeName: 'SAHIH MODE',
      items: items.map((i) => ({
        name: i.product.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
      })),
      total,
    })
    const url = buildWhatsAppUrl(phone, message)
    window.open(url, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 border border-gray-200 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-400 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-3xl text-black mb-3 font-normal">
          Votre panier est vide
        </h1>
        <p className="text-gray-500 text-sm max-w-md mb-8 font-light">
          Découvrez notre collection raffinée de vêtements contemporains et commencez votre sélection.
        </p>
        <NextLink
          href="/boutique"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-gray-900 transition-all"
        >
          Découvrir la collection
          <ArrowRight className="w-4 h-4" />
        </NextLink>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-gray-200 pb-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
              Panier
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-black font-normal">
              Vos Articles ({itemCount})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-black uppercase tracking-wider transition-colors mt-3 sm:mt-0 underline underline-offset-4"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Items list */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const img =
                  item.product.images?.[0] ||
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'

                return (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="py-6 sm:py-8 flex gap-4 sm:gap-6"
                  >
                    {/* Thumbnail */}
                    <NextLink
                      href={`/boutique/${item.product.slug}`}
                      className="relative w-20 h-28 sm:w-28 sm:h-36 bg-gray-50 shrink-0 border border-gray-100 overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </NextLink>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <NextLink
                            href={`/boutique/${item.product.slug}`}
                            className="font-serif text-base sm:text-lg text-black hover:text-gray-600 transition-colors"
                          >
                            {item.product.name}
                          </NextLink>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.product.id, item.size, item.color)
                            }
                            className="text-gray-400 hover:text-black transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                          <span>
                            Taille : <strong className="text-black">{item.size}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Couleur : <strong className="text-black">{item.color}</strong>
                          </span>
                        </div>

                        <p className="text-sm font-medium text-black">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity & line total */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="inline-flex items-center border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-black tracking-tight">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-6">
              <NextLink
                href="/boutique"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black hover:text-gray-600 font-medium"
              >
                ← Continuer les achats
              </NextLink>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="border border-gray-200 p-6 sm:p-8 bg-gray-50/50 sticky top-24">
              <h2 className="font-serif text-xl text-black mb-6 font-normal">
                Récapitulatif
              </h2>

              <div className="space-y-4 text-sm pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium text-black">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-black font-medium">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-6 border-b border-gray-200 mb-6">
                <span className="font-serif text-lg text-black">Total</span>
                <span className="text-2xl font-light text-black tracking-tight">
                  {formatPrice(total)}
                </span>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-black text-white hover:bg-gray-900 text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm active:scale-[0.99] mb-4"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Commander via WhatsApp
              </button>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed mb-6 font-light">
                Validation immédiate et personnalisée de votre commande directement avec notre équipe sur WhatsApp.
              </p>

              <div className="space-y-3 pt-6 border-t border-gray-200 text-xs text-gray-600">
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-black shrink-0" />
                  <span>Livraison partout au Maroc</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Paiement sécurisé à la livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
