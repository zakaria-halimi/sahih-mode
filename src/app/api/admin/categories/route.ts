import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { publicSupabase } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, slug, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
    }

    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (publicSupabase.from('categories') as any)
        .update(payload)
        .eq('id', id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/boutique')
      revalidatePath('/boutique', 'layout')
      revalidatePath('/admin/categories')

      return NextResponse.json({ success: true, action: 'updated' })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (publicSupabase.from('categories') as any)
        .insert([payload])

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/boutique')
      revalidatePath('/boutique', 'layout')
      revalidatePath('/admin/categories')

      return NextResponse.json({ success: true, action: 'created' })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
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
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/boutique')
    revalidatePath('/boutique', 'layout')
    revalidatePath('/admin/categories')

    return NextResponse.json({ success: true, action: 'deleted' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await publicSupabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: data ?? [] })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
