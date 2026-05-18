import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    // Fetch users, goals, sheets, and achievements
    const [
      { data: users },
      { data: sheets },
      { data: goals },
      { data: achievements },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id, full_name, department'),
      supabaseAdmin.from('goal_sheets').select('id, employee_id'),
      supabaseAdmin.from('goals').select('id, sheet_id, title, uom_type, target_value, weightage'),
      supabaseAdmin.from('achievements').select('goal_id, quarter, actual_value, progress_score'),
    ])

    const data = []

    for (const user of users) {
      const userSheets = sheets.filter(s => s.employee_id === user.id)
      for (const sheet of userSheets) {
        const userGoals = goals.filter(g => g.sheet_id === sheet.id)
        for (const goal of userGoals) {
          const goalAchs = achievements.filter(a => a.goal_id === goal.id)
          
          const getAch = (q) => goalAchs.find(a => a.quarter === q)
          const q1 = getAch('q1')
          const q2 = getAch('q2')
          const q3 = getAch('q3')
          const q4 = getAch('q4')

          data.push({
            Employee: user.full_name,
            Department: user.department,
            Goal: goal.title,
            UOM: goal.uom_type,
            Target: goal.target_value ?? '',
            Weightage: `${goal.weightage}%`,
            Q1_Actual: q1?.actual_value ?? '',
            Q1_Score: q1?.progress_score != null ? `${q1.progress_score}%` : '',
            Q2_Actual: q2?.actual_value ?? '',
            Q2_Score: q2?.progress_score != null ? `${q2.progress_score}%` : '',
            Q3_Actual: q3?.actual_value ?? '',
            Q3_Score: q3?.progress_score != null ? `${q3.progress_score}%` : '',
            Q4_Actual: q4?.actual_value ?? '',
            Q4_Score: q4?.progress_score != null ? `${q4.progress_score}%` : '',
          })
        }
      }
    }

    const csv = Papa.unparse(data)

    const headers = new Headers({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="achievement_report.csv"',
    })

    return new NextResponse(csv, { status: 200, headers })
  } catch (error) {
    console.error('Report API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
