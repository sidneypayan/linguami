// /lib/supabase.js
import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export const supabase = createBrowserClientSSR(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Export helper function for creating browser clients
export const createBrowserClient = () => {
	return createBrowserClientSSR(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	)
}

// Export helper function for creating production browser clients
// Used for lesson pages and method courses to access production DB
// NOTE: Uses createClient instead of createBrowserClientSSR to avoid singleton caching
export const createProductionBrowserClient = () => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_PROD_URL,
		process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY
	)
}
