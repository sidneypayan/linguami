import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import { useSelector } from 'react-redux'
import FlashCards from './games/Flashcards'

const Layout = ({ children }) => {
	const { isFlashcardsOpen } = useSelector(store => store.cards)
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
