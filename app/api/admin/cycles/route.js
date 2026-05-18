import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/admin/cycles — Toggle cycle window active state
export async function POST(request) {
  try {
    const body = await request.json()
    const { cycle_id, is_active } = body

    if (!cycle_id) {
      return NextResponse.json({ error: 'Cycle ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('cycles')
      .update({ is_active: !!is_active })
      .eq('id', cycle_id)

    if (error) throw error

    return NextResponse.json({ success: true, message: `Cycle ${is_active ? 'opened' : 'closed'}` })
  } catch (err) {
    console.error('Cycles API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
