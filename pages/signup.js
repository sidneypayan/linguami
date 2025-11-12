import useTranslation from 'next-translate/useTranslation'
import { useState, useMemo, useEffect } from 'react'
import toast from '@/utils/toast'
import { useUserContext } from '@/context/user'
import { supabase } from '@/lib/supabase'
import { AVATARS } from '@/utils/avatars'
import AuthLayout from '@/components/auth/AuthLayout'
import OAuthButtons from '@/components/auth/OAuthButtons'
import MagicLinkDialog from '@/components/auth/MagicLinkDialog'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import { FrenchFlag, RussianFlag, EnglishFlag } from '@/components/auth/FlagIcons'
import Head from 'next/head'
import Link from 'next/link'
import {
	Box,
	Button,
	TextField,
	Typography,
	InputAdornment,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	LinearProgress,
	Avatar,
	Collapse,
	useTheme,
} from '@mui/material'
import {
	AlternateEmailRounded,
	KeyRounded,
	BadgeRounded,
	SchoolRounded,
	RecordVoiceOverRounded,
	CheckCircleRounded,
	CancelRounded,
	SignalCellular1Bar,
	SignalCellular2Bar,
	SignalCellular3Bar,
	KeyboardArrowDownRounded,
	KeyboardArrowUpRounded,
	HowToRegRounded,
	Visibility,
	VisibilityOff,
	TrendingUpRounded,
} from '@mui/icons-material'

const initialState = {
	email: '',
	password: '',
	username: '',
	spokenLanguage: '',
	learningLanguage: '',
	languageLevel: '',
	selectedAvatar: 'avatar1',
}

