// /context/UserContext.jsx
import {
	useState,
	useEffect,
	useMemo,
	useCallback,
	createContext,
	useContext,
} from 'react'
import { supabase } from '@/lib/supabase' // client navigateur (@supabase/ssr)
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import toast from '@/utils/toast'
import { createToastMessages } from '@/utils/toastMessages'
import { sendConfirmationEmail, sendResetPasswordEmail, getEmailLanguage } from '@/lib/emailService'
import { sendVerificationEmail, isEmailVerified } from '@/lib/emailVerification'
import { migrateLocalProgress } from '@/lib/courses-client'
// --------------------------------------------------------
// Helper: Déterminer la langue d'apprentissage par défaut
// --------------------------------------------------------
const getDefaultLearningLanguage = (currentLocale) => {
	// Règles :
	// - spoken = 'fr' → learning = 'ru'
	// - spoken = 'ru' → learning = 'fr'
	// - spoken = 'en' → learning = 'fr' (par défaut)
	if (currentLocale === 'fr') return 'ru'
	if (currentLocale === 'ru') return 'fr'
	if (currentLocale === 'en') return 'fr'

	// Fallback: français
	return 'fr'
}

// --------------------------------------------------------
// Contexte
// --------------------------------------------------------
const UserContext = createContext(undefined)

