import 'normalize.css'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from '../context/user.js'
import { store } from '../features/store'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material'
import { purple, grey } from '@mui/material/colors'

function MyApp({ Component, pageProps }) {
	const myTheme = createTheme({
		palette: {
			clrPrimary1: '#432874',
			clrPrimary2: '#432879',
			clrPrimary3: '#4f2a93',
			clrPrimary4: '#992F7B',
			clrBtn1: '#4f2a93',
			clrBtn2: '#0056BB',
			secondaryPurple: purple[900],
			clrGrey1: grey[800],
			clrGrey2: grey[700],
			clrGrey3: grey[600],
			clrGrey4: grey[500],
			// primaryGrey: '#7e919f',
		},
		typography: {
			fontFamily: ['Open Sans'],
		},
	})

	return (
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
	)
}

export default MyApp
