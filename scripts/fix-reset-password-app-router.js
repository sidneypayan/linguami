const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'reset-password', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// 1. Add useSearchParams to imports
content = content.replace(
  "import { useRouter } from 'next/navigation'",
  "import { useRouter, useSearchParams } from 'next/navigation'"
)

// 2. Add searchParams hook
content = content.replace(
  /const UpdatePassword = \(\) => \{\n\tconst t = useTranslations\('register'\)\n\tconst router = useRouter\(\)/,
  `const UpdatePassword = () => {
	const t = useTranslations('register')
	const router = useRouter()
	const searchParams = useSearchParams()`
)

// 3. Remove router.isReady check and update to use searchParams
content = content.replace(
  /\/\/ Détecter si on arrive depuis l'email avec un token\n\tuseEffect\(\(\) => \{[\s\S]*?return\n\t\t\}\n[\s\S]*?\t\}, \[router\.isReady, router\.query, t\]\)/,
  `// Détecter si on arrive depuis l'email avec un token
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
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ reset-password page migrated to App Router!')
console.log('   - Added useSearchParams')
console.log('   - Removed router.isReady check')
console.log('   - Updated to use searchParams.get() instead of router.query')
