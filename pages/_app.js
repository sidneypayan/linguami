import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from '../context/user.js'
import { store } from '../features/store'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'
import { purple, grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtm from '../lib/gtm'

// Créer le thème en dehors du composant pour éviter la recréation à chaque render
const baseTheme = createTheme({
	palette: {
		clrPrimary1: '#432874',
		clrPrimary2: '#432879',
		clrPrimary3: '#4f2a93',
		clrPrimary4: '#992F7B',
		clrBtn1: '#4f2a93',
		clrBtn2: '#0056BB',
		clrGrey1: grey[800],
		clrGrey2: grey[700],
		clrGrey3: grey[600],
		clrGrey4: grey[500],
		clrCardBg: '#f5f5f5',
		primary: {
			main: '#667eea',
			dark: '#764ba2',
			light: '#8b9ff5',
		},
		secondary: {
			main: '#f093fb',
			dark: '#f5576c',
		},
	},
	typography: {
		fontFamily: ['Poppins', 'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
		h1: {
			fontWeight: 800,
			color: '#2d3748',
			letterSpacing: '-1px',
		},
		h2: {
			fontWeight: 700,
			color: '#2d3748',
			letterSpacing: '-0.8px',
		},
		h3: {
			fontWeight: 700,
			color: '#4a5568',
			letterSpacing: '-0.5px',
		},
		h4: {
			fontWeight: 600,
			color: '#4a5568',
			letterSpacing: '-0.3px',
		},
		h5: {
			fontWeight: 600,
			color: '#667eea',
		},
		h6: {
			fontWeight: 600,
			color: '#718096',
		},
		subtitle1: {
			color: '#4a5568',
			fontWeight: 500,
		},
		subtitle2: {
			color: '#718096',
			fontWeight: 500,
		},
		body1: {
			fontWeight: 400,
		},
		body2: {
			fontWeight: 400,
		},
		button: {
			fontWeight: 600,
			letterSpacing: '0.3px',
		},
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				h1: {
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
				},
				h2: {
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
				},
			},
		},
	},
})

const myTheme = responsiveFontSizes(baseTheme)

function MyApp({ Component, pageProps }) {
	const router = useRouter()

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
			<ThemeProvider theme={myTheme}>
				<UserProvider>
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
							theme='light'
						/>
					</Provider>
				</UserProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
