import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getLessons } from '../features/lessons/lessonsSlice'
import FlashCards from './games/Flashcards'

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
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	)
}

export default Layout
