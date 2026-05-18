import { NextResponse } from 'next/server'

// ─── Helper: Check if Supabase is configured ─────────────────────────────────
export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  )
}

// ─── Helper: JSON error response ──────────────────────────────────────────────
export function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// ─── Helper: JSON success response ────────────────────────────────────────────
export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status })
}
