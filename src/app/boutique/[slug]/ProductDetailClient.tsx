'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import {
  formatPrice,
  buildWhatsAppUrl,
  generateProductWhatsAppMessage,
} from '@/lib/utils'
import ProductCard from '@/components/ui/ProductCard'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || 'M'
  )
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || 'Noir'
  )
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const addItem = useCartStore((s) => s.addItem)

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85']

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100
        )
      : null

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success(`${product.name} ajouté au panier !`, {
      style: {
        background: '#000',
        color: '#fff',
        borderRadius: '0px',
        border: '1px solid #333',
        fontSize: '13px',
        letterSpacing: '0.05em',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#000',
      },
    })
  }

  const handleWhatsAppOrder = () => {
    const phone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'
    const message = generateProductWhatsAppMessage({
      storeName: 'SAHIH MODE',
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      price: product.price,
    })
    const url = buildWhatsAppUrl(phone, message)
    window.open(url, '_blank')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Découvrez ${product.name} sur SAHIH MODE`,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Lien copié dans le presse-papier !')
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-xs tracking-wider uppercase text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/boutique" className="hover:text-black transition-colors">
              Boutique
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <Link
                  href={`/boutique?categorie=${product.category.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-black font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Images gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 border transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main large image */}
            <div className="relative flex-1 aspect-[3/4] bg-gray-50 overflow-hidden border border-gray-100 group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-black text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1">
                  -{discount}%
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="border-b border-gray-200 pb-6 mb-6">
              {product.category && (
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">
                  {product.category.name}
                </p>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-black font-normal mb-4 tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-light text-black tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8 text-sm text-gray-600 leading-relaxed font-light">
                <p>{product.description}</p>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-black">
                    Taille : <span className="font-normal text-gray-600">{selectedSize}</span>
                  </label>
                  <span className="text-xs text-gray-400 underline cursor-pointer hover:text-black">
                    Guide des tailles
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 border text-xs font-medium tracking-wider uppercase transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-3">
                  Couleur : <span className="font-normal text-gray-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 px-4 border text-xs font-medium tracking-wider uppercase transition-all ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 text-black hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-black mb-3">
                Quantité
              </label>
              <div className="inline-flex items-center border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-black">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 mb-8">
              {/* WhatsApp direct order */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-black text-white hover:bg-gray-900 text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Commander via WhatsApp
              </button>

              {/* Add to cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-black text-black hover:bg-black hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Lien copié !
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    Partager ce produit
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="border-t border-gray-200 pt-6 space-y-4 text-xs text-gray-600">
              <div className="flex items-center space-x-3">
                <Truck className="w-4 h-4 text-black shrink-0" />
                <span>Livraison partout au Maroc (24h - 48h)</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>Paiement à la livraison après inspection</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-4 h-4 text-black shrink-0" />
                <span>Échange possible sous 7 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 lg:mt-32 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
                Sélection
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-black">
                Vous aimerez aussi
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
