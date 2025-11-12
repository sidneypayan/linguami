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

// Limiter les routes où le middleware s'exécute
// Exclure /reset-password pour permettre à Supabase de traiter les tokens PKCE côté client
export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|reset-password).*)'
	]
}
