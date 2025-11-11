import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import toast from '@/utils/toast'
import {
	Box,
	Button,
	Typography,
	TextField,
	Card,
	Container,
	InputAdornment,
	CircularProgress,
	LinearProgress,
} from '@mui/material'
import {
	HomeRounded,
	EmailRounded,
	LockRounded,
	CheckCircleRounded,
	CancelRounded,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const initialState = {
	email: '',
	password: '',
	confirmPassword: '',
}

const UpdatePassword = () => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const [values, setValues] = useState(initialState)
	const [isResetting, setIsResetting] = useState(false)
	const [loading, setLoading] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const { updatePassword, setNewPassword } = useUserContext()

	// Liste de mots de passe communs à bloquer
	const commonPasswords = useMemo(() => [
		'password', 'password123', '123456', '12345678', '123456789',
		'qwerty', 'azerty', 'admin', 'letmein', 'welcome', 'monkey',
		'dragon', 'master', 'sunshine', 'princess', 'football',
		'iloveyou', 'trustno1', 'abc123', '111111', '1234567890'
	], [])

	// Validation du mot de passe (approche moderne NIST)
	const passwordValidation = useMemo(() => {
		const { password, email } = values
		const lowerPassword = password.toLowerCase()
		const emailLocal = email.split('@')[0].toLowerCase()

		return {
			minLength: password.length >= 12,
			maxLength: password.length <= 128,
			notCommon: !commonPasswords.includes(lowerPassword),
			notPersonal: !(emailLocal && lowerPassword.includes(emailLocal)),
		}
	}, [values.password, values.email, commonPasswords])

	const passwordStrength = useMemo(() => {
		const { password } = values
		if (password.length === 0) return 0

		let score = 0
		score += Math.min(password.length * 2, 40)
		if (/[a-z]/.test(password)) score += 15
		if (/[A-Z]/.test(password)) score += 15
		if (/[0-9]/.test(password)) score += 15
		if (/[^a-zA-Z0-9]/.test(password)) score += 15

		return Math.min(score, 100)
	}, [values.password])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	// Détecter si on arrive depuis l'email avec un token
	useEffect(() => {
		const checkSession = async () => {
			try {
				// Vérifier si l'utilisateur a une session de récupération
				const { data: { session }, error } = await supabase.auth.getSession()

				if (error) throw error

				// Si une session existe, c'est qu'on vient de cliquer sur le lien de reset
				if (session?.user) {
					setIsResetting(true)
				}
			} catch (error) {
				console.error('Error checking session:', error)
			} finally {
				setLoading(false)
			}
		}

		checkSession()
	}, [])

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (isResetting) {
			// Cas 2 : Définir le nouveau mot de passe
			const { password, confirmPassword } = values

			if (!password || !confirmPassword) {
				return toast.error(t('fillAllFields'))
			}

			if (password !== confirmPassword) {
				return toast.error(t('passwordsDoNotMatch'))
			}

			if (!isPasswordValid) {
				return toast.error(t('passwordRequirements'))
			}

			return setNewPassword(password)
		} else {
			// Cas 1 : Demander le lien de reset
			const { email } = values

			if (!email) {
				return toast.error(t('fillAllFields'))
			}

			return updatePassword(email)
		}
	}

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<CircularProgress sx={{ color: 'white' }} size={60} />
			</Box>
		)
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
						{isResetting ? t('setNewPassword') : t('updatePasswordTitle')}
					</Typography>

					<Typography
						variant='body2'
						align='center'
						sx={{
							color: '#718096',
							mb: 4,
						}}>
						{isResetting ? t('enterNewPassword') : t('updatePasswordSubtitle')}
					</Typography>

					{/* Formulaire */}
					<Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
						{isResetting ? (
							<>
								{/* Nouveau mot de passe */}
								<Box>
									<TextField
										fullWidth
										onChange={handleChange}
										type={showPassword ? 'text' : 'password'}
										label={t('newPassword')}
										name='password'
										value={values.password}
										autoComplete='new-password'
										id='password'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<LockRounded sx={{ color: '#718096' }} />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position='end'>
													<Button
														onClick={() => setShowPassword(!showPassword)}
														sx={{
															minWidth: 'auto',
															p: 0.5,
															color: '#718096',
															'&:hover': {
																bgcolor: 'transparent',
																color: '#667eea',
															},
														}}>
														{showPassword ? (
															<VisibilityOff sx={{ fontSize: '1.25rem' }} />
														) : (
															<Visibility sx={{ fontSize: '1.25rem' }} />
														)}
													</Button>
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

									{/* Indicateur de force du mot de passe */}
									{values.password && (
										<Box sx={{ mt: 2 }}>
											<LinearProgress
												variant='determinate'
												value={passwordStrength}
												sx={{
													height: 6,
													borderRadius: 3,
													backgroundColor: '#E5E7EB',
													'& .MuiLinearProgress-bar': {
														borderRadius: 3,
														background:
															passwordStrength < 50
																? 'linear-gradient(90deg, #EF4444, #F87171)'
																: passwordStrength < 75
																? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
																: 'linear-gradient(90deg, #10B981, #34D399)',
													},
												}}
											/>
											<Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
												{[
													{ key: 'minLength', label: t('passwordMinLength12') },
													{ key: 'maxLength', label: t('passwordMaxLength') },
													{ key: 'notCommon', label: t('passwordNotCommon') },
													{ key: 'notPersonal', label: t('passwordNotPersonal') },
												].map(({ key, label }) => (
													<Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														{passwordValidation[key] ? (
															<CheckCircleRounded sx={{ fontSize: '1.1rem', color: '#10B981' }} />
														) : (
															<CancelRounded sx={{ fontSize: '1.1rem', color: '#EF4444' }} />
														)}
														<Typography variant='body2' sx={{ fontSize: '0.8125rem', color: '#64748B' }}>
															{label}
														</Typography>
													</Box>
												))}
											</Box>
										</Box>
									)}
								</Box>

								{/* Confirmation mot de passe */}
								<TextField
									fullWidth
									onChange={handleChange}
									type={showConfirmPassword ? 'text' : 'password'}
									label={t('confirmPassword')}
									name='confirmPassword'
									value={values.confirmPassword}
									autoComplete='new-password'
									id='confirmPassword'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<LockRounded sx={{ color: '#718096' }} />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position='end'>
												<Button
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													sx={{
														minWidth: 'auto',
														p: 0.5,
														color: '#718096',
														'&:hover': {
															bgcolor: 'transparent',
															color: '#667eea',
														},
													}}>
													{showConfirmPassword ? (
														<VisibilityOff sx={{ fontSize: '1.25rem' }} />
													) : (
														<Visibility sx={{ fontSize: '1.25rem' }} />
													)}
												</Button>
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
							</>
						) : (
							<TextField
								fullWidth
								onChange={handleChange}
								type='email'
								label={t('email')}
								name='email'
								value={values.email}
								autoComplete='email'
								id='email'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<EmailRounded sx={{ color: '#718096' }} />
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
						)}

						<Button
							fullWidth
							type='submit'
							variant='contained'
							size='large'
							sx={{
								py: 1.75,
								borderRadius: 2,
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
							{isResetting ? t('updatePassword') : t('sendRequest')}
						</Button>

						<Link href='/login' style={{ textDecoration: 'none' }}>
							<Button
								sx={{
									color: '#667eea',
									fontWeight: 600,
									textTransform: 'none',
									fontSize: '0.9375rem',
									width: '100%',
									'&:hover': {
										background: 'rgba(102, 126, 234, 0.05)',
										textDecoration: 'underline',
									},
								}}>
								{t('backToSignin')}
							</Button>
						</Link>
					</Box>
				</Card>
			</Container>
		</Box>
	)
}

export default UpdatePassword
