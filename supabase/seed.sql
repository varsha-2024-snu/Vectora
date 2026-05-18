-- ─────────────────────────────────────────────────────────────────────────────
-- VECTORA — Seed Data for Demo
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── USERS ────────────────────────────────────────────────────────────────────
-- Note: auth_id will be populated after creating Supabase Auth users
INSERT INTO users (id, email, full_name, initials, role, department, manager_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'employee1@demo.com', 'Arjun Sharma',   'AS', 'employee', 'Sales',      NULL),
  ('00000000-0000-0000-0000-000000000002', 'employee2@demo.com', 'Priya Nair',     'PN', 'employee', 'Sales',      NULL),
  ('00000000-0000-0000-0000-000000000003', 'employee3@demo.com', 'Rahul Mehta',    'RM', 'employee', 'Operations', NULL),
  ('00000000-0000-0000-0000-000000000004', 'manager@demo.com',   'Deepa Krishnan', 'DK', 'manager',  'Sales',      NULL),
  ('00000000-0000-0000-0000-000000000005', 'admin@demo.com',     'Admin User',     'AU', 'admin',    'HR',         NULL);

-- Set manager relationships (employees report to the manager)
UPDATE users SET manager_id = '00000000-0000-0000-0000-000000000004'
  WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003'
  );

-- ─── CYCLES ───────────────────────────────────────────────────────────────────
INSERT INTO cycles (id, phase, label, window_open, window_close, is_active) VALUES
  ('c1111111-0000-0000-0000-000000000001', 'goal_setting', 'Goal Setting', '2025-05-01', '2025-06-30', false),
  ('c1111111-0000-0000-0000-000000000002', 'q1',           'Q1 Check-in',  '2025-07-01', '2025-09-30', true),
  ('c1111111-0000-0000-0000-000000000003', 'q2',           'Q2 Check-in',  '2025-10-01', '2025-12-31', false),
  ('c1111111-0000-0000-0000-000000000004', 'q3',           'Q3 Check-in',  '2026-01-01', '2026-03-31', false),
  ('c1111111-0000-0000-0000-000000000005', 'q4',           'Q4 / Annual',  '2026-03-01', '2026-04-30', false);

-- ─── GOAL SHEETS ──────────────────────────────────────────────────────────────
INSERT INTO goal_sheets (id, employee_id, cycle_id, status, locked, submitted_at, approved_at, manager_comment) VALUES
  ('a2222222-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'c1111111-0000-0000-0000-000000000001',
   'approved', true, '2025-05-10T00:00:00Z', '2025-05-12T00:00:00Z', ''),
  ('a2222222-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000002',
   'c1111111-0000-0000-0000-000000000001',
   'submitted', false, '2025-05-11T00:00:00Z', NULL, ''),
  ('a2222222-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000003',
   'c1111111-0000-0000-0000-000000000001',
   'returned', false, '2025-05-09T00:00:00Z', NULL,
   'Please add an Operations goal to reflect your department.');

-- ─── GOALS ────────────────────────────────────────────────────────────────────
-- Employee 1 (Arjun) — Approved sheet, 4 goals
INSERT INTO goals (id, sheet_id, thrust_area, title, uom_type, target_value, target_date, weightage, is_shared, is_readonly) VALUES
  ('b3333333-0000-0000-0000-000000000001', 'a2222222-0000-0000-0000-000000000001',
   'Revenue', 'Annual Sales Revenue', 'numeric_min', 10000000, NULL, 30, true, false),
  ('b3333333-0000-0000-0000-000000000002', 'a2222222-0000-0000-0000-000000000001',
   'Operations', 'Customer TAT Reduction', 'numeric_max', 48, NULL, 25, false, false),
  ('b3333333-0000-0000-0000-000000000003', 'a2222222-0000-0000-0000-000000000001',
   'Customer', 'CRM System Rollout', 'timeline', NULL, '2025-09-30', 30, false, false),
  ('b3333333-0000-0000-0000-000000000004', 'a2222222-0000-0000-0000-000000000001',
   'Safety', 'Safety Incidents (Dept KPI)', 'zero', 0, NULL, 15, true, true);

