import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailNotification } from '@/lib/email'
import { sendTeamsNotification } from '@/lib/teams'

export async function POST(request) {
  try {
    const body = await request.json()
    const { sheet_id, goals } = body

    if (!sheet_id) {
      return NextResponse.json({ error: 'Sheet ID required' }, { status: 400 })
    }

    if (goals && goals.length > 0) {
      const totalWeight = goals.reduce((sum, g) => sum + (parseFloat(g.w) || 0), 0)
      if (Math.abs(totalWeight - 100) > 0.01) {
        return NextResponse.json(
          { error: `Fix weightage total to 100% first (currently ${totalWeight.toFixed(1)}%)` },
          { status: 400 }
        )
      }

      // Update goals with any manager edits
      for (const g of goals) {
        if (!g.ro) {
          await supabaseAdmin.from('goals').update({ target_value: g.tv, weightage: parseFloat(g.w) }).eq('id', g.id)
        } else {
          await supabaseAdmin.from('goals').update({ weightage: parseFloat(g.w) }).eq('id', g.id)
        }
      }
    }

    // Update goal_sheets SET status='approved', locked=true, approved_at=now()
    const { error: sheetErr } = await supabaseAdmin
      .from('goal_sheets')
      .update({ status: 'approved', locked: true, approved_at: new Date().toISOString() })
      .eq('id', sheet_id)
      
    if (sheetErr) throw sheetErr

    // Notification Logic
    const { data: sheet } = await supabaseAdmin.from('goal_sheets').select('employee_id').eq('id', sheet_id).single()
    if (sheet) {
      const { data: emp } = await supabaseAdmin.from('users').select('full_name, email').eq('id', sheet.employee_id).single()
      if (emp) {
        const title = "Goal Sheet Approved"
        const msg = `Your FY2025-26 goal sheet has been approved and locked by your manager.`
        const link = `http://localhost:3000/employee/goals`
        
        sendEmailNotification(emp.email, title, `<p>${msg}</p><a href="${link}">View Goals</a>`).catch(console.error)
        sendTeamsNotification(title, msg, "View Goals", link).catch(console.error)
      }
    }

    return NextResponse.json({ success: true, message: 'Sheet approved and locked' })
  } catch (err) {
    console.error('Approve API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
