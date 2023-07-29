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
	const [defaultLearningLanguage, setDefaultLearningLanguage] = useState(null)
	const [userLearningLanguage, setUserLearningLanguage] = useState(null)

	useEffect(() => {
		if (!userLearningLanguage) {
			setDefaultLearningLanguage(router.locale === 'ru' ? 'fr' : 'ru')
			setUserLearningLanguage(router.locale === 'ru' ? 'fr' : 'ru')
		}
	})

	console.log(defaultLearningLanguage, userLearningLanguage)

	// useEffect(() => {
	// 	userProfile.user_metadata.learning_language ? setLearningLanguage(userProfile.user_metadata.learning_language) :
	// }, [])

	// useEffect(() => {
	// 	const getUser = async () => {
	// 		const {
	// 			data: { user },
	// 		} = await supabase.auth.getUser()
	// 		setUser(user)
	// 	}
	// 	getUser()
	// }, [])

	const register = async userData => {
		const { email, password } = userData

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					learning_language: learningLanguage,
				},
			},
		})

		if (error) {
			return toast.error(error)
		}

		toast.success(
			'Nous vous avons envoyé un lien afin de confirmer votre inscription'
		)

		setTimeout(() => {
			router.push('/')
		}, 3500)
	}

	const login = async userData => {
		const { email, password } = userData
		const { data, error } = await supabase.auth.signInWithPassword({
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

		setUser(supabase.auth.getUser())
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

	const changeLearningLanguage = async learningLanguage => {
		localStorage.setItem('learning_language', learningLanguage)
		setUserLearningLanguage(learningLanguage)
	}

	// useEffect(() => {
	// 	if (user) {
	// 	const getUserProfile = async () => {

	// 			const { data: userData } = await supabase
	// 				.from('users_profile')
	// 				.select('*')
	// 				.eq('id', user.id)
	// 				.single()

	// 			setUserProfile({ ...user, ...userData })
	// 			setIsLoading(false)
	// 		}

	// 	supabase.auth.onAuthStateChange(() => {
	// 		getUserProfile()
	// 	})

	// 	getUserProfile()

	// }
	// }, [user])

	// useEffect(() => {

	// 	supabase.auth.onAuthStateChange((event, session) => {

	// 		const {user} = session
	// 		setUser(user)

	// 		const getUserProfile = async () => {

	// 			const { data: userData } = await supabase
	// 				.from('users_profile')
	// 				.select('*')
	// 				.eq('id', user.id)
	// 				.single()

	// 			setUserProfile({ ...user, ...userData })
	// 			setIsLoading(false)
	// 		}

	// 		if (event == 'SIGNED_IN') {

	// 			getUserProfile()
	// 			setIsUserAdmin(userProfile.role)
	// 		}
	// 	  })
	// }, [])

	// console.log(isUserAdmin)

	// useEffect(() => {
	// 	userProfile?.role && setIsUserAdmin(userProfile.role)
	// }, [userProfile])

	// console.log(isUserAdmin)
	// console.log(userProfile)

	// useEffect(() => {
	// 	axios.post('/api/auth', {
	// 		event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
	// 		session: supabase.auth.getSession(),
	// 	})
	// }, [user])

	useEffect(() => {
		if (user) {
			setIsUserLoggedIn(true)
		} else {
			setIsUserLoggedIn(false)
		}
	}, [user])

	const exposed = {
		user,
		isUserAdmin,
		// userProfile,
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
