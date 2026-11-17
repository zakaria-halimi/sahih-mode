import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Ne pas bloquer si les clés Supabase sont encore en placeholder en local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protège toutes les routes /admin sauf /admin/login
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login')
    ) {
      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Si déjà connecté et va sur /admin/login, redirige vers /admin
    if (req.nextUrl.pathname === '/admin/login' && session) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  } catch {
    // Si erreur d'auth, autorise le passage pour ne pas bloquer le dev
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
