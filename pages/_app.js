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

function MyApp({ Component, pageProps }) {
	let myTheme = createTheme({
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
		},
		typography: {
			fontFamily: ['Open Sans'],
		},
	})

	myTheme = responsiveFontSizes(myTheme)

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
						<ToastContainer position='top-center' autoClose={2000} />
					</Provider>
				</UserProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
