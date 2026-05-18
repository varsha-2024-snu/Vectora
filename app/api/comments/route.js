import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/comments — Save manager check-in comment
export async function POST(request) {
  try {
    const body = await request.json()
    const { sheet_id, quarter, manager_id, comment_text } = body

    if (!sheet_id || !quarter || !manager_id || !comment_text?.trim()) {
      return NextResponse.json({ error: 'Sheet ID, quarter, manager ID, and comment text are all required' }, { status: 400 })
    }

    // Delete existing comment for this sheet+quarter+manager, then insert new
    await supabaseAdmin
      .from('checkin_comments')
      .delete()
      .eq('sheet_id', sheet_id)
      .eq('quarter', quarter)
      .eq('manager_id', manager_id)

    const { error } = await supabaseAdmin
      .from('checkin_comments')
      .insert({ sheet_id, quarter, manager_id, comment_text })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Check-in comment saved' })
  } catch (err) {
    console.error('Comments API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
