-- Migration: Add automatic is_premium calculation trigger
-- Date: 2025-12-10
-- Description:
--   - Ensure is_premium column exists with correct constraints
--   - Create trigger to automatically update is_premium based on subscription_status and has_purchased_method
--   - Backfill existing users with correct is_premium value

-- ============================================
-- 1. Drop NOT NULL constraint if exists (temporarily)
-- ============================================
-- First, check if column exists and drop NOT NULL constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users_profile'
    AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE users_profile ALTER COLUMN is_premium DROP NOT NULL;
  END IF;
END $$;

-- ============================================
-- 2. Add is_premium column if not exists
-- ============================================
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

COMMENT ON COLUMN users_profile.is_premium IS 'Automatically calculated: true if subscription_status = active OR has_purchased_method = true';

-- ============================================
-- 3. Backfill existing users BEFORE creating trigger
-- ============================================
-- Update all existing users to have correct is_premium value
UPDATE users_profile
SET is_premium = (subscription_status = 'active' OR has_purchased_method = true)
WHERE is_premium IS NULL OR is_premium != (subscription_status = 'active' OR has_purchased_method = true);

-- ============================================
-- 4. Set NOT NULL constraint with default
-- ============================================
ALTER TABLE users_profile
ALTER COLUMN is_premium SET DEFAULT false;

ALTER TABLE users_profile
ALTER COLUMN is_premium SET NOT NULL;

-- ============================================
-- 5. Create function to calculate is_premium
-- ============================================
CREATE OR REPLACE FUNCTION update_is_premium()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate is_premium based on subscription status or one-time purchase
  -- Handle NULL values explicitly
  NEW.is_premium = COALESCE(
    (NEW.subscription_status = 'active' OR NEW.has_purchased_method = true),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_is_premium() IS 'Trigger function to automatically update is_premium when subscription_status or has_purchased_method changes';

-- ============================================
-- 6. Create trigger on INSERT and UPDATE
-- ============================================
DROP TRIGGER IF EXISTS trigger_update_is_premium ON users_profile;

CREATE TRIGGER trigger_update_is_premium
  BEFORE INSERT OR UPDATE OF subscription_status, has_purchased_method ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_is_premium();

COMMENT ON TRIGGER trigger_update_is_premium ON users_profile IS 'Automatically updates is_premium when subscription_status or has_purchased_method changes';

-- ============================================
-- 7. Create index for premium queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_profile_is_premium
ON users_profile(is_premium)
WHERE is_premium = true;

COMMENT ON INDEX idx_users_profile_is_premium IS 'Index for quickly finding premium users';
