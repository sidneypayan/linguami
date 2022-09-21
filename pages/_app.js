import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from '../context/user.js'
import { store } from '../features/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<ToastContainer position='top-center' />
			</Provider>
		</UserProvider>
	)
}

export default MyApp
