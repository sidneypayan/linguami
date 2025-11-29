'use client'

import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import EmailVerificationBanner from '../auth/EmailVerificationBanner'
import { useFlashcards } from '@/context/flashcards'
import FlashCards from '../games/Flashcards'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const Layout = ({ children }) => {
	const { isFlashcardsOpen } = useFlashcards()
	const { isDark } = useThemeMode()

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
			<Navbar />
			<EmailVerificationBanner />
			<main className="flex-1 flex flex-col">
				{children}
			</main>
			<Footer />
			<BottomNav />
		</div>
	)
}

export default Layout
