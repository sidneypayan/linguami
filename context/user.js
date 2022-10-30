import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import axios from 'axios'

const UserContext = createContext()

const UserProvider = ({ children }) => {
	const router = useRouter()

	const [user, setUser] = useState(supabase.auth.user() || null)
	const [userProfile, setUserProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(null)

	const register = async data => {
		const { name, email, password } = data
		let { user, error } = await supabase.auth.signUp(
			{ email, password },
			{
				data: {
					name: name,
				},
			}
		)

		// if (user.identities.length === 0) {
		// 	return toast.error('Cet email est déjà utilisé')
		// }

		if (error) {
			return toast.error(error)
		}

		toast.success('Veuillez vérifier le mail que nous avous avons envoyé :)')

		router.back()
	}

	const login = async data => {
		const { email, password } = data
		let { user, error } = await supabase.auth.signIn({
			email,
			password,
		})

		if (error) {
			if (error.message === 'Invalid login credentials') {
				return toast.error('Vos identifiants sont erronés')
			}
			if (error.message === 'Email not confirmed') {
				return toast.error("Nous vous avons envoyé un mail d'inscription")
			}
			return toast.error(error.message)
		}

		setUser(user)
		router.push('/')
		toast.success('Vous êtes bien connecté')
	}

	const loginWithThirdPartyOAuth = async provider => {
		const { user, session, error } = await supabase.auth.signIn({
			provider,
		})
	}

	const logout = async () => {
		await supabase.auth.signOut()
		setUser(null)
		router.push('/')
		toast.success('Déconnexion en cours...')
	}

	const askNewPassword = async email => {
		let { error } = supabase.auth.api.resetPasswordForEmail(email)

		if (error) {
			return toast.error(error)
		}

		toast.success(
			'Vous allez recevoir un email avec les instructions nécessaires'
		)
	}

	const setNewPassword = async password => {
		const { data, error } = await supabase.auth.update({
			password: password,
		})

		if (data) {
			toast.success('Mot de passe mis à jour avec succès')
			router.push('/register')
		}
		if (error) toast.error('Erreur avec le mot de passe')
	}

	useEffect(() => {
		const getUserProfile = async () => {
			const sessionUser = supabase.auth.user()

			setUser(sessionUser)

			if (sessionUser) {
				const { data: profile } = await supabase
					.from('users_profile')
					.select('*')
					.eq('id', sessionUser.id)
					.single()

				setUserProfile({ ...sessionUser, ...profile })

				setIsLoading(false)
			}
		}

		supabase.auth.onAuthStateChange(() => {
			getUserProfile()
		})

		getUserProfile()
	}, [])

	useEffect(() => {
		axios.post('/api/auth', {
			event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
			session: supabase.auth.session(),
		})
	}, [user])

	useEffect(() => {
		if (user) {
			setIsUserLoggedIn(true)
		} else {
			setIsUserLoggedIn(false)
		}
	}, [user])

	const exposed = {
		user,
		userProfile,
		isLoading,
		isUserLoggedIn,
		register,
		login,
		loginWithThirdPartyOAuth,
		logout,
		askNewPassword,
		setNewPassword,
	}

	return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
export default UserProvider
