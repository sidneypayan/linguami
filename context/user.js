import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import axios from 'axios'

const UserContext = createContext()

const UserProvider = ({ children }) => {
	const router = useRouter()

	const [user, setUser] = useState(null)
	const [userProfile, setUserProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(null)
	const [isUserAdmin, setIsUserAdmin] = useState(null)
	const [isUserPremium, setIsUserPremium] = useState(null)
	const [defaultLearningLanguage, setDefaultLearningLanguage] = useState(null)
	const [userLearningLanguage, setUserLearningLanguage] = useState(null)

	useEffect(() => {
		if (!userLearningLanguage) {
			setDefaultLearningLanguage(router.locale === 'ru' ? 'fr' : 'ru')
			setUserLearningLanguage(router.locale === 'ru' ? 'fr' : 'ru')
		}
	})

	useEffect(() => {
		if (supabase.auth.session()) {
			const getUser = () => {
				const { user } = supabase.auth.session()
				setUser(user)
			}
			getUser()
		}
	}, [])

	const register = async userData => {
		const { email, password } = userData

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					learning_language: userLearningLanguage,
				},
			},
		})

		if (error) {
			return toast.error(error)
		}

		toast.success(
			'Nous vous avons envoyé un mail de confirmation'
		)

		setTimeout(() => {
			router.push('/')
		}, 3500)
	}

	const login = async userData => {
		const { email, password } = userData
		const { data, error } = await supabase.auth.signIn({
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
		let { data, error } = await supabase.auth.api.resetPasswordForEmail(email)

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
			router.push('/')
		}
		if (error) toast.error('Erreur avec le mot de passe')
	}

	const changeLearningLanguage = async learningLanguage => {
		localStorage.setItem('learning_language', learningLanguage)
		setUserLearningLanguage(learningLanguage)
	}

	useEffect(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			if (event == 'SIGNED_IN') {
				const getUserProfile = async () => {
					const { data: userData } = await supabase
						.from('users_profile')
						.select('*')
						.eq('id', user.id)
						.single()

					setUserProfile({ ...user, ...userData })
					setIsLoading(false)
				}

				const { user } = session
				setUser(user)
				getUserProfile()
			}
		})
	}, [])

	useEffect(() => {
		if (userProfile) {
			setIsUserAdmin(userProfile?.role)
			setIsUserPremium(userProfile?.is_premium)
		}
	}, [userProfile])

	useEffect(() => {
		axios.post('/api/auth', {
			event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
			session: supabase.auth.session(),
		})

		if (user) {
			setIsUserLoggedIn(true)
		} else {
			setIsUserLoggedIn(false)
		}
	}, [user])

	const exposed = {
		user,
		isUserAdmin,
		userProfile,
		isLoading,
		isUserLoggedIn,
		register,
		login,
		loginWithThirdPartyOAuth,
		logout,
		askNewPassword,
		setNewPassword,
		defaultLearningLanguage,
		userLearningLanguage,
		changeLearningLanguage,
	}

	return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
export default UserProvider
