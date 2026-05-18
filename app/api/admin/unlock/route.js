import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/admin/unlock — Unlock a locked goal sheet (RULE-A2)
export async function POST(request) {
  try {
    const body = await request.json()
    const { sheet_id, reason, admin_id } = body

    if (!sheet_id || !reason?.trim()) {
      return NextResponse.json({ error: 'Sheet ID and reason are required' }, { status: 400 })
    }

    // Unlock the sheet
    const { error: sheetErr } = await supabaseAdmin
      .from('goal_sheets')
      .update({ locked: false, status: 'submitted' })
      .eq('id', sheet_id)

    if (sheetErr) throw sheetErr

    // Write audit log entry (RULE-A2)
    await supabaseAdmin.from('audit_logs').insert({
      sheet_id,
      changed_by: admin_id || 'admin',
      field_name: 'locked',
      old_value: 'true',
      new_value: 'false',
      change_reason: reason
    })

    return NextResponse.json({ success: true, message: 'Sheet unlocked. Audit entry created.' })
  } catch (err) {
    console.error('Unlock API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
