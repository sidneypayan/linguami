-- Rollback script for material_reports table
-- Run this if the migration causes issues

-- Drop trigger
DROP TRIGGER IF EXISTS set_material_reports_updated_at ON material_reports;

-- Drop function
DROP FUNCTION IF EXISTS update_material_reports_updated_at();

-- Drop policies
DROP POLICY IF EXISTS "Admins can delete reports" ON material_reports;
DROP POLICY IF EXISTS "Admins can update reports" ON material_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON material_reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON material_reports;
DROP POLICY IF EXISTS "Anyone can create material reports" ON material_reports;

-- Drop indexes
DROP INDEX IF EXISTS idx_material_reports_created_at;
DROP INDEX IF EXISTS idx_material_reports_status;
DROP INDEX IF EXISTS idx_material_reports_material_id;

-- Drop table
DROP TABLE IF EXISTS material_reports;
