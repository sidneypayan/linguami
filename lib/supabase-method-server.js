/**
 * Server-side Supabase client for method pages
 * Uses PROD database even in local development
 */

import 'server-only'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

const isLocal = process.env.NODE_ENV === 'development'

export function createMethodServerClient(cookieStore) {
  const supabaseUrl = isLocal
    ? process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabaseAnonKey = isLocal
    ? process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component - ignore
        }
      },
    },
  })
}
