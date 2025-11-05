import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Page de callback OAuth et de confirmation d'email
 * Cette page gère les redirections après :
 * - Confirmation d'email
 * - Connexion OAuth (Google, Facebook)
 * - Reset de mot de passe
 */
const AuthCallback = () => {
	const router = useRouter()

	useEffect(() => {
		const handleCallback = async () => {
			try {
				// Récupérer les paramètres de l'URL
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				const searchParams = new URLSearchParams(window.location.search)

				// Vérifier si c'est un callback de confirmation d'email
				const type = searchParams.get('type')
				const accessToken = hashParams.get('access_token')
				const refreshToken = hashParams.get('refresh_token')

				if (accessToken && refreshToken) {
					// Définir la session avec les tokens
					const { error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					})

					if (error) {
						console.error('Error setting session:', error)
						// Rediriger vers login en cas d'erreur
						router.replace('/login?error=session')
						return
					}

					// Succès - rediriger vers la page d'accueil
					if (type === 'signup') {
						// Nouvel utilisateur confirmé
						router.replace('/?welcome=true')
					} else if (type === 'recovery') {
						// Reset de mot de passe
						router.replace('/update-password')
					} else {
						// Connexion OAuth ou autre
						router.replace('/')
					}
				} else {
					// Pas de tokens valides - rediriger vers login
					router.replace('/login')
				}
			} catch (error) {
				console.error('Error in auth callback:', error)
				router.replace('/login?error=callback')
			}
		}

		handleCallback()
	}, [router])

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			}}>
			<CircularProgress
				size={60}
				sx={{
					color: 'white',
					mb: 3,
				}}
			/>
			<Typography
				variant="h5"
				sx={{
					color: 'white',
					fontWeight: 600,
					textAlign: 'center',
					px: 3,
				}}>
				Vérification de votre compte...
			</Typography>
			<Typography
				variant="body1"
				sx={{
					color: 'rgba(255, 255, 255, 0.8)',
					mt: 1,
					textAlign: 'center',
					px: 3,
				}}>
				Vous serez redirigé dans un instant
			</Typography>
		</Box>
	)
}

export default AuthCallback
