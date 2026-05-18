import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailNotification } from '@/lib/email'
import { sendTeamsNotification } from '@/lib/teams'
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

    // Notification Logic
    const { data: sheet } = await supabaseAdmin.from('goal_sheets').select('employee_id').eq('id', sheet_id).single()
    if (sheet) {
      const { data: emp } = await supabaseAdmin.from('users').select('full_name, email').eq('id', sheet.employee_id).single()
      if (emp) {
        const title = "Goal Sheet Returned for Rework"
        const msg = `Your manager returned your goal sheet with feedback: "${comment}"`
        const link = `http://localhost:3000/employee/goals`
        
        sendEmailNotification(emp.email, title, `<p>${msg}</p><a href="${link}">Edit Goals</a>`).catch(console.error)
        sendTeamsNotification(title, msg, "Edit Goals", link).catch(console.error)
      }
    }

    return NextResponse.json({ success: true, message: 'Sheet returned with feedback' })
  } catch (err) {
    console.error('Return API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
