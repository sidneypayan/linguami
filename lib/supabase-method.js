/**
 * Supabase client specifically for method pages
 * Uses PROD database even in local development to avoid content duplication
 */

import { createBrowserClient } from '@supabase/ssr'

const isLocal = process.env.NODE_ENV === 'development'

// In local: use PROD database for method content
// In prod: use normal prod database
const supabaseUrl = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  : process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseAnonKey = isLocal
  ? process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createMethodClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Log which DB we're using (dev only)
if (isLocal && typeof window !== 'undefined') {
  console.log('🎓 Method pages using:', supabaseUrl.includes('prod') ? 'PROD DB' : 'DEV DB')
}
