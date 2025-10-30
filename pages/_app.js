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
import Script from 'next/script'

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
		fontFamily: ['Open Sans'],
		h1: {
			fontWeight: 800,
			color: '#2d3748',
			letterSpacing: '-0.5px',
		},
		h2: {
			fontWeight: 700,
			color: '#2d3748',
			letterSpacing: '-0.5px',
		},
		h3: {
			fontWeight: 700,
			color: '#4a5568',
			letterSpacing: '-0.3px',
		},
		h4: {
			fontWeight: 600,
			color: '#4a5568',
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
		},
		subtitle2: {
			color: '#718096',
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

	return (
		<>
			<Script
				id='gtm-script'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `,
				}}
			/>

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
