-- Migration: Add stripe_subscription_id to users_profile
-- Date: 2025-12-09
-- Description: Add Stripe subscription ID for managing subscriptions

ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT DEFAULT NULL;

COMMENT ON COLUMN users_profile.stripe_subscription_id IS 'Stripe subscription ID for managing recurring payments';

CREATE INDEX IF NOT EXISTS idx_users_profile_stripe_subscription_id
ON users_profile(stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;
