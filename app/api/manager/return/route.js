import { NextResponse } from 'next/server'

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

    // When Supabase is configured:
    // 1. UPDATE goal_sheets SET status='returned', manager_comment=comment
    // 2. Optionally send email via Resend
    return NextResponse.json({
      success: true,
      message: 'Sheet returned with feedback',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
