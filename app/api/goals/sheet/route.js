import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailNotification } from '@/lib/email'
import { sendTeamsNotification } from '@/lib/teams'
// POST /api/goals/sheet — Create new goal sheet
export async function POST(request) {
  try {
    const body = await request.json()
    const { employee_id, goals } = body

    // Validate weightage sums to 100
    const totalWeight = goals.reduce((sum, g) => sum + (parseFloat(g.weightage) || 0), 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      return NextResponse.json(
        { error: `Total weightage is ${totalWeight.toFixed(1)}% — must equal exactly 100%` },
        { status: 400 }
      )
    }

    // Validate max 8 goals
    if (goals.length > 8) {
      return NextResponse.json(
        { error: 'Maximum 8 goals per sheet (RULE-V3)' },
        { status: 400 }
      )
    }

    // Validate each goal
    for (let i = 0; i < goals.length; i++) {
      const g = goals[i]
      if ((parseFloat(g.weightage) || 0) < 10) {
        return NextResponse.json(
          { error: `Goal ${i + 1}: minimum weightage is 10% (RULE-V2)` },
          { status: 400 }
        )
      }
      if (!g.title?.trim() || g.title.trim().length < 3) {
        return NextResponse.json(
          { error: `Goal ${i + 1}: title must be at least 3 characters` },
          { status: 400 }
        )
      }
      if (g.uom_type === 'timeline' && !g.target_date) {
        return NextResponse.json(
          { error: `Goal ${i + 1}: deadline required for Timeline goals` },
          { status: 400 }
        )
      }
      if (['numeric_min', 'numeric_max', 'zero'].includes(g.uom_type) && g.target_value == null) {
        return NextResponse.json(
          { error: `Goal ${i + 1}: target value required` },
          { status: 400 }
        )
      }
    }

    // 1. Check if sheet already exists
    const { data: existingSheet } = await supabaseAdmin
      .from('goal_sheets')
      .select('id')
      .eq('employee_id', employee_id)
      .eq('cycle_id', 'cycle_fy25_26')
      .single()

    let sheetId = existingSheet?.id

    if (!existingSheet) {
      // Create new sheet
      const { data: newSheet, error: sheetErr } = await supabaseAdmin
        .from('goal_sheets')
        .insert({ employee_id, cycle_id: 'cycle_fy25_26', status: 'submitted' })
        .select('id')
        .single()
      if (sheetErr) throw sheetErr
      sheetId = newSheet.id
    } else {
      // Update existing sheet status to submitted
      await supabaseAdmin
        .from('goal_sheets')
        .update({ status: 'submitted' })
        .eq('id', sheetId)

      // Delete existing non-shared goals to replace them
      await supabaseAdmin
        .from('goals')
        .delete()
        .eq('sheet_id', sheetId)
        .eq('is_shared', false)
    }

    // Insert new goals
    const dbGoals = goals.map(g => ({
      sheet_id: sheetId,
      thrust_area: g.area,
      title: g.title,
      uom_type: g.uom,
      target_value: g.tv,
      target_date: g.td,
      weightage: parseFloat(g.w),
      is_shared: false,
      is_readonly: false
    }))

    const { error: goalsErr } = await supabaseAdmin.from('goals').insert(dbGoals)
    if (goalsErr) throw goalsErr

    // Notification Logic
    const { data: emp } = await supabaseAdmin.from('users').select('full_name, manager_id').eq('id', employee_id).single()
    if (emp && emp.manager_id) {
      const { data: mgr } = await supabaseAdmin.from('users').select('full_name, email').eq('id', emp.manager_id).single()
      if (mgr) {
        const title = `New Goal Sheet Submitted by ${emp.full_name}`
        const msg = `${emp.full_name} has submitted their FY2025-26 goals for your approval.`
        const link = `http://localhost:3000/manager/dashboard`
        
        // Fire asynchronously (don't block the request)
        sendEmailNotification(mgr.email, title, `<p>${msg}</p><a href="${link}">Review Goals</a>`).catch(console.error)
        sendTeamsNotification(title, msg, "Review Goals", link).catch(console.error)
      }
    }

    return NextResponse.json({ success: true, sheetId })
  } catch (err) {
    console.error('Goal sheet API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
