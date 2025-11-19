import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create next-intl middleware using routing config
const intlMiddleware = createMiddleware(routing)

// Protected routes that require authentication
const PROTECTED_ROUTES = [
	'/statistics',
	'/settings',
	'/my-materials',
]

// Admin routes that require admin role
const ADMIN_ROUTES = ['/admin']

// Helper to check if path matches protected route
function isProtectedRoute(pathname) {
	// Remove locale prefix (e.g., /fr, /en, /ru)
	const pathWithoutLocale = pathname.replace(/^\/(fr|en|ru)/, '')
	return PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route))
}

// Helper to check if path matches admin route
function isAdminRoute(pathname) {
	const pathWithoutLocale = pathname.replace(/^\/(fr|en|ru)/, '')
	return ADMIN_ROUTES.some((route) => pathWithoutLocale.startsWith(route))
}

// Helper to extract locale from pathname
function getLocale(pathname) {
	const match = pathname.match(/^\/(fr|en|ru)/)
	return match ? match[1] : 'fr' // Default to 'fr' if no locale found
}

export async function middleware(request) {
	const { pathname } = request.nextUrl

	// Skip locale handling for API routes and static files
	const isApiRoute = pathname.startsWith('/api/')
	const isStaticFile = pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|js|css|woff|woff2|ttf)$/)

	if (isApiRoute || isStaticFile) {
		// Just handle Supabase for API routes and static files
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
		await supabase.auth.getUser()
		return response
	}

	// For all other routes, use next-intl middleware (handles locale detection and redirects)
	const response = intlMiddleware(request)

	// Then handle Supabase
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

	// Get user authentication status
	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Check if route requires authentication
	if (isProtectedRoute(pathname) && !user) {
		const locale = getLocale(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.url)
		// Add redirect parameter to return to original page after login
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Check if route requires admin role
	if (isAdminRoute(pathname)) {
		if (!user) {
			// Not logged in -> redirect to login
			const locale = getLocale(pathname)
			const loginUrl = new URL(`/${locale}/login`, request.url)
			loginUrl.searchParams.set('redirect', pathname)
			return NextResponse.redirect(loginUrl)
		}

		// Logged in -> check if user is admin
		const { data: profile } = await supabase
			.from('users_profile')
			.select('role')
			.eq('id', user.id)
			.single()

		if (profile?.role !== 'admin') {
			// Logged in but not admin -> redirect to unauthorized page
			const locale = getLocale(pathname)
			return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url))
		}
	}

	return response
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
