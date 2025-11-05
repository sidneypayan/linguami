import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import BottomNav from './layouts/BottomNav'
import EmailVerificationBanner from './auth/EmailVerificationBanner'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getLessons } from '../features/lessons/lessonsSlice'
import FlashCards from './games/Flashcards'
import { Box } from '@mui/material'

const Layout = ({ children }) => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { isFlashcardsOpen } = useSelector(store => store.cards)
	const lang = router.locale

	// Charger les leçons au démarrage pour vérifier s'il y en a pour cette langue
	useEffect(() => {
		if (lang) {
			dispatch(getLessons({ lang }))
		}
	}, [dispatch, lang])

	return isFlashcardsOpen ? (
		<FlashCards />
	) : (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}>
			<Navbar />
			<EmailVerificationBanner />
			<Box
				component='main'
				sx={{
					flex: 1,
					pb: { xs: '90px', md: 0 }, // Padding bottom pour la bottom nav sur mobile et tablette
				}}>
				{children}
			</Box>
			<Footer />
			<BottomNav />
		</Box>
	)
}

export default Layout
