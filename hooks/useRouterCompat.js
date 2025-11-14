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
			// App Router : récupérer depuis localStorage ou URL
			if (typeof window !== 'undefined') {
				try {
					const storedLocale = localStorage.getItem('interface_language')
					if (storedLocale && ['fr', 'ru', 'en'].includes(storedLocale)) {
						setLocale(storedLocale)
					} else {
						// Détecter depuis l'URL
						const pathname = window.location.pathname
						const match = pathname.match(/^\/(fr|ru|en)/)
						if (match) {
							setLocale(match[1])
							localStorage.setItem('interface_language', match[1])
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

	return useMemo(
		() => ({
			locale,
			push,
			routerType,
		}),
		[locale, push, routerType]
	)
}
