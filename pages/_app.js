import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from '../features/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
			<ToastContainer position='top-center' />
		</Provider>
	)
}

export default MyApp
