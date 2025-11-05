import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Page de redirection pour la compatibilité
 * /signin → /login
 * /signin?mode=signup → /signup
 */
const SigninRedirect = () => {
	const router = useRouter()

	useEffect(() => {
		const { mode } = router.query

		if (mode === 'signup') {
			router.replace('/signup')
		} else {
			router.replace('/login')
		}
	}, [router])

	return null
}

export default SigninRedirect
