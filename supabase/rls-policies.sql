-- ─────────────────────────────────────────────────────────────────────────────
-- VECTORA — Row-Level Security Policies
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_sheets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_comments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_rules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_events ENABLE ROW LEVEL SECURITY;

-- ─── Helper: Get current user's role ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT role FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_id()
RETURNS uuid AS $$
  SELECT id FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── USERS ────────────────────────────────────────────────────────────────────
-- Everyone can read users (needed for name lookups)
CREATE POLICY "users_read_all" ON users FOR SELECT USING (true);
-- Only admins can modify users
CREATE POLICY "users_admin_write" ON users FOR ALL
  USING (get_user_role() = 'admin');

-- ─── CYCLES ───────────────────────────────────────────────────────────────────
-- Everyone can read cycles
CREATE POLICY "cycles_read_all" ON cycles FOR SELECT USING (true);
-- Only admins can modify cycles
CREATE POLICY "cycles_admin_write" ON cycles FOR UPDATE
  USING (get_user_role() = 'admin');

-- ─── GOAL SHEETS ──────────────────────────────────────────────────────────────
-- Employees see their own sheets
CREATE POLICY "sheets_employee_own" ON goal_sheets FOR SELECT
  USING (employee_id = get_user_id());

-- Managers see sheets of their direct reports
CREATE POLICY "sheets_manager_team" ON goal_sheets FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM users WHERE manager_id = get_user_id()
    )
  );

-- Admins see all sheets
CREATE POLICY "sheets_admin_all" ON goal_sheets FOR SELECT
  USING (get_user_role() = 'admin');

-- Employees can insert/update their own sheets
CREATE POLICY "sheets_employee_write" ON goal_sheets FOR INSERT
  WITH CHECK (employee_id = get_user_id());
CREATE POLICY "sheets_employee_update" ON goal_sheets FOR UPDATE
  USING (employee_id = get_user_id());

-- Managers can update sheets of their reports
CREATE POLICY "sheets_manager_update" ON goal_sheets FOR UPDATE
  USING (
    employee_id IN (
      SELECT id FROM users WHERE manager_id = get_user_id()
    )
  );

-- Admins can update any sheet
CREATE POLICY "sheets_admin_update" ON goal_sheets FOR UPDATE
  USING (get_user_role() = 'admin');

-- ─── GOALS ────────────────────────────────────────────────────────────────────
-- Follow parent sheet visibility
CREATE POLICY "goals_read" ON goals FOR SELECT
  USING (
    sheet_id IN (SELECT id FROM goal_sheets)  -- inherits sheet RLS
  );

CREATE POLICY "goals_employee_write" ON goals FOR INSERT
  WITH CHECK (
    sheet_id IN (SELECT id FROM goal_sheets WHERE employee_id = get_user_id())
  );

CREATE POLICY "goals_employee_update" ON goals FOR UPDATE
  USING (
    sheet_id IN (SELECT id FROM goal_sheets WHERE employee_id = get_user_id())
  );

CREATE POLICY "goals_employee_delete" ON goals FOR DELETE
  USING (
    sheet_id IN (SELECT id FROM goal_sheets WHERE employee_id = get_user_id())
  );

CREATE POLICY "goals_manager_update" ON goals FOR UPDATE
  USING (
    sheet_id IN (
      SELECT gs.id FROM goal_sheets gs
      JOIN users u ON gs.employee_id = u.id
      WHERE u.manager_id = get_user_id()
    )
  );

CREATE POLICY "goals_admin_all" ON goals FOR ALL
  USING (get_user_role() = 'admin');

-- ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
CREATE POLICY "ach_read" ON achievements FOR SELECT USING (true);

CREATE POLICY "ach_employee_write" ON achievements FOR INSERT
  WITH CHECK (
    goal_id IN (
      SELECT g.id FROM goals g
      JOIN goal_sheets gs ON g.sheet_id = gs.id
      WHERE gs.employee_id = get_user_id()
    )
  );

CREATE POLICY "ach_employee_update" ON achievements FOR UPDATE
  USING (
    goal_id IN (
      SELECT g.id FROM goals g
      JOIN goal_sheets gs ON g.sheet_id = gs.id
      WHERE gs.employee_id = get_user_id()
    )
  );

CREATE POLICY "ach_admin_all" ON achievements FOR ALL
  USING (get_user_role() = 'admin');

-- ─── CHECK-IN COMMENTS ───────────────────────────────────────────────────────
CREATE POLICY "comments_read" ON checkin_comments FOR SELECT USING (true);
CREATE POLICY "comments_manager_write" ON checkin_comments FOR INSERT
  WITH CHECK (manager_id = get_user_id());
CREATE POLICY "comments_manager_update" ON checkin_comments FOR UPDATE
  USING (manager_id = get_user_id());

-- ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
-- Everyone can read audit logs (transparency)
CREATE POLICY "audit_read_all" ON audit_logs FOR SELECT USING (true);
-- Inserts handled by triggers (SECURITY DEFINER)
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT WITH CHECK (true);

-- ─── ESCALATION RULES ────────────────────────────────────────────────────────
CREATE POLICY "esc_rules_read" ON escalation_rules FOR SELECT USING (true);
CREATE POLICY "esc_rules_admin" ON escalation_rules FOR ALL
  USING (get_user_role() = 'admin');

-- ─── ESCALATION EVENTS ───────────────────────────────────────────────────────
CREATE POLICY "esc_events_read" ON escalation_events FOR SELECT USING (true);
CREATE POLICY "esc_events_admin" ON escalation_events FOR ALL
  USING (get_user_role() = 'admin');
