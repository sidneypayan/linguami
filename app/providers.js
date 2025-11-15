'use client'

import { Provider } from 'react-redux'
import { store } from '@/features/store'
import UserProvider from '@/context/user.js'
import { ThemeModeProvider } from '@/context/ThemeContext'
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
	return (
		<UserProvider>
			<ThemeModeProvider>
				<Provider store={store}>
					<AchievementProvider>
						<GTMTracking />
						<AppRouterLayout>
							{children}
						</AppRouterLayout>
						<ToasterWithTheme />
					</AchievementProvider>
				</Provider>
			</ThemeModeProvider>
		</UserProvider>
	)
}
