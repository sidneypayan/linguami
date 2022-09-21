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
		let { user, error } = await supabase.auth.signUp({ email, password })

		if (user.identities.length === 0) {
			return toast.error('Cet email est déjà utilisé')
		}

		if (error) {
			return toast.error(error)
		}

		console.log(name)

		setUser(user)
		toast.success(
			'Vous êtes bien enregistré. Veuillez vérifier le mail que nous avous avons envoyé :)'
		)

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
				return toast.error(
					"Veuillez confirmer l'email que nous vous avons envoyé"
				)
			}
			return toast.error(error.message)
		}

		setUser(user)
		toast.success('Vous êtes bien connecté')
		router.push('/')
	}

	const logout = async () => {
		supabase.auth.signOut()
		setUser(null)
		toast.success('Déconnexion en cours...')
	}

	useEffect(() => {
		const getUserProfile = async () => {
			const sessionUser = supabase.auth.user()

			if (sessionUser) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user?.id)
					.single()

				setUserProfile({ ...sessionUser, ...profile })

				setIsLoading(false)
			}
		}

		getUserProfile()

		supabase.auth.onAuthStateChange(() => {
			getUserProfile()
		})
	}, [])

	console.log(userProfile)

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
		logout,
	}

	return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
export default UserProvider
