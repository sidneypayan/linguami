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
			primaryPurple: purple[500],
			secondaryPurple: purple[900],
			primaryGrey: grey[600],
			// primaryGrey: '#7e919f',
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
