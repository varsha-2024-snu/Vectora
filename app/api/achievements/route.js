import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { goal_id, quarter, actual_value, actual_date, status, progress_score } = body

    if (!goal_id || !quarter || !status) {
      return NextResponse.json({ error: 'Goal ID, quarter, and status are required' }, { status: 400 })
    }

    // Insert or update achievement
    const { error: achErr } = await supabaseAdmin
      .from('achievements')
      .upsert({
        goal_id,
        quarter,
        actual_value,
        actual_date,
        status,
        progress_score
      }, { onConflict: 'goal_id, quarter' })

    if (achErr) throw achErr

    return NextResponse.json({ success: true, message: 'Achievement logged' })
  } catch (err) {
    console.error('Achievement API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
