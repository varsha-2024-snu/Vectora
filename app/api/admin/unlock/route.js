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

    const { data: sheet, error: sheetFetchErr } = await supabaseAdmin
      .from('goal_sheets')
      .select('id, locked, status')
      .eq('id', sheet_id)
      .single()

    if (sheetFetchErr || !sheet) {
      return NextResponse.json({ error: 'Goal sheet not found' }, { status: 404 })
    }

    if (!sheet.locked) {
      return NextResponse.json({ error: 'Sheet is not currently locked' }, { status: 400 })
    }

    // Unlock the sheet
    const { error: sheetErr } = await supabaseAdmin
      .from('goal_sheets')
      .update({ locked: false, status: 'submitted' })
      .eq('id', sheet_id)

    if (sheetErr) throw sheetErr

    // Write audit log entry (RULE-A2)
    const { error: auditErr } = await supabaseAdmin.from('audit_logs').insert({
      entity_type: 'goal_sheet',
      entity_id: sheet_id,
      changed_by: admin_id || 'admin',
      field_name: 'locked',
      old_value: 'true',
      new_value: 'false',
      action: 'unlock'
    })

    if (auditErr) throw auditErr

    return NextResponse.json({ success: true, message: 'Sheet unlocked. Audit entry created.' })
  } catch (err) {
    console.error('Unlock API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
