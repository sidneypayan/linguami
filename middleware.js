// middleware.js (à la racine)
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
	const response = NextResponse.next()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return request.cookies.get(name)?.value
				},
				set(name, value, options) {
					response.cookies.set({ name, value, ...options })
				},
				remove(name, options) {
					response.cookies.set({ name, value: '', ...options, maxAge: 0 })
				},
			},
		}
	)

	// Déclenche la (ré-)écriture des cookies si le token doit être rafraîchi
	await supabase.auth.getUser()
	return response
}

// Optionnel : limiter les routes où le middleware s’exécute
// export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