const Signup = () => {
	const { t } = useTranslation('register')
	const { register, loginWithThirdPartyOAuth, sendMagicLink } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [values, setValues] = useState(initialState)
	const [showAvatars, setShowAvatars] = useState(false)
	const [magicLinkDialogOpen, setMagicLinkDialogOpen] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [turnstileToken, setTurnstileToken] = useState(null)

	// Liste de mots de passe communs à bloquer
	const commonPasswords = useMemo(() => [
		'password', 'password123', '123456', '12345678', '123456789',
		'qwerty', 'azerty', 'admin', 'letmein', 'welcome', 'monkey',
		'dragon', 'master', 'sunshine', 'princess', 'football',
		'iloveyou', 'trustno1', 'abc123', '111111', '1234567890'
	], [])

	// Validation du mot de passe (approche moderne NIST)
	const passwordValidation = useMemo(() => {
		const { password, username, email } = values
		const lowerPassword = password.toLowerCase()
		const lowerUsername = username.toLowerCase()
		const emailLocal = email.split('@')[0].toLowerCase()

		return {
			minLength: password.length >= 12,
			maxLength: password.length <= 128,
			notCommon: !commonPasswords.includes(lowerPassword),
			notPersonal: !(
				(lowerUsername && lowerPassword.includes(lowerUsername)) ||
				(emailLocal && lowerPassword.includes(emailLocal))
			),
		}
	}, [values.password, values.username, values.email, commonPasswords])

	const passwordStrength = useMemo(() => {
		const { password } = values
		if (password.length === 0) return 0

		// Calcul de la force basé sur la longueur et la diversité
		let score = 0

		// Longueur (0-40 points)
		score += Math.min(password.length * 2, 40)

		// Diversité de caractères (0-60 points)
		if (/[a-z]/.test(password)) score += 15
		if (/[A-Z]/.test(password)) score += 15
		if (/[0-9]/.test(password)) score += 15
		if (/[^a-zA-Z0-9]/.test(password)) score += 15

		return Math.min(score, 100)
	}, [values.password])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	const handleChange = e => {
		const name = e.target.name
		let value = e.target.value

		// Sécurisation: nettoyer les caractères dangereux sauf pour le password
		if (name !== 'password' && name !== 'email') {
			value = value.replace(/[<>]/g, '')
		}

		setValues({ ...values, [name]: value })
	}

	const handleAvatarSelect = avatarId => {
		setValues({ ...values, selectedAvatar: avatarId })
		setShowAvatars(false)
	}

	// Mapper les noms de langues vers les codes de langue pour la base de données
	const mapLanguageToCode = languageName => {
		const languageMap = {
			english: 'en',
			french: 'fr',
			russian: 'ru',
		}
		return languageMap[languageName] || languageName
	}

	// Filtrer les langues d'apprentissage disponibles (anglais suspendu temporairement)
	const availableLearningLanguages = useMemo(() => {
		const allLanguages = [
			{ value: 'french', label: t('french'), flag: FrenchFlag },
			{ value: 'russian', label: t('russian'), flag: RussianFlag },
		]

		if (!values.spokenLanguage) return allLanguages

		return allLanguages.filter(lang => lang.value !== values.spokenLanguage)
	}, [values.spokenLanguage, t])

	// Réinitialiser la langue d'apprentissage si elle devient invalide
	useEffect(() => {
		if (values.learningLanguage && values.spokenLanguage === values.learningLanguage) {
			setValues(prev => ({ ...prev, learningLanguage: '' }))
		}
	}, [values.spokenLanguage, values.learningLanguage])

	const handleSubmit = async e => {
		e.preventDefault()

		const {
			email,
			password,
			username,
			spokenLanguage,
			learningLanguage,
			languageLevel,
		} = values

		// Validation
		if (!email || !password || !username || !spokenLanguage || !learningLanguage || !languageLevel) {
			toast.error(t('fillAllFields'))
			return
		}

		// Verify Turnstile token
		if (!turnstileToken) {
			toast.error(t('pleaseSolveCaptcha') || 'Veuillez compléter la vérification anti-bot')
			return
		}

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
				return
			}
		} catch (error) {
			console.error('Turnstile verification error:', error)
			toast.error(t('captchaVerificationError') || 'Erreur lors de la vérification anti-bot')
			return
		}

		if (username.length < 3) {
			toast.error(t('usernameMinLength'))
			return
		}

		if (!isPasswordValid) {
			toast.error(t('passwordRequirements'))
			return
		}

		if (spokenLanguage === learningLanguage) {
			toast.error(t('cannotLearnSameLanguage'))
			return
		}

		// Vérifier l'unicité du pseudo
		try {
			const { data: existingUser, error: checkError } = await supabase
				.from('users_profile')
				.select('id')
				.eq('name', username)
				.maybeSingle()

			if (checkError && checkError.code !== 'PGRST116') {
				console.error('Error checking username:', checkError)
				toast.error(t('errorCheckingUsername'))
				return
			}

			if (existingUser) {
				toast.error(t('usernameAlreadyTaken'))
				return
			}
		} catch (err) {
			console.error('Error checking username:', err)
			toast.error(t('errorCheckingUsername'))
			return
		}

		// Enregistrer
		return register({
			...values,
			spokenLanguage: mapLanguageToCode(spokenLanguage),
			learningLanguage: mapLanguageToCode(learningLanguage),
		})
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
		'& .MuiFormHelperText-root': {
			color: isDark ? '#94a3b8' : 'inherit',
		},
	}

	return (
		<>
			<Head>
				<title>{`${t('signupTitle')} | Linguami`}</title>
				<meta name="description" content={t('signupSubtitle')} />
			</Head>

			<AuthLayout icon={<HowToRegRounded sx={{ fontSize: { xs: '2rem', sm: '2.25rem' }, color: 'white' }} />}>
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
					{t('signupTitle')}
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
					{t('signupSubtitle')}
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

					{/* Pseudo */}
					<TextField
						fullWidth
						onChange={handleChange}
						type="text"
						label={t('username')}
						name="username"
						value={values.username}
						autoComplete="username"
						id="username"
						required
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<BadgeRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
								</InputAdornment>
							),
						}}
						helperText={t('usernameHelper')}
						sx={textFieldStyles}
					/>

					{/* Email */}
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

					{/* Password */}
					<Box>
						<TextField
							fullWidth
							onChange={handleChange}
							type={showPassword ? 'text' : 'password'}
							label={t('password')}
							name="password"
							value={values.password}
							autoComplete="new-password"
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

						{/* Indicateur de force du mot de passe */}
						{values.password && (
							<Box sx={{ mt: 2 }}>
								<LinearProgress
									variant="determinate"
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
											<Typography variant="body2" sx={{ fontSize: '0.8125rem', color: isDark ? '#94a3b8' : '#64748B' }}>
												{label}
											</Typography>
										</Box>
									))}
								</Box>
							</Box>
						)}
					</Box>

					{/* Langue parlée */}
					<FormControl fullWidth required sx={textFieldStyles}>
						<InputLabel id="spoken-language-label">{t('spokenLanguage')}</InputLabel>
						<Select
							labelId="spoken-language-label"
							id="spokenLanguage"
							name="spokenLanguage"
							value={values.spokenLanguage}
							label={t('spokenLanguage')}
							onChange={handleChange}
							startAdornment={
								<InputAdornment position="start">
									<RecordVoiceOverRounded sx={{ color: isDark ? '#94a3b8' : '#718096', ml: 1 }} />
								</InputAdornment>
							}
							renderValue={(selected) => {
								const flags = {
									english: <EnglishFlag size={20} />,
									french: <FrenchFlag size={20} />,
									russian: <RussianFlag size={20} />,
								}
								const names = {
									english: t('english'),
									french: t('french'),
									russian: t('russian'),
								}
								return (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										{flags[selected]}
										<Typography>{names[selected]}</Typography>
									</Box>
								)
							}}>
							{[
								{ value: 'english', label: t('english'), Flag: EnglishFlag },
								{ value: 'french', label: t('french'), Flag: FrenchFlag },
								{ value: 'russian', label: t('russian'), Flag: RussianFlag },
							].map(({ value, label, Flag }) => (
								<MenuItem key={value} value={value}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										<Flag size={24} />
										<Typography sx={{ fontWeight: 500 }}>{label}</Typography>
									</Box>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Langue d'apprentissage */}
					<FormControl fullWidth required sx={textFieldStyles} disabled={!values.spokenLanguage}>
						<InputLabel id="learning-language-label">{t('learningLanguage')}</InputLabel>
						<Select
							labelId="learning-language-label"
							id="learningLanguage"
							name="learningLanguage"
							value={values.learningLanguage}
							label={t('learningLanguage')}
							onChange={handleChange}
							startAdornment={
								<InputAdornment position="start">
									<SchoolRounded sx={{ color: isDark ? '#94a3b8' : '#718096', ml: 1 }} />
								</InputAdornment>
							}
							renderValue={(selected) => {
								const flags = {
									english: <EnglishFlag size={20} />,
									french: <FrenchFlag size={20} />,
									russian: <RussianFlag size={20} />,
								}
								const names = {
									english: t('english'),
									french: t('french'),
									russian: t('russian'),
								}
								return (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										{flags[selected]}
										<Typography>{names[selected]}</Typography>
									</Box>
								)
							}}>
							{availableLearningLanguages.map(({ value, label, flag: Flag }) => (
								<MenuItem key={value} value={value}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										<Flag size={24} />
										<Typography sx={{ fontWeight: 500 }}>{label}</Typography>
									</Box>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Niveau de langue */}
					<FormControl fullWidth required sx={textFieldStyles}>
						<InputLabel id="language-level-label">{t('languageLevel')}</InputLabel>
						<Select
							labelId="language-level-label"
							id="languageLevel"
							name="languageLevel"
							value={values.languageLevel}
							label={t('languageLevel')}
							onChange={handleChange}
							startAdornment={
								<InputAdornment position="start">
									<TrendingUpRounded sx={{ color: isDark ? '#94a3b8' : '#718096', ml: 1 }} />
								</InputAdornment>
							}
							renderValue={(selected) => {
								const levels = {
									beginner: { icon: <SignalCellular1Bar sx={{ color: '#10b981' }} />, name: t('beginner') },
									intermediate: { icon: <SignalCellular2Bar sx={{ color: '#a855f7' }} />, name: t('intermediate') },
									advanced: { icon: <SignalCellular3Bar sx={{ color: '#fbbf24' }} />, name: t('advanced') },
								}
								return (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										{levels[selected]?.icon}
										<Typography>{levels[selected]?.name}</Typography>
									</Box>
								)
							}}>
							{[
								{ value: 'beginner', icon: <SignalCellular1Bar sx={{ color: '#10b981' }} />, label: t('beginner') },
								{ value: 'intermediate', icon: <SignalCellular2Bar sx={{ color: '#a855f7' }} />, label: t('intermediate') },
								{ value: 'advanced', icon: <SignalCellular3Bar sx={{ color: '#fbbf24' }} />, label: t('advanced') },
							].map(({ value, icon, label }) => (
								<MenuItem key={value} value={value}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										{icon}
										<Typography sx={{ fontWeight: 500 }}>{label}</Typography>
									</Box>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Sélection d'avatar */}
					<Box>
						<Typography
							variant="body2"
							sx={{
								color: '#667eea',
								mb: 1.5,
								fontWeight: 600,
								fontSize: '0.9375rem',
							}}>
							{t('chooseAvatar')}
						</Typography>

						<Button
							fullWidth
							onClick={() => setShowAvatars(!showAvatars)}
							sx={{
								py: 2,
								px: 2.5,
								borderRadius: 2.5,
								border: '2px solid',
								borderColor: showAvatars ? '#667eea' : 'rgba(102, 126, 234, 0.2)',
								background: showAvatars
									? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
									: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
								transition: 'all 0.3s ease',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								textTransform: 'none',
								'&:hover': {
									borderColor: '#667eea',
									background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
								},
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Avatar
									src={AVATARS.find(a => a.id === values.selectedAvatar)?.url}
									alt={t('selectedAvatar')}
									sx={{
										width: 56,
										height: 56,
										border: '3px solid #667eea',
										boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
									}}
								/>
								<Box sx={{ textAlign: 'left' }}>
									<Typography
										sx={{
											fontWeight: 600,
											color: isDark ? '#f1f5f9' : '#2d3748',
											fontSize: '1rem',
										}}>
										{t(AVATARS.find(a => a.id === values.selectedAvatar)?.nameKey)}
									</Typography>
									<Typography
										sx={{
											fontSize: '0.8125rem',
											color: isDark ? '#94a3b8' : '#718096',
										}}>
										{showAvatars ? t('hideAvatars') : t('clickToChangeAvatar')}
									</Typography>
								</Box>
							</Box>
							{showAvatars ? (
								<KeyboardArrowUpRounded sx={{ color: '#667eea' }} />
							) : (
								<KeyboardArrowDownRounded sx={{ color: '#718096' }} />
							)}
						</Button>

						<Collapse in={showAvatars}>
							<Box
								sx={{
									mt: 2,
									display: 'grid',
									gridTemplateColumns: 'repeat(4, 1fr)',
									gap: 2,
									p: 2.5,
									borderRadius: 2.5,
									background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
									border: '2px solid rgba(102, 126, 234, 0.15)',
								}}>
								{AVATARS.map(avatar => {
									const isSelected = values.selectedAvatar === avatar.id
									return (
										<Box
											key={avatar.id}
											onClick={() => handleAvatarSelect(avatar.id)}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												gap: 1,
												transition: 'all 0.2s ease',
												'&:hover': {
													transform: 'scale(1.08)',
												},
											}}>
											<Box sx={{ position: 'relative' }}>
												<Avatar
													src={avatar.url}
													alt={avatar.name}
													sx={{
														width: { xs: 64, sm: 72 },
														height: { xs: 64, sm: 72 },
														border: isSelected
															? '3px solid #667eea'
															: '2px solid transparent',
														boxShadow: isSelected
															? '0 0 0 4px rgba(102, 126, 234, 0.2)'
															: '0 2px 8px rgba(0,0,0,0.1)',
														transition: 'all 0.2s ease',
													}}
												/>
												{isSelected && (
													<Box
														sx={{
															position: 'absolute',
															top: -6,
															right: -6,
															width: 24,
															height: 24,
															borderRadius: '50%',
															background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
														}}>
														<CheckCircleRounded
															sx={{
																fontSize: '1rem',
																color: 'white',
															}}
														/>
													</Box>
												)}
											</Box>
											<Typography
												variant="caption"
												sx={{
													fontSize: '0.75rem',
													color: isSelected ? '#667eea' : (isDark ? '#94a3b8' : '#64748B'),
													fontWeight: isSelected ? 600 : 400,
													textAlign: 'center',
												}}>
												{t(avatar.nameKey)}
											</Typography>
										</Box>
									)
								})}
							</Box>
						</Collapse>
					</Box>

					{/* Turnstile Anti-Bot Widget */}
					<TurnstileWidget
						onSuccess={(token) => setTurnstileToken(token)}
						onError={() => setTurnstileToken(null)}
						action="signup"
					/>

					{/* Bouton de soumission */}
					<Button
						fullWidth
						type="submit"
						variant="contained"
						size="large"
						sx={{
							py: { xs: 1.75, sm: 2 },
							mt: 1,
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
						{t('signupBtn')}
					</Button>

					{/* Lien vers connexion */}
					<Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 2 } }}>
						<Typography
							variant="body2"
							sx={{
								color: isDark ? '#94a3b8' : '#718096',
								fontSize: '0.9375rem',
							}}>
							{t('haveAccountQuestion')}{' '}
							<Link href="/login" style={{ textDecoration: 'none' }}>
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
									{t('haveaccount')}
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

export default Signup
