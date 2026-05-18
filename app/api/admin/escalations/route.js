import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailNotification } from '@/lib/email'
import { sendTeamsNotification } from '@/lib/teams'

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, ...payload } = body

    if (action === 'update_rule') {
      const { rule_id, updates } = payload
      const { error } = await supabaseAdmin.from('escalation_rules').update(updates).eq('id', rule_id)
      if (error) throw error
      return NextResponse.json({ success: true, message: 'Rule updated' })
    }

    if (action === 'resolve_event') {
      const { event_id } = payload
      const { error } = await supabaseAdmin.from('escalation_events').update({ resolved: true }).eq('id', event_id)
      if (error) throw error
      return NextResponse.json({ success: true, message: 'Event resolved' })
    }

    if (action === 'run_check') {
      // 1. Fetch active rules
      const { data: rules } = await supabaseAdmin.from('escalation_rules').select('*').eq('is_active', true)
      if (!rules || rules.length === 0) return NextResponse.json({ success: true, message: 'No active rules', newEscalations: 0 })

      // 2. Fetch users, sheets, and active cycles
      const { data: users } = await supabaseAdmin.from('users').select('id, email, full_name, role, manager_id').eq('role', 'employee')
      const { data: sheets } = await supabaseAdmin.from('goal_sheets').select('*')
      const { data: cycles } = await supabaseAdmin.from('cycles').select('*').eq('is_active', true)
      const { data: existingEvents } = await supabaseAdmin.from('escalation_events').select('*').eq('resolved', false)
      
      const activeCycle = cycles?.[0]
      const newEvents = []

      // Helper to check if event already exists
      const eventExists = (rid, uid) => existingEvents.some(e => e.rule_id === rid && e.target_user === uid)

      for (const user of users) {
        const sheet = sheets.find(s => s.employee_id === user.id)
        
        for (const rule of rules) {
          if (rule.rule_type === 'submission_overdue') {
            // If employee has no sheet or it's a draft
            if (!sheet || sheet.status === 'draft') {
              if (!eventExists(rule.id, user.id)) {
                newEvents.push({
                  rule_id: rule.id,
                  target_user: user.id,
                  days_overdue: rule.threshold_days + 2, // simulated overdue calculation
                  resolved: false
                })

                // Notify Employee & Manager
                const title = `Escalation: Goal Submission Overdue`
                const msg = `This is an automated escalation. Please submit your goals immediately.`
                sendEmailNotification(user.email, title, `<p>Hi ${user.full_name},</p><p>${msg}</p>`).catch(console.error)
                sendTeamsNotification(title, msg, "Open Dashboard", "http://localhost:3000/employee/goals").catch(console.error)
              }
            }
          }
          
          if (rule.rule_type === 'checkin_overdue') {
            // Check if there's an active checkin window and no comment yet (simple check for demo)
            if (activeCycle && activeCycle.phase.startsWith('q')) {
              // Usually we'd check achievements. Here we just flag if sheet exists but no achievement/comment
              if (sheet && sheet.status === 'approved') {
                 if (!eventExists(rule.id, user.id)) {
                    newEvents.push({
                      rule_id: rule.id,
                      target_user: user.id,
                      days_overdue: rule.threshold_days + 1,
                      resolved: false
                    })
                 }
              }
            }
          }
        }
      }

      if (newEvents.length > 0) {
        const { error: insertErr } = await supabaseAdmin.from('escalation_events').insert(newEvents)
        if (insertErr) throw insertErr
      }

      return NextResponse.json({ success: true, newEscalations: newEvents.length })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  } catch (error) {
    console.error('Escalations API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
