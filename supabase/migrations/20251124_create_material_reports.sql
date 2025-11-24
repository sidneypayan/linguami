-- Create material_reports table for users to report broken links and other issues
CREATE TABLE IF NOT EXISTS material_reports (
  id BIGSERIAL PRIMARY KEY,
  material_id BIGINT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('broken_video', 'broken_link', 'broken_audio', 'inappropriate_content', 'translation_error', 'other')),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX idx_material_reports_material_id ON material_reports(material_id);
CREATE INDEX idx_material_reports_status ON material_reports(status);
CREATE INDEX idx_material_reports_created_at ON material_reports(created_at DESC);

-- Enable RLS
ALTER TABLE material_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create reports (authenticated or anonymous)
CREATE POLICY "Anyone can create material reports"
  ON material_reports
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON material_reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for Server Actions)
-- Admin checks are done in Server Actions, not in RLS
CREATE POLICY "Service role full access"
  ON material_reports
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_material_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER set_material_reports_updated_at
  BEFORE UPDATE ON material_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_material_reports_updated_at();
