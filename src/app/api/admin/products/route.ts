import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { publicSupabase } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, isEdit, ...payload } = body

    if (!payload.name || !payload.price) {
      return NextResponse.json(
        { error: 'Nom et prix obligatoires' },
        { status: 400 }
      )
    }

    if (isEdit && id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (publicSupabase.from('products') as any)
        .update(payload)
        .eq('id', id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Invalider le cache Next.js pour que les modifications apparaissent immédiatement sur le site
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/boutique')
      revalidatePath('/boutique', 'layout')
      revalidatePath('/admin/produits')
      revalidatePath(`/boutique/${payload.slug}`)

      return NextResponse.json({ success: true, action: 'updated' })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (publicSupabase.from('products') as any)
        .insert([payload])

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Invalider le cache Next.js
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/boutique')
      revalidatePath('/boutique', 'layout')
      revalidatePath('/admin/produits')

      return NextResponse.json({ success: true, action: 'created' })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne du serveur'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const { error } = await publicSupabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalider le cache pour supprimer immédiatement le produit de l'accueil et boutique
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/boutique')
    revalidatePath('/boutique', 'layout')
    revalidatePath('/admin/produits')

    return NextResponse.json({ success: true, action: 'deleted' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
