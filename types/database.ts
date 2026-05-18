// ─────────────────────────────────────────────────────────────────────────────
// VECTORA — TypeScript Type Definitions
// Mirrors the Supabase PostgreSQL schema exactly
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  auth_id: string | null
  email: string
  full_name: string
  initials: string
  role: 'employee' | 'manager' | 'admin'
  manager_id: string | null
  department: string
  created_at: string
}

export interface Cycle {
  id: string
  name: string
  phase: 'goal_setting' | 'q1' | 'q2' | 'q3' | 'q4'
  label: string
  window_open: string
  window_close: string
  is_active: boolean
  created_at: string
}

export interface GoalSheet {
  id: string
  employee_id: string
  cycle_id: string | null
  status: 'draft' | 'submitted' | 'approved' | 'returned'
  manager_comment: string
  submitted_at: string | null
  approved_at: string | null
  locked: boolean
  created_at: string
}

export interface Goal {
  id: string
  sheet_id: string
  thrust_area: string
  title: string
  description: string
  uom_type: 'numeric_min' | 'numeric_max' | 'timeline' | 'zero'
  target_value: number | null
  target_date: string | null
  weightage: number
  is_shared: boolean
  shared_source_id: string | null
  is_readonly: boolean
  created_at: string
}

export interface Achievement {
  id: string
  goal_id: string
  quarter: 'q1' | 'q2' | 'q3' | 'q4'
  actual_value: number | null
  actual_date: string | null
  status: 'not_started' | 'on_track' | 'completed'
  progress_score: number | null
  logged_at: string
  logged_by: string | null
}

export interface CheckinComment {
  id: string
  sheet_id: string
  quarter: string
  manager_id: string
  comment_text: string
  created_at: string
}

export interface AuditLog {
  id: string
  entity_type: 'goal' | 'goal_sheet' | 'achievement'
  entity_id: string
  changed_by: string
  field_name: string
  old_value: string | null
  new_value: string | null
  action: 'update' | 'unlock' | 'approve' | 'return' | 'delete'
  changed_at: string
}

export interface EscalationRule {
  id: string
  rule_type: 'submission_overdue' | 'checkin_overdue'
  label: string
  threshold_days: number
  is_active: boolean
  created_at: string
}

export interface EscalationEvent {
  id: string
  rule_id: string
  target_user: string
  days_overdue: number
  triggered_at: string
  resolved: boolean
}

// ─── Supabase Database type helper ────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      users:             { Row: User }
      cycles:            { Row: Cycle }
      goal_sheets:       { Row: GoalSheet }
      goals:             { Row: Goal }
      achievements:      { Row: Achievement }
      checkin_comments:   { Row: CheckinComment }
      audit_logs:        { Row: AuditLog }
      escalation_rules:  { Row: EscalationRule }
      escalation_events: { Row: EscalationEvent }
    }
  }
}
