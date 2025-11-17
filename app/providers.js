'use client'

import { Provider } from 'react-redux'
import { store } from '@/features/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import UserProvider from '@/context/user.js'
import { ThemeModeProvider } from '@/context/ThemeContext'
import { TranslationProvider } from '@/context/translation'
import { AchievementProvider } from '@/components/AchievementProvider'
import AppRouterLayout from '@/components/AppRouterLayout'
import { Toaster } from 'sonner'
import { useThemeMode } from '@/context/ThemeContext'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as gtm from '@/lib/gtm'

// Composant pour gérer le Toaster avec le bon thème
function ToasterWithTheme() {
	const { mode } = useThemeMode()
	return (
		<Toaster
			position="top-center"
			expand={false}
			richColors
			closeButton
			theme={mode}
			duration={3000}
		/>
	)
}

// Composant pour gérer le tracking GTM
function GTMTracking() {
	const pathname = usePathname()

	useEffect(() => {
		if (pathname) {
			// Extraire la locale du pathname si présent
			const locale = pathname.split('/')[1] || 'fr'
			gtm.pageview(pathname, locale)
		}
	}, [pathname])

	return null
}

export default function Providers({ children }) {
	// Create QueryClient inside component to avoid sharing between requests
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<ThemeModeProvider>
					<TranslationProvider>
						<Provider store={store}>
							<AchievementProvider>
								<GTMTracking />
								<AppRouterLayout>
									{children}
								</AppRouterLayout>
								<ToasterWithTheme />
							</AchievementProvider>
						</Provider>
					</TranslationProvider>
				</ThemeModeProvider>
			</UserProvider>
		</QueryClientProvider>
	)
}
