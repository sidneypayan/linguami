// /pages/set-password.js
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Typography,
	TextField,
	Card,
	Container,
	InputAdornment,
	CircularProgress,
} from '@mui/material'
import { HomeRounded, LockRounded } from '@mui/icons-material'
import { useUserContext } from '../context/user'
import { supabase } from '../lib/supabase' // ⬅️ important

const AskPassword = () => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const { setNewPassword } = useUserContext()

	const [password, setPassword] = useState('')
	// const [confirm, setConfirm] = useState('') // optionnel
	const [canUpdate, setCanUpdate] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		// 1) Vérifie qu'une session est active (elle est créée par le lien "recovery")
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!mounted) return
			setCanUpdate(!!session)
			setLoading(false)
			if (!session) {
				toast.error(t('invalidLink'))
			}
		})

		// 2) Optionnel : active le formulaire si l'event PASSWORD_RECOVERY arrive après coup
		const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
			event => {
				if (event === 'PASSWORD_RECOVERY') {
					setCanUpdate(true)
					setLoading(false)
				}
			}
		)

		return () => {
			mounted = false
			subscription?.unsubscribe?.()
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		if (!canUpdate) {
			toast.error(t('sessionRecoveryMissing'))
			return
		}
		if (!password) {
			toast.error(t('enterPassword'))
			return
		}
		if (password.length < 8) {
			toast.error(t('passwordMinLength8'))
			return
		}
		// if (password !== confirm) { toast.error('Les mots de passe ne correspondent pas'); return }

		try {
			setLoading(true)
			await setNewPassword(password) // appelle supabase.auth.updateUser({ password }) + redirect
			// setNewPassword gère déjà la redirection et le toast dans ton UserContext
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				py: { xs: 4, sm: 6 },
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: '-10%',
					left: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
			}}>
			<Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1 }}>
				<Card
					sx={{
						p: { xs: 3, sm: 5 },
						borderRadius: 4,
						boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
						background: 'white',
					}}>
					{/* Logo */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mb: 1,
						}}>
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
							}}>
							<HomeRounded sx={{ fontSize: '2rem', color: 'white' }} />
						</Box>
					</Box>

					{/* Titre */}
					<Typography
						variant='h4'
						align='center'
						sx={{
							fontWeight: 800,
							mb: 1,
							fontSize: { xs: '1.75rem', sm: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}>
						{t('updatePassword')}
					</Typography>

					<Typography
						variant='body2'
						align='center'
						sx={{
							color: '#718096',
							mb: 4,
						}}>
						{t('newPasswordSubtitle')}
					</Typography>

					{/* Formulaire */}
					<Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
						<TextField
							fullWidth
							onChange={e => setPassword(e.target.value)}
							type='password'
							placeholder='Nouveau mot de passe'
							name='password'
							value={password}
							label={t('password')}
							disabled={loading || !canUpdate}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<LockRounded sx={{ color: '#718096' }} />
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 2,
									'&:hover fieldset': {
										borderColor: '#667eea',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#667eea',
										borderWidth: 2,
									},
								},
							}}
						/>

						<Button
							fullWidth
							type='submit'
							variant='contained'
							size='large'
							disabled={loading || !canUpdate}
							sx={{
								py: 1.75,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								fontWeight: 700,
								fontSize: '1.0625rem',
								textTransform: 'none',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
								},
								'&:active': {
									transform: 'translateY(0)',
								},
								'&.Mui-disabled': {
									background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
									color: 'white',
								},
							}}>
							{loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('confirm')}
						</Button>

						{!canUpdate && !loading && (
							<Box
								sx={{
									p: 2.5,
									borderRadius: 2,
									background: 'rgba(239, 68, 68, 0.08)',
									border: '1px solid rgba(239, 68, 68, 0.2)',
								}}>
								<Typography
									variant='body2'
									sx={{
										color: '#dc2626',
										textAlign: 'center',
										lineHeight: 1.6,
									}}>
									{t('invalidLinkMessage')}
								</Typography>
							</Box>
						)}
					</Box>
				</Card>
			</Container>
		</Box>
	)
}

export default AskPassword
