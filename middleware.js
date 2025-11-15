import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create next-intl middleware using routing config
const intlMiddleware = createMiddleware(routing)

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
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
