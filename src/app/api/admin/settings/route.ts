import { NextResponse } from 'next/server'
import { publicSupabase } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Format invalide (settings array attendu)' },
        { status: 400 }
      )
    }

    for (const item of settings) {
      if (!item.key) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (publicSupabase.from('settings') as any).upsert(
        {
          key: item.key,
          value: item.value ?? '',
        },
        { onConflict: 'key' }
      )

      if (error) {
        console.error('Settings upsert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne du serveur'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
