'use client'

import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import EmailVerificationBanner from '../auth/EmailVerificationBanner'
import { useFlashcards } from '@/context/flashcards'
import { useLocale } from 'next-intl'
import FlashCards from '../games/Flashcards'
import { useThemeMode } from '@/context/ThemeContext'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const AppRouterLayout = ({ children }) => {
	const { isFlashcardsOpen } = useFlashcards()
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const pathname = usePathname()

	// Check if we're on an admin page
	const isAdminPage = pathname?.includes('/admin')

	// Check if we're on an immersive page (hide footer on mobile for better UX)
	const isImmersivePage =
		pathname?.includes('/training') ||
		pathname?.includes('/method/') && pathname?.split('/').length >= 5 || // /[locale]/method/[level]/[lesson]
		pathname?.includes('/dictionary') ||
		pathname?.includes('/materials/') && pathname?.split('/').length >= 5 // /[locale]/materials/[section]/[material]

	return isFlashcardsOpen ? (
		<FlashCards />
	) : (
		<div
			className={cn(
				'flex flex-col min-h-screen',
				'transition-colors duration-300',
				isDark
					? 'bg-slate-950 text-slate-100'
					: 'bg-gradient-to-b from-slate-50 to-white text-slate-900'
			)}
		>
			{!isAdminPage && <Navbar />}
			<EmailVerificationBanner />
			<main className="flex-1 flex flex-col">
				{children}
			</main>
			{!isAdminPage && (
				<Footer className={isImmersivePage ? 'hidden md:block' : ''} />
			)}
			{!isAdminPage && !isImmersivePage && <BottomNav />}
		</div>
	)
}

export default AppRouterLayout
