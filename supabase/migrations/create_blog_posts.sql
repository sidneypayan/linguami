-- Create blog_posts table for managing blog content
-- This replaces the static MDX files in /posts directory

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,

  -- Content fields
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content

  -- Metadata
  lang TEXT NOT NULL CHECK (lang IN ('fr', 'en', 'ru')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  img TEXT, -- Image filename or URL

  -- Publishing
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one slug per language
  UNIQUE(slug, lang)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_lang ON blog_posts(lang);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_lang_published ON blog_posts(lang, is_published, published_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts
  FOR SELECT
  USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.role = 'admin'
    )
  );

-- Authors can manage their own posts
CREATE POLICY "Authors can manage their own posts"
  ON blog_posts
  FOR ALL
  USING (author_id = auth.uid());

-- Comment
COMMENT ON TABLE blog_posts IS 'Blog posts with Markdown content, replacing static MDX files';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly identifier (unique per language)';
COMMENT ON COLUMN blog_posts.content IS 'Markdown content of the blog post';
COMMENT ON COLUMN blog_posts.published_at IS 'Publication date/time (for display and ordering)';
