import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import EducationalMenu from './layouts/EducationalMenu'
import { useSelector } from 'react-redux'
import { useUserContext } from '../context/user'
import FlashCards from './games/Flashcards'

const Layout = ({ children }) => {
	const { isUserLoggedIn } = useUserContext()
	const { isFlashcardsOpen } = useSelector(store => store.cards)
	return isFlashcardsOpen ? (
		<FlashCards />
	) : (
		<>
			<Navbar />
			{/* {isUserLoggedIn && <EducationalMenu />} */}
			{children}
			<Footer />
		</>
	)
}

export default Layout
