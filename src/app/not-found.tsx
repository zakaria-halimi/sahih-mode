import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page introuvable',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      {/* 404 number */}
      <h1
        className="font-serif font-bold leading-none text-black select-none"
        style={{ fontSize: 'clamp(7rem, 25vw, 18rem)' }}
        aria-label="Erreur 404"
      >
        404
      </h1>

      {/* Divider */}
      <div className="w-12 h-px bg-gray-300 my-8" />

      {/* Sub-heading */}
      <h2 className="font-serif text-2xl md:text-3xl text-black mb-4">
        Page introuvable
      </h2>

      {/* Description */}
      <p className="font-sans text-gray-400 text-sm leading-relaxed max-w-sm mb-10">
        La page que vous recherchez a peut-être été déplacée, supprimée ou
        n&apos;existe pas. Revenez à l&apos;accueil et continuez votre
        exploration.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center justify-center px-10 py-4 bg-black text-white text-sm font-medium tracking-[0.2em] uppercase font-sans transition-all duration-200 hover:bg-gray-800 active:scale-95"
      >
        Retour à l&apos;accueil
      </Link>

      {/* Secondary link */}
      <Link
        href="/boutique"
        className="mt-5 inline-flex items-center gap-1.5 text-sm tracking-widest uppercase font-sans text-gray-400 border-b border-gray-300 pb-0.5 hover:text-black hover:border-black transition-colors duration-200"
      >
        Voir la boutique
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
