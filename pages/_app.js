import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from '../context/user.js'
import { ThemeModeProvider, useThemeMode } from '../context/ThemeContext'
import { store } from '../features/store'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtm from '../lib/gtm'

// Composant interne pour avoir accès au thème
function AppContent({ Component, pageProps }) {
	const router = useRouter()
	const { mode } = useThemeMode()

	// Tracking des changements de page pour GTM/GA
	useEffect(() => {
		// Envoyer le pageview initial
		gtm.pageview(router.asPath, router.locale)

		// Écouter les changements de route
		const handleRouteChange = (url) => {
			gtm.pageview(url, router.locale)
		}

		router.events.on('routeChangeComplete', handleRouteChange)

		// Nettoyage
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.asPath, router.events, router.locale])

	return (
		<>
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<ToastContainer
					position='top-center'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme={mode}
				/>
			</Provider>
		</>
	)
}

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<ThemeModeProvider>
				<AppContent Component={Component} pageProps={pageProps} />
			</ThemeModeProvider>
		</UserProvider>
	)
}

export default MyApp
