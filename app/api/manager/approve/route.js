import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    return NextResponse.json({ success: true, message: 'Sheet approved and locked' })
  } catch (err) {
    console.error('Approve API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
