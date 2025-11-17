'use client'

import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import BottomNav from './layouts/BottomNav'
import EmailVerificationBanner from './auth/EmailVerificationBanner'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import FlashCards from './games/Flashcards'
import { Box, useTheme, CssBaseline } from '@mui/material'

const AppRouterLayout = ({ children }) => {
	const dispatch = useDispatch()
	const { isFlashcardsOpen } = useSelector(store => store.cards)
	const locale = useLocale()
	const theme = useTheme()

	// Charger les leçons au démarrage pour vérifier s'il y en a pour cette langue
	useEffect(() => {
		if (locale) {

	return isFlashcardsOpen ? (
		<FlashCards />
	) : (
		<>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh',
					bgcolor: 'background.default',
					background: theme.palette.mode === 'dark'
						? 'background.default'
						: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
					color: 'text.primary',
					transition: 'background-color 0.3s ease, color 0.3s ease',
				}}>
				<Navbar />
				<EmailVerificationBanner />
				<Box
					component='main'
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
					}}>
					{children}
				</Box>
				<Footer />
				<BottomNav />
			</Box>
		</>
	)
}

export default AppRouterLayout
