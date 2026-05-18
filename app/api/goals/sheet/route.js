import { NextResponse } from 'next/server'

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

    // When Supabase is configured, this would:
    // 1. Create goal_sheet row
    // 2. Create goal rows
    // 3. Set status to 'submitted'
    // For now, return success (mutations happen client-side via AppContext)
    return NextResponse.json({
      success: true,
      message: 'Goal sheet validated successfully. Ready for Supabase persistence.',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
