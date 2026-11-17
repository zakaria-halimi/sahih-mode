'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const navItems = [
  {
    name: 'Tableau de bord',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Vêtements',
    href: '/admin/produits',
    icon: Shirt,
    exact: false,
  },
  {
    name: 'Catégories',
    href: '/admin/categories',
    icon: FolderTree,
    exact: false,
  },
  {
    name: 'Paramètres',
    href: '/admin/parametres',
    icon: Settings,
    exact: false,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Déconnexion réussie')
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black text-white w-64 border-r border-gray-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <span className="font-serif text-lg tracking-[0.2em] font-medium uppercase block">
            SAHIH MODE
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-sans block mt-0.5">
            Espace Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase font-medium transition-all ${
                active
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition-colors uppercase tracking-wider"
        >
          <span>Voir la boutique</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors uppercase tracking-wider text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar toggle */}
      <div className="lg:hidden bg-black text-white px-4 py-3 flex items-center justify-between border-b border-gray-800 sticky top-0 z-40">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-1 text-gray-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-serif text-sm tracking-[0.2em] uppercase">
          SAHIH MODE • ADMIN
        </span>
        <div className="w-6" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-black z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex shrink-0 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  )
}
