import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Page de callback OAuth et de confirmation d'email
 * Cette page gère les redirections après :
 * - Confirmation d'email
 * - Connexion OAuth (Google, VK ID)
 * - Magic Link
 * - Reset de mot de passe
 */
const AuthCallback = () => {
	const router = useRouter()
	const [statusMessage, setStatusMessage] = useState('Vérification de votre compte...')

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
					setStatusMessage('Connexion en cours...')

					// Définir la session avec les tokens
					const { error: sessionError } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					})

					if (sessionError) {
						console.error('Error setting session:', sessionError)
						// Rediriger vers login en cas d'erreur
						router.replace('/login?error=session')
						return
					}

					// Vérifier si l'utilisateur a un profil
					const { data: { user } } = await supabase.auth.getUser()

					if (user) {
						// Vérifier si le profil existe
						const { data: profile } = await supabase
							.from('users_profile')
							.select('id, learning_language')
							.eq('id', user.id)
							.maybeSingle()

						// Si le profil existe déjà (cas normal)
						if (profile) {
							setStatusMessage('Redirection...')

							// Succès - rediriger vers la page d'accueil
							if (type === 'signup') {
								// Nouvel utilisateur confirmé
								router.replace('/?welcome=true')
							} else if (type === 'recovery') {
								// Reset de mot de passe
								router.replace('/update-password')
							} else {
								// Connexion OAuth ou Magic Link
								router.replace('/')
							}
						} else {
							// Profil pas encore créé (rare car trigger auto)
							// Attendre un peu et réessayer
							setStatusMessage('Finalisation de votre profil...')
							await new Promise(resolve => setTimeout(resolve, 1000))
							router.replace('/')
						}
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
				{statusMessage}
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
