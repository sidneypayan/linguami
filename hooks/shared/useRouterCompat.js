/**
 * Hook compatible avec Pages Router ET App Router
 * Détecte automatiquement le contexte et retourne l'API appropriée
 */

'use client'

import { useContext, useMemo, useCallback, useEffect, useState } from 'react'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'

export function useRouterCompat() {
	// Essayer d'accéder au contexte Pages Router
	const pagesRouterContext = useContext(RouterContext)
	const [locale, setLocale] = useState('fr')

	// Déterminer le type de router
	const routerType = pagesRouterContext ? 'pages' : 'app'

	// Gérer la locale
	useEffect(() => {
		if (routerType === 'pages' && pagesRouterContext?.locale) {
			setLocale(pagesRouterContext.locale)
		} else {
			// App Router : PRIORITÉ À L'URL, puis localStorage
			if (typeof window !== 'undefined') {
				try {
					// D'abord détecter depuis l'URL
					const pathname = window.location.pathname
					const match = pathname.match(/^\/(fr|ru|en)/)

					if (match) {
						// URL contient une locale valide → utiliser ça
						setLocale(match[1])
						// NOTE: Don't write spoken_language here - it's managed by UserContext
						// spoken_language is the user's native language, not the interface language
					} else {
						// Pas de locale dans l'URL → fallback sur localStorage
						const storedLocale = localStorage.getItem('spoken_language')
						if (storedLocale && ['fr', 'ru', 'en'].includes(storedLocale)) {
							setLocale(storedLocale)
						} else {
							// Fallback final : français
							setLocale('fr')
						}
					}
				} catch (e) {
					setLocale('fr')
				}
			}
		}
	}, [routerType, pagesRouterContext])

	// Fonction push compatible
	const push = useCallback(
		(path) => {
			if (routerType === 'pages' && pagesRouterContext) {
				return pagesRouterContext.push(path)
			} else {
				// App Router : utiliser window.location pour l'instant
				// Plus tard, on pourra importer dynamiquement useRouter de next/navigation
				if (typeof window !== 'undefined') {
					window.location.href = path
				}
			}
		},
		[routerType, pagesRouterContext]
	)

	// Fonction replace compatible
	const replace = useCallback(
		(path) => {
			if (routerType === 'pages' && pagesRouterContext) {
				return pagesRouterContext.replace(path)
			} else {
				// App Router : utiliser window.location.replace
				if (typeof window !== 'undefined') {
					window.location.replace(path)
				}
			}
		},
		[routerType, pagesRouterContext]
	)

	return useMemo(
		() => ({
			locale,
			push,
			replace,
			routerType,
		}),
		[locale, push, replace, routerType]
	)
}
