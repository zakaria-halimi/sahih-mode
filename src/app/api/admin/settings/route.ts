import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

    // Invalider le cache pour mettre à jour immédiatement les textes et le numéro WhatsApp
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/boutique')
    revalidatePath('/boutique', 'layout')
    revalidatePath('/contact')

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne du serveur'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await publicSupabase.from('settings').select('*')
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ settings: data ?? [] })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
