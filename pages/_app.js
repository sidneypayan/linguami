import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from '../context/user.js'

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
			<ToastContainer position='top-center' />
		</UserProvider>
	)
}

export default MyApp
