-- Migration: Add freemium system for method lessons
-- Date: 2025-12-09
-- Description:
--   - Add is_free column to course_lessons (mark individual lessons as free)
--   - Add subscription fields to users_profile (subscription management)
--   - Add has_purchased_method to users_profile (one-time method purchase)

-- ============================================
-- 1. Add is_free column to course_lessons
-- ============================================
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

COMMENT ON COLUMN course_lessons.is_free IS 'If true, lesson is accessible without subscription or purchase';

-- ============================================
-- 2. Add subscription and purchase fields to users_profile
-- ============================================

-- Subscription status for monthly/yearly subscribers
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT NULL;

-- Subscription expiration date
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ DEFAULT NULL;

-- Subscription type (monthly or yearly)
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT NULL;

-- One-time method purchase flag
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS has_purchased_method BOOLEAN DEFAULT false;

-- Stripe customer ID for payment management
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL;

-- Comments for documentation
COMMENT ON COLUMN users_profile.subscription_status IS 'Subscription status: active, expired, cancelled, or NULL';
COMMENT ON COLUMN users_profile.subscription_expires_at IS 'When the subscription expires (NULL = no subscription)';
COMMENT ON COLUMN users_profile.subscription_type IS 'Subscription type: monthly, yearly, or NULL';
COMMENT ON COLUMN users_profile.has_purchased_method IS 'If true, user has purchased the method (one-time payment)';
COMMENT ON COLUMN users_profile.stripe_customer_id IS 'Stripe customer ID for managing payments';

-- ============================================
-- 3. Create index for subscription queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_profile_subscription_status
ON users_profile(subscription_status)
WHERE subscription_status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_profile_subscription_expires
ON users_profile(subscription_expires_at)
WHERE subscription_expires_at IS NOT NULL;

-- ============================================
-- 4. Mark first lesson as free (lesson with order_index = 1)
-- ============================================
-- This will mark the first lesson of each course as free
-- Adjust as needed based on your requirements
UPDATE course_lessons
SET is_free = true
WHERE order_index = 1;
