-- Migration: Create translations cache table
-- Date: 2025-12-02
-- Purpose: Cache Yandex Dictionary API responses to reduce API calls and build independence

-- ============================================
-- PART 1: Create the translations_cache table
-- ============================================

CREATE TABLE IF NOT EXISTS translations_cache (
    id SERIAL PRIMARY KEY,

    -- Search context
    searched_form VARCHAR(100) NOT NULL,      -- What the user typed (e.g., "говорил")
    lemma VARCHAR(100) NOT NULL,              -- Base form returned by Yandex (e.g., "говорить")
    source_lang VARCHAR(5) NOT NULL,          -- Source language (ru, fr, en, it)
    target_lang VARCHAR(5) NOT NULL,          -- Target language (ru, fr, en)

    -- Translation data
    part_of_speech VARCHAR(20),               -- verb, noun, adjective, etc.
    translations JSONB NOT NULL,              -- Array of translations ["parler", "dire", ...]

    -- Full response for future use
    full_response JSONB,                      -- Complete Yandex API response

    -- Metadata
    source VARCHAR(20) DEFAULT 'yandex',      -- Origin of the translation (yandex, manual, etc.)
    usage_count INTEGER DEFAULT 1,            -- How many times this entry was used
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint: one entry per searched form + language pair
    UNIQUE(searched_form, source_lang, target_lang)
);

-- ============================================
-- PART 2: Create indexes for fast lookups
-- ============================================

-- Primary lookup: exact match on searched form
CREATE INDEX IF NOT EXISTS idx_translations_cache_search
ON translations_cache(searched_form, source_lang, target_lang);

-- Secondary lookup: find all forms of a lemma
CREATE INDEX IF NOT EXISTS idx_translations_cache_lemma
ON translations_cache(lemma, source_lang, target_lang);

-- Stats: most used translations
CREATE INDEX IF NOT EXISTS idx_translations_cache_usage
ON translations_cache(usage_count DESC);

-- ============================================
-- PART 3: Add comments for documentation
-- ============================================

COMMENT ON TABLE translations_cache IS 'Cache for dictionary translations to reduce external API calls';
COMMENT ON COLUMN translations_cache.searched_form IS 'The exact form the user searched for (may be conjugated/declined)';
COMMENT ON COLUMN translations_cache.lemma IS 'The base/dictionary form (infinitive for verbs, nominative singular for nouns)';
COMMENT ON COLUMN translations_cache.translations IS 'JSON array of translation options in target language';
COMMENT ON COLUMN translations_cache.full_response IS 'Complete API response for synonyms, examples, etc.';
COMMENT ON COLUMN translations_cache.usage_count IS 'Number of cache hits - helps identify most valuable entries';

-- ============================================
-- PART 4: RLS Policies (public read, no write from client)
-- ============================================

-- Enable RLS
ALTER TABLE translations_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read translations (including anonymous users)
CREATE POLICY "translations_cache_select_policy"
ON translations_cache FOR SELECT
USING (true);

-- No direct inserts/updates from client - only server actions
-- This is enforced by NOT creating INSERT/UPDATE policies
-- Server actions use service_role key which bypasses RLS

-- ============================================
-- VERIFICATION QUERIES (commented out)
-- ============================================

-- Check table structure:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'translations_cache'
-- ORDER BY ordinal_position;

-- Check indexes:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'translations_cache';
