import { NextResponse } from 'next/server'

// POST /api/manager/approve — Approve a goal sheet
export async function POST(request) {
  try {
    const body = await request.json()
    const { sheet_id, manager_id, goals } = body

    if (!sheet_id) {
      return NextResponse.json({ error: 'Sheet ID required' }, { status: 400 })
    }

    // Validate updated goals weightage
    if (goals && goals.length > 0) {
      const totalWeight = goals.reduce((sum, g) => sum + (parseFloat(g.weightage) || 0), 0)
      if (Math.abs(totalWeight - 100) > 0.01) {
        return NextResponse.json(
          { error: `Fix weightage total to 100% first (currently ${totalWeight.toFixed(1)}%)` },
          { status: 400 }
        )
      }
    }

    // When Supabase is configured:
    // 1. Update goal_sheets SET status='approved', locked=true, approved_at=now()
    // 2. Update goals with any manager edits
    // 3. Insert audit_log entry
    return NextResponse.json({
      success: true,
      message: 'Sheet approved and locked',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
