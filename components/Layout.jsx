import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'

const Layout = ({ children }) => {
	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	)
}

export default Layout
