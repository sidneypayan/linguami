-- Migration: Add admin RLS policies for training tables
-- Date: 2024-11-27
-- Description: Allows admins to create, update, delete training themes and questions

-- ============================================
-- Helper function to check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users_profile
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Training Themes - Admin policies
-- ============================================

-- Admins can insert themes
CREATE POLICY "Admins can insert training themes"
    ON training_themes FOR INSERT
    WITH CHECK (is_admin());

-- Admins can update themes
CREATE POLICY "Admins can update training themes"
    ON training_themes FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Admins can delete themes
CREATE POLICY "Admins can delete training themes"
    ON training_themes FOR DELETE
    USING (is_admin());

-- ============================================
-- Training Questions - Admin policies
-- ============================================

-- Admins can read ALL questions (including inactive)
CREATE POLICY "Admins can read all training questions"
    ON training_questions FOR SELECT
    USING (is_admin());

-- Admins can insert questions
CREATE POLICY "Admins can insert training questions"
    ON training_questions FOR INSERT
    WITH CHECK (is_admin());

-- Admins can update questions
CREATE POLICY "Admins can update training questions"
    ON training_questions FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Admins can delete questions
CREATE POLICY "Admins can delete training questions"
    ON training_questions FOR DELETE
    USING (is_admin());

-- ============================================
-- Grant execute on helper function
-- ============================================
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
