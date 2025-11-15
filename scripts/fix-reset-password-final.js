const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'reset-password', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Replace the entire useEffect block
const oldUseEffect = `	// Détecter si on arrive depuis l'email avec un token
	useEffect(() => {
		// Attendre que le router soit prêt pour lire les query params
		if (!router.isReady) {
			console.log('⏳ Router not ready yet, waiting...')
			return
		}

		let mounted = true

		const initResetFlow = async () => {
			console.log('🔍 Router query:', router.query)

			// Vérifier les paramètres URL pour les erreurs
			const { error, error_code, code } = router.query
			if (error_code === 'otp_expired' || error === 'access_denied') {
				toast.error(t('resetLinkExpired') || 'Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.')
				setIsResetting(false)
				setLoading(false)
				return
			}

			// Si on a un code dans l'URL, attendre que Supabase l'échange automatiquement
			if (code && typeof code === 'string') {
				console.log('🔑 Code de récupération détecté dans URL')
				console.log('⏳ Attente de l\\'événement SIGNED_IN de Supabase...')
				// Ne rien faire ici - l'auth state listener détectera SIGNED_IN
				// et déclenchera PASSWORD_RECOVERY automatiquement
				return
			}

			// 1) Vérifier si une session de récupération existe déjà
			supabase.auth.getSession().then(({ data: { session } }) => {
				if (!mounted) return
				if (session?.user) {
					console.log('✅ Recovery session found')
					setIsResetting(true)
				} else {
					console.log('ℹ️ No session yet, waiting for PASSWORD_RECOVERY event')
					setIsResetting(false)
				}
				setLoading(false)
			})
		}

		initResetFlow()

		// 2) Écouter les événements d'authentification
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			console.log('🔍 Auth event:', event)

			// Détecter une connexion suite à un reset password
			if (event === 'SIGNED_IN' && router.query.code) {
				console.log('✅ SIGNED_IN détecté avec code de récupération')
				setIsResetting(true)
				setLoading(false)
			}

			// Détecter l'événement PASSWORD_RECOVERY (ancien flow)
			if (event === 'PASSWORD_RECOVERY') {
				console.log('✅ PASSWORD_RECOVERY event detected')
				setIsResetting(true)
				setLoading(false)
			}
		})

		// Cleanup
		return () => {
			mounted = false
			subscription?.unsubscribe()
		}
	}, [router.isReady, router.query, t])`

const newUseEffect = `	// Détecter si on arrive depuis l'email avec un token
	useEffect(() => {
		let mounted = true

		const initResetFlow = async () => {
			// Get URL parameters
			const error = searchParams.get('error')
			const error_code = searchParams.get('error_code')
			const code = searchParams.get('code')

			console.log('🔍 URL params:', { error, error_code, code })

			// Vérifier les paramètres URL pour les erreurs
			if (error_code === 'otp_expired' || error === 'access_denied') {
				toast.error(t('resetLinkExpired') || 'Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.')
				setIsResetting(false)
				setLoading(false)
				return
			}

			// Si on a un code dans l'URL, attendre que Supabase l'échange automatiquement
			if (code && typeof code === 'string') {
				console.log('🔑 Code de récupération détecté dans URL')
				console.log('⏳ Attente de l\\'événement SIGNED_IN de Supabase...')
				// Ne rien faire ici - l'auth state listener détectera SIGNED_IN
				// et déclenchera PASSWORD_RECOVERY automatiquement
				return
			}

			// 1) Vérifier si une session de récupération existe déjà
			supabase.auth.getSession().then(({ data: { session } }) => {
				if (!mounted) return
				if (session?.user) {
					console.log('✅ Recovery session found')
					setIsResetting(true)
				} else {
					console.log('ℹ️ No session yet, waiting for PASSWORD_RECOVERY event')
					setIsResetting(false)
				}
				setLoading(false)
			})
		}

		initResetFlow()

		// 2) Écouter les événements d'authentification
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			console.log('🔍 Auth event:', event)

			// Détecter une connexion suite à un reset password
			if (event === 'SIGNED_IN' && searchParams.get('code')) {
				console.log('✅ SIGNED_IN détecté avec code de récupération')
				setIsResetting(true)
				setLoading(false)
			}

			// Détecter l'événement PASSWORD_RECOVERY (ancien flow)
			if (event === 'PASSWORD_RECOVERY') {
				console.log('✅ PASSWORD_RECOVERY event detected')
				setIsResetting(true)
				setLoading(false)
			}
		})

		// Cleanup
		return () => {
			mounted = false
			subscription?.unsubscribe()
		}
	}, [searchParams, t])`

content = content.replace(oldUseEffect, newUseEffect)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ reset-password useEffect fixed!')
console.log('   - Removed router.isReady check')
console.log('   - Replaced router.query with searchParams.get()')
console.log('   - Updated dependency array')
