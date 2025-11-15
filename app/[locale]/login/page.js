'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useRef } from 'react'
import toast from '@/utils/toast'
import { useUserContext } from '@/context/user'
import AuthLayout from '@/components/auth/AuthLayout'
import OAuthButtons from '@/components/auth/OAuthButtons'
import MagicLinkDialog from '@/components/auth/MagicLinkDialog'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
// Head component not needed in App Router - use metadata in layout
import { Link } from '@/i18n/navigation'
import {
	Box,
	Button,
	TextField,
	Typography,
	InputAdornment,
	Divider,
	useTheme,
} from '@mui/material'
import {
	AlternateEmailRounded,
	KeyRounded,
	LoginRounded,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material'

const Login = () => {
	const t = useTranslations('register')
	const { login, loginWithThirdPartyOAuth, sendMagicLink } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [values, setValues] = useState({ email: '', password: '' })
	const [magicLinkDialogOpen, setMagicLinkDialogOpen] = useState(false)
	const [turnstileToken, setTurnstileToken] = useState(null)
	const [showPassword, setShowPassword] = useState(false)
	const turnstileRef = useRef(null)

	const handleChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		// Verify Turnstile token
		if (!turnstileToken) {
			console.error('❌ No Turnstile token found in state')
			toast.error(t('pleaseSolveCaptcha') || 'Veuillez compléter la vérification anti-bot')
			return
		}
		console.log('Token (first 20 chars):', turnstileToken.substring(0, 20) + '...')

		// Verify token with backend
		try {
			const verifyResponse = await fetch('/api/verify-turnstile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: turnstileToken }),
			})

			const verifyData = await verifyResponse.json()

			if (!verifyData.success) {
				toast.error(t('captchaVerificationFailed') || 'Échec de la vérification anti-bot')
				setTurnstileToken(null)
				turnstileRef.current?.reset()
				return
			}
		} catch (error) {
			console.error('Turnstile verification error:', error)
			toast.error(t('captchaVerificationError') || 'Erreur lors de la vérification anti-bot')
			setTurnstileToken(null)
			turnstileRef.current?.reset()
			return
		}

		// Try to login - reset turnstile on failure
		try {
			await login(values)
		} catch (error) {
			console.error('Login failed:', error)
			setTurnstileToken(null)
			turnstileRef.current?.reset()
		}
	}

	const textFieldStyles = {
		'& .MuiOutlinedInput-root': {
			borderRadius: 2.5,
			transition: 'all 0.3s ease',
			backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'transparent',
			color: isDark ? '#f1f5f9' : 'inherit',
			'& fieldset': {
				borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
				borderWidth: '2px',
			},
			'&:hover fieldset': {
				borderColor: 'rgba(102, 126, 234, 0.4)',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#667eea',
				borderWidth: 2,
			},
		},
		'& .MuiInputLabel-root': {
			color: isDark ? '#94a3b8' : '#718096',
			'&.Mui-focused': {
				color: '#667eea',
			},
		},
		'& .MuiInputBase-input::placeholder': {
			color: isDark ? '#94a3b8' : 'inherit',
			opacity: 1,
		},
	}

	return (
		<>
			<AuthLayout icon={<LoginRounded sx={{ fontSize: { xs: '2rem', sm: '2.25rem' }, color: 'white' }} />}>
				{/* Titre */}
				<Typography
					variant="h4"
					align="center"
					sx={{
						fontWeight: 800,
						mb: { xs: 3, sm: 1 },
						fontSize: { xs: '1.5rem', sm: '2.125rem' },
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
					{t('signinTitle')}
				</Typography>

				<Typography
					variant="body1"
					align="center"
					sx={{
						color: isDark ? '#94a3b8' : '#718096',
						mb: { xs: 3, sm: 4 },
				display: { xs: 'none', sm: 'block' },
						fontSize: '1rem',
					}}>
					{t('signinSubtitle')}
				</Typography>

				{/* Boutons OAuth */}
				<OAuthButtons
					onGoogleClick={() => loginWithThirdPartyOAuth('google')}
					onMagicLinkClick={() => setMagicLinkDialogOpen(true)}
				/>

				<Divider sx={{ my: { xs: 2.5, sm: 3.5 }, color: isDark ? '#94a3b8' : '#718096', fontSize: '0.9rem', fontWeight: 500 }}>
					{t('or')}
				</Divider>

				{/* Formulaire */}
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
					<TextField
						fullWidth
						onChange={handleChange}
						type="email"
						label={t('email')}
						name="email"
						value={values.email}
						autoComplete="email"
						id="email"
						required
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AlternateEmailRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
								</InputAdornment>
							),
						}}
						sx={textFieldStyles}
					/>

					<Box>
						<TextField
							fullWidth
							onChange={handleChange}
							type={showPassword ? 'text' : 'password'}
							label={t('password')}
							name="password"
							value={values.password}
							autoComplete="current-password"
							id="password"
							required
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<KeyRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<Button
											onClick={() => setShowPassword(!showPassword)}
											sx={{
												minWidth: 'auto',
												p: 1,
												color: isDark ? '#94a3b8' : '#718096',
												'&:hover': {
													bgcolor: 'rgba(102, 126, 234, 0.1)',
												},
											}}
											aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</Button>
									</InputAdornment>
								),
							}}
							sx={textFieldStyles}
						/>

						{/* Mot de passe oublié */}
						<Link href="/reset-password" style={{ textDecoration: 'none' }}>
							<Box
								component="span"
								sx={{
									display: 'block',
									mt: 1.5,
									textAlign: 'right',
									color: '#667eea',
									fontSize: '0.875rem',
									fontWeight: 600,
									transition: 'all 0.2s ease',
									'&:hover': {
										textDecoration: 'underline',
										color: '#764ba2',
									},
								}}>
								{t('forgot')}
							</Box>
						</Link>
					</Box>

					{/* Turnstile Anti-Bot Widget */}
					<TurnstileWidget
						ref={turnstileRef}
						onSuccess={(token) => {
							console.log('Token:', token?.substring(0, 20) + '...')
							setTurnstileToken(token)
						}}
						onError={(error) => {
							console.error('❌ Login page: Turnstile error or expiration:', error)
							setTurnstileToken(null)
							toast.error(t('captchaExpired') || 'Le captcha a expiré, veuillez le refaire')
						}}
						action="login"
					/>

					<Button
						fullWidth
						type="submit"
						variant="contained"
						size="large"
						sx={{
							py: { xs: 1.75, sm: 2 },
							borderRadius: 2.5,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							fontWeight: 700,
							fontSize: '1.0625rem',
							textTransform: 'none',
							boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
								transition: 'left 0.5s ease',
							},
							'&:hover': {
								background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								transform: 'translateY(-2px)',
								boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
								'&::before': {
									left: '100%',
								},
							},
							'&:active': {
								transform: 'translateY(0)',
							},
						}}>
						{t('signinBtn')}
					</Button>

					{/* Lien vers inscription */}
					<Box sx={{ textAlign: 'center', mt: { xs: 0.75, sm: 1 } }}>
						<Typography
							variant="body2"
							sx={{
								color: isDark ? '#94a3b8' : '#718096',
								fontSize: '0.9375rem',
							}}>
							{t('noAccountQuestion')}{' '}
							<Link href="/signup" style={{ textDecoration: 'none' }}>
								<Box
									component="span"
									sx={{
										color: '#667eea',
										fontWeight: 700,
										transition: 'all 0.2s ease',
										'&:hover': {
											textDecoration: 'underline',
											color: '#764ba2',
										},
									}}>
									{t('noaccount')}
								</Box>
							</Link>
						</Typography>
					</Box>
				</Box>

				<MagicLinkDialog
					open={magicLinkDialogOpen}
					onClose={() => setMagicLinkDialogOpen(false)}
					onSend={sendMagicLink}
				/>
			</AuthLayout>
		</>
	)
}

export default Login
