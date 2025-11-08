// /lib/supabase.js
import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'

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
