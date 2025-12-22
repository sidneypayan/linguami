// /lib/supabase.js
import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// SIMPLIFIED: Single production database for everything
// No more local/production split - everything uses production DB
export const supabase = createBrowserClientSSR(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Export helper function for creating browser clients
// All clients now point to production DB
export const createBrowserClient = () => {
	return createBrowserClientSSR(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	)
}

// Legacy function kept for backward compatibility
// Now points to same DB as createBrowserClient (production)
export const createProductionBrowserClient = () => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	)
}
