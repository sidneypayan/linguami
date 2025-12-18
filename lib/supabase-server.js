// /lib/supabase-server.js
import { createClient } from '@supabase/supabase-js'
import { createServerClient as createSSRClient } from '@supabase/ssr'

// Client serveur avec la clé de service (bypasse RLS)
// À utiliser UNIQUEMENT dans getStaticProps, getServerSideProps, ou API routes
export const supabaseServer = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Production server client with service role key (bypasses RLS)
// In production env: fallback to regular vars (same DB)
// In local dev: use PROD vars to access production DB
export const supabaseProductionServer = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Create Supabase client for App Router (Server Components)
export function createServerClient(cookieStore) {
	return createSSRClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
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
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
			db: {
				schema: 'public',
			},
			global: {
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			},
		}
	)
}

// Create Production Supabase client for App Router (Server Components)
// Used for lesson pages and method courses to access production DB
// In production env: fallback to regular vars (same DB)
export function createProductionServerClient(cookieStore) {
	return createSSRClient(
		process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
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
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
			db: {
				schema: 'public',
			},
			global: {
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			},
		}
	)
}
