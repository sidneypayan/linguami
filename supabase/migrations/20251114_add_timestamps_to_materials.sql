-- Migration: Add created_at and updated_at columns to materials table
-- Date: 2025-11-14

-- Add created_at column with default NOW()
ALTER TABLE materials
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();

-- Add updated_at column with default NOW()
ALTER TABLE materials
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Set created_at for existing rows to NOW() (or keep default)
-- If you prefer to use the ID as a proxy for creation order:
-- UPDATE materials SET created_at = NOW() - (INTERVAL '1 day' * (SELECT MAX(id) FROM materials - id));
-- But for simplicity, just use NOW() for all existing rows

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on UPDATE
CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN materials.created_at IS 'Timestamp when the material was created';
COMMENT ON COLUMN materials.updated_at IS 'Timestamp when the material was last updated (auto-updated by trigger)';
