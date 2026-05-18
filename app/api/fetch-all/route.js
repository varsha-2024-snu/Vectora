import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const [
      { data: cycles },
      { data: sheets },
      { data: goals },
      { data: ach },
      { data: comments },
      { data: audit },
      { data: escRules },
      { data: escEvents },
    ] = await Promise.all([
      supabaseAdmin.from('cycles').select('*'),
      supabaseAdmin.from('goal_sheets').select('*'),
      supabaseAdmin.from('goals').select('*'),
      supabaseAdmin.from('achievements').select('*'),
      supabaseAdmin.from('checkin_comments').select('*'),
      supabaseAdmin.from('audit_logs').select('*').order('changed_at', { ascending: false }),
      supabaseAdmin.from('escalation_rules').select('*'),
      supabaseAdmin.from('escalation_events').select('*'),
    ])

    // Map database structures to the format expected by the frontend's SEED object
    const data = {
      cycles: cycles?.map(c => ({
        id: c.id, phase: c.phase, lbl: c.label, open: c.window_open, close: c.window_close, active: c.is_active
      })) || [],
      sheets: sheets?.map(s => ({
        id: s.id, eid: s.employee_id, cid: s.cycle_id, status: s.status, locked: s.locked, note: s.manager_comment
      })) || [],
      goals: goals?.map(g => ({
        id: g.id, sid: g.sheet_id, area: g.thrust_area, title: g.title, uom: g.uom_type,
        tv: g.target_value, td: g.target_date, w: Number(g.weightage), shared: g.is_shared, ro: g.is_readonly
      })) || [],
      ach: ach?.map(a => ({
        id: a.id, gid: a.goal_id, q: a.quarter, val: a.actual_value, dt: a.actual_date,
        st: a.status, sc: a.progress_score ? Number(a.progress_score) : null
      })) || [],
      comments: comments?.map(c => ({
        id: c.id, sid: c.sheet_id, q: c.quarter, mid: c.manager_id, txt: c.comment_text, at: c.created_at
      })) || [],
      audit: audit?.map(a => ({
        id: a.id, by: a.changed_by, text: `${a.field_name}: ${a.old_value} → ${a.new_value}`, at: a.changed_at
      })) || [],
      escR: escRules?.map(r => ({
        id: r.id, type: r.rule_type, label: r.label, active: r.is_active
      })) || [],
      escE: escEvents?.map(e => ({
        id: e.id, target: e.target_user, overdue: e.days_overdue, at: e.triggered_at, resolved: e.resolved
      })) || [],
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fetch all failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
