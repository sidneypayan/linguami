import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { useUserContext } from '../context/user'
import AuthLayout from '../components/auth/AuthLayout'
import OAuthButtons from '../components/auth/OAuthButtons'
import Head from 'next/head'
import Link from 'next/link'
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
	EmailRounded,
	LockRounded,
} from '@mui/icons-material'

const Login = () => {
	const { t } = useTranslation('register')
	const { login, loginWithThirdPartyOAuth } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [values, setValues] = useState({ email: '', password: '' })

	const handleChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		await login(values)
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
			<Head>
				<title>{`${t('signinTitle')} | Linguami`}</title>
				<meta name="description" content={t('signinSubtitle')} />
			</Head>

			<AuthLayout>
				{/* Titre */}
				<Typography
					variant="h4"
					align="center"
					sx={{
						fontWeight: 800,
						mb: 1,
						fontSize: { xs: '1.875rem', sm: '2.125rem' },
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
						mb: 4,
						fontSize: '1rem',
					}}>
					{t('signinSubtitle')}
				</Typography>

				{/* Boutons OAuth */}
				<OAuthButtons
					onGoogleClick={() => loginWithThirdPartyOAuth('google')}
					onFacebookClick={() => loginWithThirdPartyOAuth('facebook')}
				/>

				<Divider sx={{ my: 3.5, color: isDark ? '#94a3b8' : '#718096', fontSize: '0.9rem', fontWeight: 500 }}>
					{t('or')}
				</Divider>

				{/* Formulaire */}
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
									<EmailRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
								</InputAdornment>
							),
						}}
						sx={textFieldStyles}
					/>

					<Box>
						<TextField
							fullWidth
							onChange={handleChange}
							type="password"
							label={t('password')}
							name="password"
							value={values.password}
							autoComplete="current-password"
							id="password"
							required
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LockRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
									</InputAdornment>
								),
							}}
							sx={textFieldStyles}
						/>

						{/* Mot de passe oublié */}
						<Link href="/update-password" style={{ textDecoration: 'none' }}>
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

					<Button
						fullWidth
						type="submit"
						variant="contained"
						size="large"
						sx={{
							py: 2,
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
					<Box sx={{ textAlign: 'center', mt: 1 }}>
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
			</AuthLayout>
		</>
	)
}

export default Login
