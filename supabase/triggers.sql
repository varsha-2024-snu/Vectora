-- ─────────────────────────────────────────────────────────────────────────────
-- VECTORA — Database Triggers
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. AUDIT TRIGGER — Goal Changes (post-lock) ─────────────────────────────
CREATE OR REPLACE FUNCTION log_goal_audit()
RETURNS TRIGGER AS $$
DECLARE
  sheet_locked boolean;
  current_user_id uuid;
BEGIN
  -- Check if parent sheet is locked
  SELECT locked INTO sheet_locked
  FROM goal_sheets WHERE id = NEW.sheet_id;

  -- Only log if sheet was locked (post-lock changes are sensitive)
  IF sheet_locked IS TRUE THEN
    current_user_id := auth.uid();

    IF OLD.target_value IS DISTINCT FROM NEW.target_value THEN
      INSERT INTO audit_logs (entity_type, entity_id, changed_by, field_name, old_value, new_value, action)
      VALUES ('goal', NEW.id, current_user_id, 'target_value',
              OLD.target_value::text, NEW.target_value::text, 'update');
    END IF;

    IF OLD.weightage IS DISTINCT FROM NEW.weightage THEN
      INSERT INTO audit_logs (entity_type, entity_id, changed_by, field_name, old_value, new_value, action)
      VALUES ('goal', NEW.id, current_user_id, 'weightage',
              OLD.weightage::text, NEW.weightage::text, 'update');
    END IF;

    IF OLD.title IS DISTINCT FROM NEW.title THEN
      INSERT INTO audit_logs (entity_type, entity_id, changed_by, field_name, old_value, new_value, action)
      VALUES ('goal', NEW.id, current_user_id, 'title',
              OLD.title, NEW.title, 'update');
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_goal_audit
AFTER UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION log_goal_audit();


-- ─── 2. AUDIT TRIGGER — Goal Sheet Status Changes ────────────────────────────
CREATE OR REPLACE FUNCTION log_sheet_audit()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logs (entity_type, entity_id, changed_by, field_name, old_value, new_value, action)
    VALUES ('goal_sheet', NEW.id, current_user_id,
            'status → locked',
            OLD.status || ' / ' || OLD.locked::text,
            NEW.status || ' / ' || NEW.locked::text,
            CASE
              WHEN NEW.status = 'approved' THEN 'approve'
              WHEN NEW.status = 'returned' THEN 'return'
              ELSE 'update'
            END);
  END IF;

  -- Log unlock events specifically
  IF OLD.locked IS TRUE AND NEW.locked IS FALSE THEN
    INSERT INTO audit_logs (entity_type, entity_id, changed_by, field_name, old_value, new_value, action)
    VALUES ('goal_sheet', NEW.id, current_user_id, 'locked', 'true', 'false', 'unlock');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sheet_audit
AFTER UPDATE ON goal_sheets
FOR EACH ROW EXECUTE FUNCTION log_sheet_audit();


-- ─── 3. SHARED GOAL SYNC — Achievement Propagation ───────────────────────────
CREATE OR REPLACE FUNCTION sync_shared_achievement()
RETURNS TRIGGER AS $$
BEGIN
  -- When primary owner logs achievement, propagate to all linked recipient goals
  UPDATE achievements SET
    actual_value   = NEW.actual_value,
    actual_date    = NEW.actual_date,
    progress_score = NEW.progress_score,
    logged_at      = NEW.logged_at
  WHERE goal_id IN (
    SELECT g.id FROM goals g
    WHERE g.shared_source_id = NEW.goal_id
       OR g.shared_source_id = (
         SELECT shared_source_id FROM goals WHERE id = NEW.goal_id
       )
    AND g.id != NEW.goal_id
  )
  AND quarter = NEW.quarter;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_shared_achievement
AFTER INSERT OR UPDATE ON achievements
FOR EACH ROW EXECUTE FUNCTION sync_shared_achievement();


-- ─── 4. GOAL LOCK GUARD — Prevent mutations on locked sheets ──────────────────
CREATE OR REPLACE FUNCTION guard_locked_goals()
RETURNS TRIGGER AS $$
DECLARE
  sheet_locked boolean;
  caller_role text;
BEGIN
  SELECT locked INTO sheet_locked
  FROM goal_sheets WHERE id = NEW.sheet_id;

  IF sheet_locked IS TRUE THEN
    -- Check if caller is admin (allow admin overrides)
    SELECT role INTO caller_role
    FROM users WHERE auth_id = auth.uid();

    IF caller_role IS DISTINCT FROM 'admin' THEN
      RAISE EXCEPTION 'Cannot modify goals on a locked sheet. Contact Admin for unlock.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_guard_locked_goals
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION guard_locked_goals();
