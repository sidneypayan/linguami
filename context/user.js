// /context/UserContext.jsx
import {
	useState,
	useEffect,
	useMemo,
	useCallback,
	createContext,
	useContext,
} from 'react'
import { supabase } from '../lib/supabase' // client navigateur (@supabase/ssr)
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { createToastMessages } from '../utils/toastMessages'

// --------------------------------------------------------
// Contexte
// --------------------------------------------------------
const UserContext = createContext(undefined)

const UserProvider = ({ children }) => {
	const router = useRouter()

	// ---- Etats
	const [user, setUser] = useState(null)
	const [userProfile, setUserProfile] = useState(null)
	const [isUserAdmin, setIsUserAdmin] = useState(false)
	const [isUserPremium, setIsUserPremium] = useState(false)
	const [userLearningLanguage, setUserLearningLanguage] = useState(null)
	const [isBootstrapping, setIsBootstrapping] = useState(true)
	const [hasShownLoginToast, setHasShownLoginToast] = useState(false)

	// ---- Toast messages avec la bonne locale
	const toastMessages = useMemo(
		() => createToastMessages(router.locale),
		[router.locale]
	)

	// ---- Helpers
	const safeToastError = (err, fallback = toastMessages.genericError()) => {
		const message = (typeof err === 'string' ? err : err?.message) || fallback
		toast.error(message)
	}

	const fetchUserProfile = useCallback(async userId => {
		// Récupérer le profil utilisateur
		const { data, error } = await supabase
			.from('users_profile')
			.select('*')
			.eq('id', userId)
			.maybeSingle() // 0 ou 1 row → pas d'erreur 406 si absent
		if (error) throw error

		// Récupérer les données XP
		const { data: xpData, error: xpError } = await supabase
			.from('user_xp_profile')
			.select('total_xp, current_level, daily_streak, total_gold')
			.eq('user_id', userId)
			.maybeSingle()

		// Fusionner les données
		return {
			...data,
			xp: xpData?.total_xp || 0,
			level: xpData?.current_level || 1,
			streak: xpData?.daily_streak || 0,
			gold: xpData?.total_gold || 0,
		}
	}, [])

	const hydrateFromSession = useCallback(
		async session => {
			if (!session?.user) {
				setUser(null)
				setUserProfile(null)
				setIsUserAdmin(false)
				setIsUserPremium(false)
				return
			}
			const signedUser = session.user
			setUser(signedUser)

			try {
				const profile = await fetchUserProfile(signedUser.id)
				if (profile) {
					setUserProfile({ ...signedUser, ...profile })
					setIsUserAdmin(profile?.role === 'admin') // ajuste selon ton schéma
					setIsUserPremium(!!profile?.is_premium)

					if (profile?.learning_language) {
						setUserLearningLanguage(profile.learning_language)
						try {
							localStorage.setItem(
								'learning_language',
								profile.learning_language
							)
						} catch {}
					} else {
						// Si pas de langue d'apprentissage définie, en définir une différente de la locale
						const currentLocale = router?.locale || 'fr'
						const defaultLearningLang = currentLocale === 'ru' ? 'fr' : 'ru'
						setUserLearningLanguage(defaultLearningLang)
						try {
							localStorage.setItem('learning_language', defaultLearningLang)
						} catch {}
						// Sauvegarder dans le profil
						try {
							await supabase
								.from('users_profile')
								.update({ learning_language: defaultLearningLang })
								.eq('id', signedUser.id)
						} catch {}
					}
				} else {
					// Pas de ligne dans users_profile : on garde le user "Auth"
					setUserProfile(signedUser)
				}
			} catch (err) {
				safeToastError(err, toastMessages.profileLoadError())
			}
		},
		[fetchUserProfile, router]
	)

	// --------------------------------------------------------
	// Bootstrap initial (lecture session, init langue invité)
	// --------------------------------------------------------
	useEffect(() => {
		let cancelled = false

		const init = async () => {
			try {
				const { data: { session } = {} } = await supabase.auth.getSession()
				if (session?.user) {
					await hydrateFromSession(session)
				} else {
					// invité : init langue depuis localStorage ou fallback basé sur locale
					try {
						const currentLocale = router?.locale || 'fr'
						const stored = localStorage.getItem('learning_language')
						const fallback = currentLocale === 'ru' ? 'fr' : 'ru'

						// Si la langue stockée est la même que la locale, utiliser le fallback
						let lang = stored
						if (!stored || stored === currentLocale) {
							lang = fallback
						}

						setUserLearningLanguage(lang)
						localStorage.setItem('learning_language', lang)
					} catch {}
				}
			} finally {
				if (!cancelled) setIsBootstrapping(false)
			}
		}

		init()
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// --------------------------------------------------------
	// Vérifier que la langue d'apprentissage est toujours différente de la locale
	// --------------------------------------------------------
	useEffect(() => {
		if (!router?.locale || !userLearningLanguage || isBootstrapping) return

		// Si la langue d'apprentissage est la même que la locale, la changer
		if (userLearningLanguage === router.locale) {
			const newLearningLang = router.locale === 'ru' ? 'fr' : 'ru'
			setUserLearningLanguage(newLearningLang)
			try {
				localStorage.setItem('learning_language', newLearningLang)
			} catch {}
		}
	}, [router?.locale, userLearningLanguage, isBootstrapping])

	// --------------------------------------------------------
	// Listener d'auth (UI uniquement — aucune redirection ici)
	// --------------------------------------------------------
	useEffect(() => {
		const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
			(event, session) => {
				// Evite l'async direct dans le callback (reco Supabase)
				setTimeout(async () => {
					try {
						if (
							event === 'INITIAL_SESSION' ||
							event === 'TOKEN_REFRESHED' ||
							event === 'SIGNED_IN'
						) {
							// hydrate silencieusement, sans redirection
							await hydrateFromSession(session)
							return
						}

						if (event === 'SIGNED_OUT') {
							setUser(null)
							setUserProfile(null)
							setIsUserAdmin(false)
							setIsUserPremium(false)
							// Ici tu peux toaster si besoin, mais sans forcer la redirection
							// toast.success('Déconnexion en cours...')
						}
					} catch (err) {
						safeToastError(err)
					}
				}, 0)
			}
		)

		return () => {
			subscription?.unsubscribe?.()
		}
	}, [hydrateFromSession])

	// --------------------------------------------------------
	// Actions Auth (v2)
	// --------------------------------------------------------
	const register = useCallback(
		async ({ email, password, username, spokenLanguage, learningLanguage, languageLevel, selectedAvatar }) => {
			// Utiliser la langue d'apprentissage du formulaire si fournie
			const learningLang = learningLanguage || (() => {
				const currentLocale = router?.locale || 'fr'
				let lang = userLearningLanguage
				if (!lang || lang === currentLocale) {
					lang = currentLocale === 'ru' ? 'fr' : 'ru'
				}
				return lang
			})()

			setUserLearningLanguage(learningLang)
			try {
				localStorage.setItem('learning_language', learningLang)
			} catch {}

			// Sign up avec auth metadata
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						learning_language: learningLang,
						username: username || null,
					},
					// callback après confirmation (doit être whitelisted)
					emailRedirectTo: `${
						process.env.NEXT_PUBLIC_API_URL || window.location.origin
					}/auth/callback`,
				},
			})
			if (error) return safeToastError(error)

			// Si l'utilisateur a été créé, créer ou mettre à jour son profil
			if (data?.user) {
				try {
					const profileData = {
						id: data.user.id,
						email: email,
						name: username || email.split('@')[0],
						learning_language: learningLang,
						role: 'user',
						is_premium: false,
						avatar_id: selectedAvatar || 'avatar1', // Stocker l'ID de l'avatar
					}

					// Ajouter les champs supplémentaires s'ils sont fournis
					if (spokenLanguage) {
						profileData.spoken_language = spokenLanguage
					}
					if (languageLevel) {
						profileData.language_level = languageLevel
					}

					// Insérer ou mettre à jour le profil
					const { error: profileError } = await supabase
						.from('users_profile')
						.upsert(profileData, { onConflict: 'id' })

					if (profileError) {
						console.error('Error creating user profile:', profileError)
						// Ne pas bloquer l'inscription si le profil échoue
					}
				} catch (err) {
					console.error('Error creating user profile:', err)
				}
			}

			toast.success(toastMessages.confirmationEmailSent())
			// Redirection douce, optionnelle
			setTimeout(() => router.push('/'), 1200)
		},
		[router, userLearningLanguage, setUserLearningLanguage]
	)

	const login = useCallback(
		async ({ email, password }) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})
			if (error) {
				if (error.message === 'Invalid login credentials') {
					return toast.error(toastMessages.invalidCredentials())
				}
				if (error.message === 'Email not confirmed') {
					return toast.error(toastMessages.emailNotConfirmed())
				}
				return safeToastError(error)
			}

			// 👉 Afficher le toast seulement si pas déjà affiché
			if (!hasShownLoginToast) {
				toast.success(toastMessages.loginSuccess())
				setHasShownLoginToast(true)
				// Reset le flag après 2 secondes
				setTimeout(() => setHasShownLoginToast(false), 2000)
			}
			router.push('/')
		},
		[router, hasShownLoginToast]
	)

	const loginWithThirdPartyOAuth = useCallback(async provider => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: process.env.NEXT_PUBLIC_API_URL || window.location.origin,
			},
		})
		if (error) safeToastError(error)
		// Redirection gérée par le provider / callback
	}, [])

	const logout = useCallback(async () => {
		const { error } = await supabase.auth.signOut()
		if (error) return safeToastError(error)
		// Le listener gère le reset d’état ; pas de redirection forcée ici
	}, [])

	const updatePassword = useCallback(async email => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${
				process.env.NEXT_PUBLIC_API_URL || window.location.origin
			}/set-password`,
		})
		if (error) return safeToastError(error)
		toast.success(toastMessages.passwordResetEmailSent())
	}, [])

	const setNewPassword = useCallback(
		async password => {
			const { error } = await supabase.auth.updateUser({ password })
			if (error) return safeToastError(error, toastMessages.passwordUpdateError())
			toast.success(toastMessages.passwordUpdateSuccess())
			router.push('/')
		},
		[router]
	)

	const changeLearningLanguage = useCallback(
		async learningLanguage => {
			try {
				if (user) {
					const { data, error } = await supabase
						.from('users_profile')
						.update({ learning_language: learningLanguage })
						.eq('id', user.id)
						.select() // v2: nécessaire pour lire la ligne modifiée
					if (error) throw error

					const updated = Array.isArray(data) ? data[0] : data
					const lang = updated?.learning_language || learningLanguage
					setUserLearningLanguage(lang)
					try {
						localStorage.setItem('learning_language', lang)
					} catch {}
				} else {
					setUserLearningLanguage(learningLanguage)
					try {
						localStorage.setItem('learning_language', learningLanguage)
					} catch {}
				}
			} catch (err) {
				safeToastError(err, toastMessages.languageUpdateError())
			}
		},
		[user]
	)

	const updateUserProfile = useCallback(
		async (updateData) => {
			if (!user) {
				throw new Error('User not logged in')
			}

			try {
				// Vérifier si le pseudo est déjà pris par un autre utilisateur
				if (updateData.name && updateData.name !== userProfile?.name) {
					const { data: existingUser, error: checkError } = await supabase
						.from('users_profile')
						.select('id')
						.eq('name', updateData.name)
						.neq('id', user.id)
						.maybeSingle()

					if (checkError && checkError.code !== 'PGRST116') {
						throw checkError
					}

					if (existingUser) {
						throw new Error('Ce pseudo est déjà utilisé par un autre utilisateur')
					}
				}

				// Mettre à jour le profil
				const { data, error } = await supabase
					.from('users_profile')
					.update(updateData)
					.eq('id', user.id)
					.select()

				if (error) throw error

				// Mettre à jour le profil local
				const updated = Array.isArray(data) ? data[0] : data
				if (updated) {
					setUserProfile(updated)

					// Mettre à jour la langue d'apprentissage si elle a changé
					if (updateData.learning_language) {
						setUserLearningLanguage(updateData.learning_language)
						try {
							localStorage.setItem('learning_language', updateData.learning_language)
						} catch {}
					}
				}

				return updated
			} catch (err) {
				throw err
			}
		},
		[user, userProfile]
	)

	// --------------------------------------------------------
	// Valeur exposée
	// --------------------------------------------------------
	const value = useMemo(
		() => ({
			user,
			userProfile,
			isUserAdmin,
			isUserPremium,
			isUserLoggedIn: !!user,
			isBootstrapping,
			userLearningLanguage,

			register,
			login,
			loginWithThirdPartyOAuth,
			logout,
			updatePassword,
			setNewPassword,
			changeLearningLanguage,
			updateUserProfile,
		}),
		[
			user,
			userProfile,
			isUserAdmin,
			isUserPremium,
			isBootstrapping,
			userLearningLanguage,
			register,
			login,
			loginWithThirdPartyOAuth,
			logout,
			updatePassword,
			setNewPassword,
			changeLearningLanguage,
			updateUserProfile,
		]
	)

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook
export const useUserContext = () => {
	const ctx = useContext(UserContext)
	if (!ctx) throw new Error('useUserContext must be used within a UserProvider')
	return ctx
}

export default UserProvider