const UserProvider = ({ children }) => {
	const router = useRouterCompat()

	// ---- Etats
	const [user, setUser] = useState(null)
	const [userProfile, setUserProfile] = useState(null)
	const [isUserAdmin, setIsUserAdmin] = useState(false)
	const [isUserPremium, setIsUserPremium] = useState(false)
	const [userLearningLanguage, setUserLearningLanguage] = useState(null)
	const [isBootstrapping, setIsBootstrapping] = useState(true)
	const [hasShownLoginToast, setHasShownLoginToast] = useState(false)

	// 🔑 Immediate sync from localStorage on mount (client-side only)
	// This runs ONCE on mount to sync localStorage values before the async DB call
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedSpokenLang = localStorage.getItem('spoken_language')
			const storedLearningLang = localStorage.getItem('learning_language')

			if (storedLearningLang) {
				setUserLearningLanguage(storedLearningLang)
			}
			if (storedSpokenLang) {
				setUserProfile(prev => prev ? { ...prev, spoken_language: storedSpokenLang } : { spoken_language: storedSpokenLang })
			}
		}
	}, [])

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
			.select('total_xp, current_level, daily_streak, total_gold, xp_in_current_level, longest_streak')
			.eq('user_id', userId)
			.maybeSingle()

		// Fusionner les données
		return {
			...data,
			xp: xpData?.total_xp || 0,
			level: xpData?.current_level || 1,
			streak: xpData?.daily_streak || 0,
			gold: xpData?.total_gold || 0,
			xp_in_current_level: xpData?.xp_in_current_level || 0,
			longest_streak: xpData?.longest_streak || 0,
		}
	}, [])

	const hydrateFromSession = useCallback(
		async session => {
			if (!session?.user) {
				setUser(null)
				setUserProfile(null)
				setIsUserAdmin(false)
				setIsUserPremium(false)
				return null
			}
			const signedUser = session.user
			setUser(signedUser)

			try {
				const profile = await fetchUserProfile(signedUser.id)
				if (profile) {
					setUserProfile({ ...signedUser, ...profile })
					setIsUserAdmin(profile?.role === 'admin') // ajuste selon ton schéma
					setIsUserPremium(!!profile?.is_premium)

					// 🛡️ VALIDATION: Détecter et corriger les conflits learning_language === spoken_language
					let learningLang = profile?.learning_language
					// Get spoken_language from DB, or fallback to localStorage, or finally to 'fr'
					const spokenLang = profile?.spoken_language
						|| (typeof window !== 'undefined' ? localStorage.getItem('spoken_language') : null)
						|| 'fr'

					// Si conflit détecté, corriger automatiquement
					if (learningLang && learningLang === spokenLang) {
						learningLang = getDefaultLearningLanguage(spokenLang)
						// Corriger en DB silencieusement
						try {
							await supabase
								.from('users_profile')
								.update({ learning_language: learningLang })
								.eq('id', signedUser.id)
						} catch {}
					}

					// Always sync spoken_language to localStorage from DB
					try {
						localStorage.setItem('spoken_language', spokenLang)
					} catch {}

					if (learningLang) {
						setUserLearningLanguage(learningLang)
						try {
							localStorage.setItem('learning_language', learningLang)
							// Also save to cookie for SSR
							if (typeof document !== 'undefined') {
								document.cookie = `learning_language=${learningLang}; path=/; max-age=31536000; SameSite=Lax`
							}
						} catch {}
					} else {
						// Si pas de langue d'apprentissage définie, en définir une différente de spoken_language
						const defaultLearningLang = getDefaultLearningLanguage(spokenLang)
						setUserLearningLanguage(defaultLearningLang)
						try {
							localStorage.setItem('learning_language', defaultLearningLang)
							// Also save to cookie for SSR
							if (typeof document !== 'undefined') {
								document.cookie = `learning_language=${defaultLearningLang}; path=/; max-age=31536000; SameSite=Lax`
							}
						} catch {}
						// Sauvegarder dans le profil
						try {
							await supabase
								.from('users_profile')
								.update({ learning_language: defaultLearningLang })
								.eq('id', signedUser.id)
						} catch {}
					}

					// Migrate local progress from localStorage to database
					try {
						const migrationResult = await migrateLocalProgress()
						if (migrationResult.success && migrationResult.migrated > 0) {
							logger.log(`✅ Migrated ${migrationResult.migrated} lesson(s) from localStorage to database`)
						}
					} catch (migrationError) {
						logger.error('Failed to migrate local progress:', migrationError)
						// Don't block login if migration fails
					}

					// Return the profile for use in login redirect
					return profile
				} else {
					// Pas de ligne dans users_profile : on garde le user "Auth"
					setUserProfile(signedUser)
					return signedUser
				}
			} catch (err) {
				safeToastError(err, toastMessages.profileLoadError())
				return null
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
						// Détecter la locale depuis l'URL directement (au cas où router.locale n'est pas encore défini)
						let currentLocale = 'fr' // Fallback par défaut
						if (typeof window !== 'undefined') {
							const pathname = window.location.pathname
							const match = pathname.match(/^\/(fr|ru|en)/)
							if (match) {
								currentLocale = match[1]
							}
						}
						// Sinon utiliser router.locale si disponible
						if (!currentLocale && router?.locale) {
							currentLocale = router.locale
						}

						const stored = localStorage.getItem('learning_language')
						const fallback = getDefaultLearningLanguage(currentLocale)

						// Si la langue stockée est la même que la locale, utiliser le fallback
						let lang = stored
						if (!stored || stored === currentLocale) {
							lang = fallback
						}

						setUserLearningLanguage(lang)
						localStorage.setItem('learning_language', lang)
						// Also save to cookie for SSR
						if (typeof document !== 'undefined') {
							document.cookie = `learning_language=${lang}; path=/; max-age=31536000; SameSite=Lax`
						}
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
	// Synchroniser spoken_language avec la locale de l'URL (pour invités uniquement)
	// --------------------------------------------------------
	useEffect(() => {
		if (!router?.locale || isBootstrapping || user) return

		const currentLocale = router.locale

		// Pour les invités uniquement : mettre à jour spoken_language dans localStorage
		try {
			localStorage.setItem('spoken_language', currentLocale)
		} catch {}

		// Note: Pour les utilisateurs connectés, spoken_language est géré par InterfaceLanguageMenu
	}, [router?.locale, isBootstrapping, user])

	// --------------------------------------------------------
	// Synchroniser learning_language avec la source de vérité appropriée
	// --------------------------------------------------------
	useEffect(() => {
		if (isBootstrapping || !router?.locale) return

		const currentLocale = router.locale

		// RÈGLE 1: Si utilisateur connecté, la DB (userProfile) est la source de vérité absolue
		if (user && userProfile?.learning_language) {
			// Ne jamais écraser la préférence de l'utilisateur stockée en DB
			if (userLearningLanguage !== userProfile.learning_language) {
				setUserLearningLanguage(userProfile.learning_language)
				try {
					localStorage.setItem('learning_language', userProfile.learning_language)
					// Also save to cookie for SSR
					if (typeof document !== 'undefined') {
						document.cookie = `learning_language=${userProfile.learning_language}; path=/; max-age=31536000; SameSite=Lax`
					}
				} catch {}
			}
			return // DB est prioritaire, ne pas aller plus loin
		}

		// RÈGLE 2: Pour les invités, utiliser localStorage ou fallback basé sur locale
		const stored = localStorage.getItem('learning_language')
		const fallback = getDefaultLearningLanguage(currentLocale)

		// RÈGLE 3: S'assurer que learning_language ≠ locale (on ne peut pas apprendre sa propre langue)
		let targetLang = stored || fallback
		if (targetLang === currentLocale) {
			targetLang = fallback
		}

		// Mettre à jour uniquement si différent
		if (userLearningLanguage !== targetLang) {
			setUserLearningLanguage(targetLang)
			try {
				localStorage.setItem('learning_language', targetLang)
				// Also save to cookie for SSR
				if (typeof document !== 'undefined') {
					document.cookie = `learning_language=${targetLang}; path=/; max-age=31536000; SameSite=Lax`
				}
			} catch {}
		}
	}, [user, userProfile?.learning_language, router?.locale, isBootstrapping, userLearningLanguage])

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
				const spokenLang = spokenLanguage || 'fr'
				let lang = userLearningLanguage
				if (!lang || lang === spokenLang) {
					lang = getDefaultLearningLanguage(spokenLang)
				}
				return lang
			})()

			setUserLearningLanguage(learningLang)
			try {
				localStorage.setItem('learning_language', learningLang)
			} catch {}

			// Créer l'utilisateur avec mot de passe
			const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						learning_language: learningLang,
						spoken_language: spokenLanguage || 'fr',
						language_level: languageLevel || 'beginner',
						username: username || null,
						avatar_id: selectedAvatar || 'avatar1',
					},
					emailRedirectTo: `${
						process.env.NEXT_PUBLIC_API_URL || window.location.origin
					}/auth/callback`,
				},
			})
			if (signUpError) return safeToastError(signUpError)

			// Le profil est créé automatiquement par le trigger de la base de données
			// L'utilisateur peut se connecter immédiatement

			// Envoyer l'email de vérification
			if (signUpData?.user) {
				try {
					const emailLanguage = getEmailLanguage(router?.locale || 'fr')
					await sendVerificationEmail(
						signUpData.user.id,
						email,
						emailLanguage
					)
					toast.success(toastMessages.confirmationEmailSent())
				} catch (error) {
					logger.error('Error sending verification email:', error)
					// Ne pas bloquer l'inscription si l'email échoue
					toast.info('Compte créé ! Vous pourrez vérifier votre email plus tard.')
				}
			}

			// Redirection avec onboarding modal
			setTimeout(() => router.push('/?onboarding=true'), 1200)
		},
		[router, userLearningLanguage, setUserLearningLanguage, toastMessages]
	)

	const login = useCallback(
		async ({ email, password }) => {
			const { data, error } = await supabase.auth.signInWithPassword({
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
			// 🔑 CRITICAL: Hydrate session BEFORE redirect to load language settings from DB
			// This prevents race condition where page renders with stale localStorage values
			let profile = null
			if (data?.session) {
				profile = await hydrateFromSession(data.session)
			}

			// 👉 Afficher le toast seulement si pas déjà affiché
			if (!hasShownLoginToast) {
				toast.success(toastMessages.loginSuccess())
				setHasShownLoginToast(true)
				// Reset le flag après 2 secondes
				setTimeout(() => setHasShownLoginToast(false), 2000)
			}

			// 🔧 FIX: Redirect to the user's spoken language locale instead of default
			// This prevents the URL from changing to a different locale after login
			const spokenLang = profile?.spoken_language || 'fr'
			router.push(`/${spokenLang}`)
		},
		[router, hasShownLoginToast, hydrateFromSession, toastMessages]
	)

	const loginWithThirdPartyOAuth = useCallback(async provider => {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${baseUrl}/auth/callback`,
			},
		})
		if (error) safeToastError(error)
		// Redirection gérée par le provider / callback
	}, [])

	const sendMagicLink = useCallback(async email => {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${baseUrl}/auth/callback`,
			},
		})
		if (error) {
			safeToastError(error)
			return false
		}
		toast.success(toastMessages.magicLinkSent())
		return true
	}, [toastMessages])

	const logout = useCallback(async () => {
		const { error } = await supabase.auth.signOut()
		if (error) return safeToastError(error)
		// Le listener gère le reset d’état ; pas de redirection forcée ici
	}, [])

	const updatePassword = useCallback(async email => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${
				process.env.NEXT_PUBLIC_API_URL || window.location.origin
			}/reset-password`,
		})
		if (error) return safeToastError(error)
		toast.success(toastMessages.passwordResetEmailSent())
		// Note: Pour personnaliser l'email de reset, configure les templates dans
		// Supabase Dashboard → Authentication → Email Templates
	}, [toastMessages])

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
				// 🛡️ VALIDATION: Bloquer si learning_language === spoken_language
				// Note: On ne montre pas de toast d'erreur car ce cas peut arriver
				// lors de la synchronisation automatique après changement de langue parlée
				const spokenLang = user
					? userProfile?.spoken_language
					: (typeof window !== 'undefined' ? localStorage.getItem('spoken_language') : null) || router?.locale

				if (learningLanguage === spokenLang) {
					// Bloquer silencieusement sans toast - le système gère automatiquement
					return
				}

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
					// Also update userProfile to keep in sync
					setUserProfile(prev => prev ? { ...prev, learning_language: lang } : prev)
					try {
						localStorage.setItem('learning_language', lang)
						// Also save to cookie for SSR
						if (typeof document !== 'undefined') {
							document.cookie = `learning_language=${lang}; path=/; max-age=31536000; SameSite=Lax`
						}
					} catch {}
				} else {
					setUserLearningLanguage(learningLanguage)
					try {
						localStorage.setItem('learning_language', learningLanguage)
						// Also save to cookie for SSR
						if (typeof document !== 'undefined') {
							document.cookie = `learning_language=${learningLanguage}; path=/; max-age=31536000; SameSite=Lax`
						}
					} catch {}
				}
			} catch (err) {
				safeToastError(err, toastMessages.languageUpdateError())
			}
		},
		[user, userProfile?.spoken_language, router?.locale]
	)

	const changeSpokenLanguage = useCallback(
		async spokenLanguage => {
			try {
				// 1. Calculer la nouvelle learning_language AVANT de changer spoken_language
				// Règles métier :
				// - FR parle → apprend RU (toujours)
				// - RU parle → apprend FR (toujours)
				// - EN parle → apprend FR par défaut (peut changer manuellement)
				let newLearningLang = null
				if (spokenLanguage === 'fr') {
					newLearningLang = 'ru'
				} else if (spokenLanguage === 'ru') {
					newLearningLang = 'fr'
				} else if (spokenLanguage === 'en') {
					// Anglophone : FR par défaut si pas défini ou si apprend sa propre langue
					if (!userLearningLanguage || userLearningLanguage === 'en') {
						newLearningLang = 'fr'
					}
					// Sinon on garde la langue actuelle (fr ou ru)
				}

				// 2. Mettre à jour spoken_language ET learning_language en une seule requête
				if (user) {
					const updateData = { spoken_language: spokenLanguage }
					if (newLearningLang) {
						updateData.learning_language = newLearningLang
					}

					const { data, error } = await supabase
						.from('users_profile')
						.update(updateData)
						.eq('id', user.id)
						.select()
					if (error) throw error

					// 3. Rafraîchir le profil local
					const updated = Array.isArray(data) ? data[0] : data
					if (updated) {
						setUserProfile(prev => ({ ...prev, ...updated }))

						if (newLearningLang) {
							setUserLearningLanguage(newLearningLang)
							try {
								localStorage.setItem('learning_language', newLearningLang)
								if (typeof document !== 'undefined') {
									document.cookie = `learning_language=${newLearningLang}; path=/; max-age=31536000; SameSite=Lax`
								}
							} catch {}
						}
					}
				} else {
					// Invité
					try {
						localStorage.setItem('spoken_language', spokenLanguage)
						if (newLearningLang) {
							setUserLearningLanguage(newLearningLang)
							localStorage.setItem('learning_language', newLearningLang)
							if (typeof document !== 'undefined') {
								document.cookie = `learning_language=${newLearningLang}; path=/; max-age=31536000; SameSite=Lax`
							}
						}
					} catch {}
				}
			} catch (err) {
				safeToastError(err, toastMessages.languageUpdateError())
			}
		},
		[user, userLearningLanguage, toastMessages]
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
					// Merge avec le profil existant pour garder les données XP et auth
				setUserProfile(prev => ({
					...prev,
					...updated
				}))

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
	// Fonction pour rafraîchir le profil utilisateur (utile après gain d'XP)
	// --------------------------------------------------------
	const refreshUserProfile = useCallback(async () => {
		if (!user) return null

		try {
			const profile = await fetchUserProfile(user.id)
			if (profile) {
				setUserProfile({ ...user, ...profile })
				return profile
			}
		} catch (err) {
			logger.error('Error refreshing user profile:', err)
		}
		return null
	}, [user, fetchUserProfile])

	// --------------------------------------------------------
	// Hook pour obtenir la langue parlée réelle (source de vérité unique)
	// --------------------------------------------------------
	const getSpokenLanguage = useCallback(() => {
		// PRIORITÉ 1: DB (pour utilisateurs connectés)
		if (userProfile?.spoken_language) {
			return userProfile.spoken_language
		}
		// PRIORITÉ 2: localStorage
		if (typeof window !== 'undefined') {
			const storedSpokenLang = localStorage.getItem('spoken_language')
			if (storedSpokenLang) return storedSpokenLang
		}
		// PRIORITÉ 3: locale de l'URL (fallback)
		return router?.locale || 'fr'
	}, [userProfile?.spoken_language, router?.locale])

	const userSpokenLanguage = useMemo(() => getSpokenLanguage(), [getSpokenLanguage])

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
			userSpokenLanguage,
			isEmailVerified: isEmailVerified(userProfile, user),

			register,
			login,
			loginWithThirdPartyOAuth,
			sendMagicLink,
			logout,
			updatePassword,
			setNewPassword,
			changeLearningLanguage,
			changeSpokenLanguage,
			updateUserProfile,
			refreshUserProfile,
		}),
		[
			user,
			userProfile,
			isUserAdmin,
			isUserPremium,
			isBootstrapping,
			userLearningLanguage,
			userSpokenLanguage,
			register,
			login,
			loginWithThirdPartyOAuth,
			sendMagicLink,
			logout,
			updatePassword,
			setNewPassword,
			changeLearningLanguage,
			changeSpokenLanguage,
			updateUserProfile,
			refreshUserProfile,
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
