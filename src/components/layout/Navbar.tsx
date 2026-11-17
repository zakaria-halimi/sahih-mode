'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/contact', label: 'À Propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount())

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  /* ── Transparent-on-hero logic ─────────────────────────────────── */
  const setupObserver = useCallback(() => {
    // Observe the first section or hero element on the page
    const hero =
      document.querySelector('[data-hero]') ||
      document.querySelector('section:first-of-type') ||
      null

    if (observerRef.current) observerRef.current.disconnect()

    if (hero) {
      heroRef.current = hero
      observerRef.current = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
      )
      observerRef.current.observe(hero)
    } else {
      // No hero — always solid
      setScrolled(true)
    }
  }, [])

  useEffect(() => {
    setupObserver()
    return () => observerRef.current?.disconnect()
  }, [pathname, setupObserver])

  /* ── Lock body scroll when mobile menu is open ─────────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── Close mobile menu on route change ─────────────────────────── */
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isTransparent = !scrolled && !mobileOpen

  return (
    <>
      {/* ── Main navbar ──────────────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'bg-white border-b border-gray-100 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
        )}
      >
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'font-serif text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold select-none whitespace-nowrap',
              'transition-colors duration-200',
              isTransparent ? 'text-white' : 'text-black'
            )}
          >
            SAHIH MODE
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'text-xs font-medium tracking-widest uppercase',
                      'relative pb-0.5 transition-colors duration-200',
                      'after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-200 after:content-[""]',
                      'hover:after:w-full',
                      active
                        ? isTransparent
                          ? 'text-white after:w-full after:bg-white'
                          : 'text-black after:w-full after:bg-black'
                        : isTransparent
                          ? 'text-white/80 hover:text-white after:bg-white'
                          : 'text-gray-600 hover:text-black after:bg-black'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/panier"
              aria-label={`Panier (${itemCount} article${itemCount !== 1 ? 's' : ''})`}
              className={cn(
                'relative p-1 transition-colors duration-200',
                isTransparent
                  ? 'text-white hover:text-white/70'
                  : 'text-black hover:text-gray-600'
              )}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white leading-none">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className={cn(
                'md:hidden p-1 transition-colors duration-200',
                isTransparent
                  ? 'text-white hover:text-white/70'
                  : 'text-black hover:text-gray-600'
              )}
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen menu ───────────────────────────────── */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 bg-white flex flex-col',
          'transition-all duration-300 ease-in-out',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Spacer for the navbar height */}
        <div className="h-16 shrink-0" />

        <nav className="flex-1 flex flex-col justify-center px-10 pb-16">
          <ul className="flex flex-col gap-8 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label }, i) => {
              const active = pathname === href
              return (
                <li
                  key={href}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                  }}
                  className={cn(
                    'transition-all duration-300',
                    mobileOpen
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                  )}
                >
                  <Link
                    href={href}
                    className={cn(
                      'font-serif text-4xl font-medium tracking-wide',
                      'transition-colors duration-200',
                      active ? 'text-black' : 'text-gray-400 hover:text-black'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider + cart link */}
          <div
            className={cn(
              'mt-12 pt-8 border-t border-gray-100',
              'transition-all duration-300',
              mobileOpen ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? '280ms' : '0ms' }}
          >
            <Link
              href="/panier"
              className="inline-flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              Panier
              {itemCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
