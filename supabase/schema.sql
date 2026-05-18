-- ─────────────────────────────────────────────────────────────────────────────
-- VECTORA — Goal Intelligence Platform
-- Supabase PostgreSQL Schema
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     uuid UNIQUE,                  -- links to Supabase Auth UID
  email       text UNIQUE NOT NULL,
  full_name   text NOT NULL,
  initials    text NOT NULL DEFAULT '',
  role        text NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
  manager_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  department  text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_auth ON users(auth_id);

-- ─── CYCLES ───────────────────────────────────────────────────────────────────
CREATE TABLE cycles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL DEFAULT 'FY2025-26',
  phase         text NOT NULL,              -- 'goal_setting','q1','q2','q3','q4'
  label         text NOT NULL,
  window_open   date NOT NULL,
  window_close  date NOT NULL,
  is_active     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─── GOAL SHEETS ──────────────────────────────────────────────────────────────
CREATE TABLE goal_sheets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_id      uuid REFERENCES cycles(id) ON DELETE SET NULL,
  status        text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'submitted', 'approved', 'returned')),
  manager_comment text DEFAULT '',
  submitted_at  timestamptz,
  approved_at   timestamptz,
  locked        boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, cycle_id)
);

CREATE INDEX idx_sheets_employee ON goal_sheets(employee_id);
CREATE INDEX idx_sheets_status ON goal_sheets(status);

-- ─── GOALS ────────────────────────────────────────────────────────────────────
CREATE TABLE goals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id          uuid NOT NULL REFERENCES goal_sheets(id) ON DELETE CASCADE,
  thrust_area       text NOT NULL,
  title             text NOT NULL,
  description       text DEFAULT '',
  uom_type          text NOT NULL
                      CHECK (uom_type IN ('numeric_min', 'numeric_max', 'timeline', 'zero')),
  target_value      numeric,
  target_date       date,                    -- for timeline UoM
  weightage         numeric NOT NULL CHECK (weightage >= 0 AND weightage <= 100),
  is_shared         boolean NOT NULL DEFAULT false,
  shared_source_id  uuid REFERENCES goals(id) ON DELETE SET NULL,
  is_readonly       boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_goals_sheet ON goals(sheet_id);
CREATE INDEX idx_goals_shared ON goals(shared_source_id);

-- ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE achievements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id         uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  quarter         text NOT NULL CHECK (quarter IN ('q1', 'q2', 'q3', 'q4')),
  actual_value    numeric,
  actual_date     date,                     -- for timeline UoM
  status          text NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'on_track', 'completed')),
  progress_score  numeric,                  -- computed and stored
  logged_at       timestamptz NOT NULL DEFAULT now(),
  logged_by       uuid REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (goal_id, quarter)
);

CREATE INDEX idx_ach_goal ON achievements(goal_id);
CREATE INDEX idx_ach_quarter ON achievements(quarter);

-- ─── CHECK-IN COMMENTS ───────────────────────────────────────────────────────
CREATE TABLE checkin_comments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id      uuid NOT NULL REFERENCES goal_sheets(id) ON DELETE CASCADE,
  quarter       text NOT NULL,
  manager_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text  text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sheet_id, quarter, manager_id)
);

-- ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   text NOT NULL,              -- 'goal' | 'goal_sheet' | 'achievement'
  entity_id     uuid NOT NULL,
  changed_by    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_name    text NOT NULL,
  old_value     text,
  new_value     text,
  action        text NOT NULL,              -- 'update' | 'unlock' | 'approve' | 'return' | 'delete'
  changed_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_by ON audit_logs(changed_by);
CREATE INDEX idx_audit_at ON audit_logs(changed_at DESC);

-- ─── ESCALATION RULES ────────────────────────────────────────────────────────
CREATE TABLE escalation_rules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type       text NOT NULL,            -- 'submission_overdue' | 'checkin_overdue'
  label           text NOT NULL,
  threshold_days  int NOT NULL DEFAULT 7,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ─── ESCALATION EVENTS ───────────────────────────────────────────────────────
CREATE TABLE escalation_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id       uuid NOT NULL REFERENCES escalation_rules(id) ON DELETE CASCADE,
  target_user   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  days_overdue  int NOT NULL DEFAULT 0,
  triggered_at  timestamptz NOT NULL DEFAULT now(),
  resolved      boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_esc_events_resolved ON escalation_events(resolved);
