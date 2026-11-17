import Link from 'next/link'
import type { Metadata } from 'next'
import ProductCard from '@/components/ui/ProductCard'
import { getFeaturedProducts, getCategories, getSetting } from '@/lib/products'
import type { Product, Category } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SAHIH MODE — Mode Luxe & Authentique',
  description:
    'Découvrez SAHIH MODE, votre destination mode de luxe au Maroc. Collections exclusives, pièces soigneusement sélectionnées, livraison rapide.',
}

/* ─── Static fallback categories ────────────────────────────────────── */

const FALLBACK_CATEGORIES: { name: string; slug: string; emoji: string }[] = [
  { name: 'Robes', slug: 'robes', emoji: '👗' },
  { name: 'Hauts', slug: 'hauts', emoji: '👚' },
  { name: 'Pantalons', slug: 'pantalons', emoji: '👖' },
  { name: 'Accessoires', slug: 'accessoires', emoji: '👜' },
  { name: 'Chaussures', slug: 'chaussures', emoji: '👠' },
  { name: 'Vestes', slug: 'vestes', emoji: '🧥' },
]

/* ─── Page component ─────────────────────────────────────────────────── */

export default async function HomePage() {
  let featuredProducts: Product[] = []
  let categories: Category[] = []
  let whatsappPhone = '212600000000'
  let storeName = 'SAHIH MODE'

  try {
    ;[featuredProducts, categories, whatsappPhone, storeName] =
      await Promise.all([
        getFeaturedProducts(),
        getCategories(),
        getSetting('whatsapp_phone', '212600000000'),
        getSetting('store_name', 'SAHIH MODE'),
      ])
  } catch {
    /* Supabase not configured — render with fallbacks */
  }

  const displayedProducts = featuredProducts.slice(0, 8)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
        {/* Subtle gradient backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"
        />

        {/* Decorative lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-sans">
            Collection 2025
          </span>

          {/* Brand name */}
          <h1 className="font-serif text-[clamp(3.5rem,12vw,9rem)] font-bold leading-none tracking-tight text-white mb-6">
            SAHIH MODE
          </h1>

          {/* Divider */}
          <div className="w-16 h-px bg-gray-600 mb-8" />

          {/* Tagline */}
          <p className="font-sans text-gray-300 text-[clamp(0.9rem,2vw,1.2rem)] max-w-xl leading-relaxed mb-12 font-light tracking-wide">
            L&apos;élégance authentique à votre portée. Mode de luxe, crafted
            with passion.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/boutique"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-4 bg-white text-black text-xs sm:text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:bg-gray-100 active:scale-95 text-center"
            >
              Découvrir la Collection
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-4 border border-gray-700 text-white text-xs sm:text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:border-white hover:text-white active:scale-95 text-center"
            >
              Notre Histoire
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] tracking-[0.3em] uppercase font-sans text-gray-400">
            Découvrir
          </span>
          <div className="w-px h-10 bg-gray-500 animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.35em] uppercase text-gray-400 font-sans">
              Explorer
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-black">
              Nos Catégories
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories.length > 0
              ? categories.map((cat) => ({
                  name: cat.name,
                  slug: cat.slug,
                  emoji:
                    FALLBACK_CATEGORIES.find((f) => f.slug === cat.slug)
                      ?.emoji ?? '🛍️',
                }))
              : FALLBACK_CATEGORIES
            ).map((cat) => (
              <Link
                key={cat.slug}
                href={`/boutique?category=${cat.slug}`}
                className="group flex flex-col items-center justify-center gap-3 py-8 px-4 border border-gray-200 hover:border-black transition-all duration-300 hover:bg-black hover:text-white text-center"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {cat.emoji}
                </span>
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase font-sans text-gray-700 group-hover:text-white transition-colors duration-300">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-sans text-black border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors duration-200"
            >
              Voir toutes les catégories
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.35em] uppercase text-gray-400 font-sans">
              Sélection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-black">
              Nouveautés
            </h2>
          </div>

          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                {displayedProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 4}
                  />
                ))}
              </div>
              <div className="text-center mt-14">
                <Link
                  href="/boutique"
                  className="inline-flex items-center justify-center px-10 py-4 border border-black text-black text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:bg-black hover:text-white active:scale-95"
                >
                  Voir toute la boutique
                </Link>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <p className="font-sans text-gray-400 text-sm tracking-wide mb-6">
                La collection arrive bientôt…
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-sans text-black border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors duration-200"
              >
                Nous contacter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHY SAHIH MODE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.35em] uppercase text-gray-400 font-sans">
              Nos engagements
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-black">
              Pourquoi SAHIH MODE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Qualité */}
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 flex items-center justify-center border border-gray-200">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">
                  Qualité Exceptionnelle
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  Chaque pièce est soigneusement sélectionnée pour sa qualité
                  de fabrication et ses matières nobles. Nous n&apos;acceptons
                  que le meilleur.
                </p>
              </div>
            </div>

            {/* Livraison */}
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 flex items-center justify-center border border-gray-200">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Livraison Express</h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  Livraison rapide partout au Maroc. Votre commande est
                  préparée avec soin et expédiée dans les plus brefs délais.
                </p>
              </div>
            </div>

            {/* Service Client */}
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 flex items-center justify-center border border-gray-200">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Service Client</h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  Notre équipe est disponible 7j/7 via WhatsApp pour répondre
                  à toutes vos questions et vous accompagner dans vos choix.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          NEWSLETTER CTA
      ══════════════════════════════════════════════════════════════════ */}
      <NewsletterSection storeName={storeName} />
    </>
  )
}

/* ─── Newsletter section (client-safe static component) ─────────────── */

function NewsletterSection({ storeName }: { storeName: string }) {
  return (
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.35em] uppercase text-gray-500 font-sans">
          Restez informé
        </span>
        <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-5 text-white">
          Rejoignez la Famille {storeName}
        </h2>
        <p className="font-sans text-gray-400 text-sm leading-relaxed mb-10">
          Recevez en avant-première nos nouvelles collections, offres exclusives
          et conseils mode directement dans votre boîte mail.
        </p>

        <NewsletterForm />
      </div>
    </section>
  )
}

/* ─── Newsletter form (needs 'use client' — extracted inline) ────────── */
// Since this is a server component file we use a form action approach
function NewsletterForm() {
  return (
    <form
      action="#"
      onSubmit={undefined}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="votre@email.com"
        className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-5 py-3 text-sm font-sans focus:outline-none focus:border-gray-400 transition-colors duration-200"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center px-8 py-3 bg-white text-black text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:bg-gray-100 active:scale-95 whitespace-nowrap"
      >
        S&apos;abonner
      </button>
    </form>
  )
}