-- Employee 2 (Priya) — Submitted sheet, 4 goals
INSERT INTO goals (id, sheet_id, thrust_area, title, uom_type, target_value, target_date, weightage, is_shared, is_readonly) VALUES
  ('b3333333-0000-0000-0000-000000000005', 'a2222222-0000-0000-0000-000000000002',
   'Revenue', 'Sales Pipeline Growth', 'numeric_min', 5000000, NULL, 35, false, false),
  ('b3333333-0000-0000-0000-000000000006', 'a2222222-0000-0000-0000-000000000002',
   'Customer', 'NPS Score Improvement', 'numeric_min', 75, NULL, 30, false, false),
  ('b3333333-0000-0000-0000-000000000007', 'a2222222-0000-0000-0000-000000000002',
   'People', 'Professional Dev Hours', 'numeric_min', 40, NULL, 20, false, false),
  ('b3333333-0000-0000-0000-000000000008', 'a2222222-0000-0000-0000-000000000002',
   'Safety', 'Safety Incidents (Dept KPI)', 'zero', 0, NULL, 15, true, true);

-- Employee 3 (Rahul) — Returned sheet, 2 goals
INSERT INTO goals (id, sheet_id, thrust_area, title, uom_type, target_value, target_date, weightage, is_shared, is_readonly) VALUES
  ('b3333333-0000-0000-0000-000000000009', 'a2222222-0000-0000-0000-000000000003',
   'Revenue', 'Regional Revenue Target', 'numeric_min', 2000000, NULL, 50, false, false),
  ('b3333333-0000-0000-0000-000000000010', 'a2222222-0000-0000-0000-000000000003',
   'Operations', 'Process Efficiency Score', 'numeric_min', 85, NULL, 50, false, false);

-- ─── ACHIEVEMENTS (Q1 data for Arjun) ─────────────────────────────────────────
INSERT INTO achievements (id, goal_id, quarter, actual_value, actual_date, status, progress_score) VALUES
  ('e4444444-0000-0000-0000-000000000001', 'b3333333-0000-0000-0000-000000000001',
   'q1', 7500000, NULL, 'on_track', 75),
  ('e4444444-0000-0000-0000-000000000002', 'b3333333-0000-0000-0000-000000000002',
   'q1', 36, NULL, 'on_track', 100),
  ('e4444444-0000-0000-0000-000000000003', 'b3333333-0000-0000-0000-000000000003',
   'q1', NULL, '2025-09-25', 'on_track', 100),
  ('e4444444-0000-0000-0000-000000000004', 'b3333333-0000-0000-0000-000000000004',
   'q1', 0, NULL, 'completed', 100),
  ('e4444444-0000-0000-0000-000000000005', 'b3333333-0000-0000-0000-000000000008',
   'q1', 0, NULL, 'completed', 100);

-- ─── CHECK-IN COMMENTS ───────────────────────────────────────────────────────
INSERT INTO checkin_comments (id, sheet_id, quarter, manager_id, comment_text, created_at) VALUES
  ('f5555555-0000-0000-0000-000000000001',
   'a2222222-0000-0000-0000-000000000001', 'q1',
   '00000000-0000-0000-0000-000000000004',
   'Great Q1 progress — revenue on track at 75%. TAT is ahead of plan. CRM rollout must stay on schedule, 5 weeks remaining.',
   '2025-07-20T00:00:00Z');

-- ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
INSERT INTO audit_logs (id, entity_type, entity_id, changed_by, field_name, old_value, new_value, action, changed_at) VALUES
  ('f6666666-0000-0000-0000-000000000001', 'goal_sheet',
   'a2222222-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000004',
   'status → locked', 'submitted / false', 'approved / true', 'approve',
   '2025-05-12T10:23:00Z'),
  ('f6666666-0000-0000-0000-000000000002', 'goal',
   'b3333333-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000004',
   'target_value', '₹8,000,000', '₹10,000,000', 'update',
   '2025-05-12T10:20:00Z'),
  ('f6666666-0000-0000-0000-000000000003', 'goal_sheet',
   'a2222222-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000005',
   'locked', 'true', 'false', 'unlock',
   '2025-05-13T14:05:00Z'),
  ('f6666666-0000-0000-0000-000000000004', 'goal_sheet',
   'a2222222-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000004',
   'status → locked', 'submitted / false', 'approved / true', 'approve',
   '2025-05-13T15:30:00Z');

-- ─── ESCALATION RULES ────────────────────────────────────────────────────────
INSERT INTO escalation_rules (id, rule_type, label, threshold_days, is_active) VALUES
  ('f7777777-0000-0000-0000-000000000001', 'submission_overdue', 'Goal Submission Overdue', 7, true),
  ('f7777777-0000-0000-0000-000000000002', 'checkin_overdue',    'Check-in Not Completed', 14, true);

-- ─── ESCALATION EVENTS ───────────────────────────────────────────────────────
INSERT INTO escalation_events (id, rule_id, target_user, days_overdue, triggered_at, resolved) VALUES
  ('f8888888-0000-0000-0000-000000000001',
   'f7777777-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000003',
   12, '2025-05-21T09:00:00Z', false);
