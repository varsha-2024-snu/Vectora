import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
// POST /api/manager/return — Return sheet for rework
export async function POST(request) {
  try {
    const body = await request.json()
    const { sheet_id, comment } = body

    if (!sheet_id) {
      return NextResponse.json({ error: 'Sheet ID required' }, { status: 400 })
    }
    if (!comment?.trim()) {
      return NextResponse.json(
        { error: 'A comment is required when returning a sheet for rework' },
        { status: 400 }
      )
    }

    // Update goal_sheets SET status='returned', manager_comment=comment
    const { error: sheetErr } = await supabaseAdmin
      .from('goal_sheets')
      .update({ status: 'returned', manager_comment: comment })
      .eq('id', sheet_id)

    if (sheetErr) throw sheetErr

    return NextResponse.json({ success: true, message: 'Sheet returned with feedback' })
  } catch (err) {
    console.error('Return API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
