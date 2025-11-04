import useTranslation from 'next-translate/useTranslation'
import { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUserContext } from '../context/user'
import { supabase } from '../lib/supabase'
import { AVATARS } from '../utils/avatars'
import {
	Box,
	Divider,
	Stack,
	Button,
	TextField,
	Typography,
	InputAdornment,
	Card,
	Container,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	LinearProgress,
	Avatar,
} from '@mui/material'
import {
	HomeRounded,
	EmailRounded,
	LockRounded,
	PersonRounded,
	TranslateRounded,
	RecordVoiceOverRounded,
	CheckCircleRounded,
	CancelRounded,
	SignalCellular1Bar,
	SignalCellular2Bar,
	SignalCellular3Bar,
} from '@mui/icons-material'
import Link from 'next/link'

// Composants de drapeaux
const FrenchFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#ED2939"/>
		<path d="M 16 0 A 16 16 0 0 0 16 32 L 16 0" fill="#002395"/>
		<path d="M 16 0 L 16 32 A 16 16 0 0 0 16 0" fill="#ED2939"/>
		<rect x="10.67" width="10.67" height="32" fill="white"/>
	</svg>
)

const RussianFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#0039A6"/>
		<rect width="32" height="10.67" fill="white"/>
		<rect y="10.67" width="32" height="10.67" fill="#0039A6"/>
		<rect y="21.33" width="32" height="10.67" fill="#D52B1E"/>
	</svg>
)

const EnglishFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<clipPath id="circle-clip-signin">
			<circle cx="16" cy="16" r="16"/>
		</clipPath>
		<g clipPath="url(#circle-clip-signin)">
			<rect width="32" height="32" fill="#012169"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="white" strokeWidth="5.3"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="#C8102E" strokeWidth="3.2"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="white" strokeWidth="8.5"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="#C8102E" strokeWidth="5.3"/>
		</g>
	</svg>
)

const initialState = {
	email: '',
	password: '',
	username: '',
	spokenLanguage: '',
	learningLanguage: '',
	languageLevel: '',
	selectedAvatar: 'avatar1', // Avatar par défaut
}

const Signin = () => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const [values, setValues] = useState(initialState)
	const [formState, setFormState] = useState('signin')
	const [showAvatars, setShowAvatars] = useState(false)

	const { login, register, loginWithThirdPartyOAuth } = useUserContext()

	// Gérer le query param pour afficher le formulaire de signup
	useEffect(() => {
		if (router.query.mode === 'signup') {
			setFormState('signup')
		}
	}, [router.query.mode])

	// Validation du mot de passe
	const passwordValidation = useMemo(() => {
		const { password } = values
		return {
			minLength: password.length >= 8,
			hasUpperCase: /[A-Z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		}
	}, [values.password])

	const passwordStrength = useMemo(() => {
		const checks = Object.values(passwordValidation)
		const passed = checks.filter(Boolean).length
		return (passed / checks.length) * 100
	}, [passwordValidation])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	const handleChange = e => {
		const name = e.target.name
		let value = e.target.value

		// Sécurisation: nettoyer les caractères dangereux sauf pour le password
		if (name !== 'password' && name !== 'email') {
			value = value.replace(/[<>]/g, '') // Empêcher les tags HTML
		}

		setValues({ ...values, [name]: value })
	}

	const handleAvatarSelect = avatarId => {
		setValues({
			...values,
			selectedAvatar: avatarId,
		})
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

	// Filtrer les langues d'apprentissage disponibles (exclure la langue parlée)
	const availableLearningLanguages = useMemo(() => {
		const allLanguages = [
			{ value: 'english', label: t('english'), flag: EnglishFlag },
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

		if (!email || !password) {
			toast.error(t('fillAllFields'))
			return
		}

		if (formState === 'signup') {
			// Validation des champs obligatoires pour l'inscription
			if (!username || !spokenLanguage || !learningLanguage || !languageLevel) {
				toast.error(t('fillAllFields'))
				return
			}

			// Validation du pseudo
			if (username.length < 3) {
				toast.error(t('usernameMinLength'))
				return
			}

			// Validation du mot de passe
			if (!isPasswordValid) {
				toast.error(t('passwordRequirements'))
				return
			}

			// Empêcher l'apprentissage de la même langue que celle parlée
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

			// Mapper les codes de langue avant d'enregistrer
			return register({
				...values,
				spokenLanguage: mapLanguageToCode(spokenLanguage),
				learningLanguage: mapLanguageToCode(learningLanguage),
			})
		}

		return login(values)
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
				py: { xs: 0, sm: 6 },
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-10%',
					width: '60%',
					height: '60%',
					background:
						'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
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
					background:
						'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
			}}>
			<Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1, px: { xs: 0, sm: 2 }, py: { xs: 0, sm: 0 }, mb: { xs: 0, sm: 0 } }}>
				<Card
					sx={{
						p: { xs: 3, sm: 5 },
						borderRadius: { xs: 0, sm: 4 },
						boxShadow: { xs: 'none', sm: '0 24px 60px rgba(0, 0, 0, 0.3)' },
						background: 'white',
						border: { xs: 'none !important', sm: 'initial' },
						outline: 'none',
						minHeight: { xs: '100vh', sm: 'auto' },
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
						{formState === 'signin' ? t('signinTitle') : t('signupTitle')}
					</Typography>

					<Typography
						variant='body2'
						align='center'
						sx={{
							color: '#718096',
							mb: 4,
						}}>
						{formState === 'signin' ? t('signinSubtitle') : t('signupSubtitle')}
					</Typography>

					{/* Boutons OAuth */}
					<Stack direction='row' spacing={2} mb={3}>
						<Button
							variant='outlined'
							fullWidth
							onClick={() => loginWithThirdPartyOAuth('facebook')}
							sx={{
								py: 1.5,
								borderRadius: 2,
								borderColor: '#e5e7eb',
								borderWidth: 2,
								color: '#4a5568',
								textTransform: 'none',
								fontWeight: 600,
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
									background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									borderColor: '#667eea',
									borderWidth: 2,
									background: 'rgba(102, 126, 234, 0.05)',
									transform: 'translateY(-2px)',
									boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
									'&::before': {
										left: '100%',
									},
								},
							}}>
							<Image
								src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/facebook.png`}
								alt='facebook'
								width={24}
								height={24}
							/>
						</Button>
						<Button
							variant='outlined'
							fullWidth
							onClick={() => loginWithThirdPartyOAuth('google')}
							sx={{
								py: 1.5,
								borderRadius: 2,
								borderColor: '#e5e7eb',
								borderWidth: 2,
								color: '#4a5568',
								textTransform: 'none',
								fontWeight: 600,
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
									background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									borderColor: '#667eea',
									borderWidth: 2,
									background: 'rgba(102, 126, 234, 0.05)',
									transform: 'translateY(-2px)',
									boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
									'&::before': {
										left: '100%',
									},
								},
							}}>
							<Image
								src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/google.png`}
								alt='google'
								width={24}
								height={24}
							/>
						</Button>
					</Stack>

					<Divider sx={{ mb: 3, color: '#718096', fontSize: '0.875rem' }}>
						{t('or')}
					</Divider>

					{/* Formulaire */}
					<Box
						component='form'
						onSubmit={handleSubmit}
						sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
						{/* Pseudo - uniquement en mode inscription */}
						{formState === 'signup' && (
							<>
								<TextField
									fullWidth
									onChange={handleChange}
									type='text'
									label={t('username')}
									name='username'
									value={values.username}
									autoComplete='username'
									id='username'
									required
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<PersonRounded sx={{ color: '#718096' }} />
											</InputAdornment>
										),
									}}
									helperText={t('usernameHelper')}
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

								{/* Sélection d'avatar - uniquement en mode inscription */}
								<Box>
									<Typography
										variant='body2'
										sx={{
											color: '#64748B',
											mb: 1,
											fontWeight: 600,
										}}>
										{t('chooseAvatar')}
									</Typography>

									{/* Bouton pour ouvrir/fermer la sélection d'avatars */}
									<Button
										fullWidth
										onClick={() => setShowAvatars(!showAvatars)}
										sx={{
											py: 2,
											borderRadius: 2,
											border: '2px solid #e5e7eb',
											background: 'rgba(102, 126, 234, 0.02)',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											justifyContent: 'flex-start',
											textTransform: 'none',
											position: 'relative',
											overflow: 'hidden',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
												transition: 'left 0.5s ease',
											},
											'&:hover': {
												borderColor: '#667eea',
												background: 'rgba(102, 126, 234, 0.05)',
												'&::before': {
													left: '100%',
												},
											},
										}}>
										<Avatar
											src={AVATARS.find(a => a.id === values.selectedAvatar)?.url}
											alt='Avatar sélectionné'
											sx={{
												width: 50,
												height: 50,
												border: '2px solid #667eea',
												boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
											}}
										/>
										<Box sx={{ flex: 1, textAlign: 'left' }}>
											<Typography
												sx={{
													fontWeight: 600,
													color: '#2d3748',
													fontSize: '0.95rem',
												}}>
												{AVATARS.find(a => a.id === values.selectedAvatar)?.name}
											</Typography>
											<Typography
												sx={{
													fontSize: '0.8rem',
													color: '#718096',
												}}>
												{showAvatars ? t('hideAvatars') : t('clickToChangeAvatar')}
											</Typography>
										</Box>
									</Button>

									{/* Grille d'avatars - affichée uniquement si showAvatars est true */}
									{showAvatars && (
										<Box
											sx={{
												mt: 2,
												display: 'grid',
												gridTemplateColumns: 'repeat(3, 1fr)',
												gap: 2,
												p: 2,
												borderRadius: 2,
												background: 'rgba(102, 126, 234, 0.02)',
												border: '1px solid #e5e7eb',
												animation: 'fadeIn 0.3s ease',
												'@keyframes fadeIn': {
													'0%': {
														opacity: 0,
														transform: 'translateY(-10px)',
													},
													'100%': {
														opacity: 1,
														transform: 'translateY(0)',
													},
												},
											}}>
											{AVATARS.map(avatar => {
												const isSelected = values.selectedAvatar === avatar.id
												return (
													<Box
														key={avatar.id}
														onClick={() => {
															handleAvatarSelect(avatar.id)
															setShowAvatars(false)
														}}
														sx={{
															cursor: 'pointer',
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															gap: 1,
															transition: 'all 0.2s ease',
															'&:hover': {
																transform: 'scale(1.05)',
															},
														}}>
														<Box sx={{ position: 'relative' }}>
															<Avatar
																src={avatar.url}
																alt={avatar.name}
																sx={{
																	width: { xs: 70, sm: 80 },
																	height: { xs: 70, sm: 80 },
																	border: isSelected
																		? '3px solid #667eea'
																		: '2px solid transparent',
																	boxShadow: isSelected
																		? '0 0 0 3px rgba(102, 126, 234, 0.2)'
																		: 'none',
																	transition: 'all 0.2s ease',
																}}
															/>
															{isSelected && (
																<Box
																	sx={{
																		position: 'absolute',
																		top: -4,
																		right: -4,
																		width: 20,
																		height: 20,
																		borderRadius: '50%',
																		bgcolor: '#667eea',
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'center',
																		boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
															variant='caption'
															sx={{
																fontSize: '0.75rem',
																color: isSelected ? '#667eea' : '#64748B',
																fontWeight: isSelected ? 600 : 400,
																textAlign: 'center',
																transition: 'all 0.2s ease',
															}}>
															{avatar.name}
														</Typography>
													</Box>
												)
											})}
										</Box>
									)}

									<Typography
										variant='caption'
										sx={{
											color: '#94A3B8',
											textAlign: 'center',
											display: 'block',
											mt: 1,
										}}>
										{t('avatarHelper')}
									</Typography>
								</Box>
							</>
						)}

						<TextField
							fullWidth
							onChange={handleChange}
							type='email'
							label={t('email')}
							name='email'
							value={values.email}
							autoComplete='email'
							id='email'
							required
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

						<TextField
							fullWidth
							onChange={handleChange}
							type='password'
							label={t('password')}
							name='password'
							value={values.password}
							autoComplete='current-password'
							id='password'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<LockRounded sx={{ color: '#718096' }} />
									</InputAdornment>
								),
								endAdornment:
									formState === 'signin' ? (
										<InputAdornment position='end'>
											<Link
												href='/update-password'
												style={{ textDecoration: 'none' }}>
												<Button
													sx={{
														color: '#667eea',
														textDecoration: 'none',
														fontSize: '0.8125rem',
														fontWeight: 600,
														textTransform: 'none',
														minWidth: 'auto',
														'&:hover': {
															background: 'transparent',
															textDecoration: 'underline',
														},
													}}>
													{t('forgot')}
												</Button>
											</Link>
										</InputAdornment>
									) : null,
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

						{/* Password strength indicator - only in signup mode */}
						{formState === 'signup' && values.password && (
							<Box sx={{ mt: -1, mb: 1 }}>
								<LinearProgress
									variant='determinate'
									value={passwordStrength}
									sx={{
										height: 6,
										borderRadius: 3,
										backgroundColor: '#E5E7EB',
										'& .MuiLinearProgress-bar': {
											borderRadius: 3,
											backgroundColor:
												passwordStrength < 50
													? '#EF4444'
													: passwordStrength < 75
													? '#F59E0B'
													: '#10B981',
										},
									}}
								/>
								<Box
									sx={{
										mt: 1,
										display: 'flex',
										flexDirection: 'column',
										gap: 0.5,
									}}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{passwordValidation.minLength ? (
											<CheckCircleRounded
												sx={{ fontSize: '1rem', color: '#10B981' }}
											/>
										) : (
											<CancelRounded
												sx={{ fontSize: '1rem', color: '#EF4444' }}
											/>
										)}
										<Typography
											variant='body2'
											sx={{ fontSize: '0.75rem', color: '#64748B' }}>
											{t('passwordMinLength')}
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{passwordValidation.hasUpperCase ? (
											<CheckCircleRounded
												sx={{ fontSize: '1rem', color: '#10B981' }}
											/>
										) : (
											<CancelRounded
												sx={{ fontSize: '1rem', color: '#EF4444' }}
											/>
										)}
										<Typography
											variant='body2'
											sx={{ fontSize: '0.75rem', color: '#64748B' }}>
											{t('passwordUpperCase')}
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{passwordValidation.hasNumber ? (
											<CheckCircleRounded
												sx={{ fontSize: '1rem', color: '#10B981' }}
											/>
										) : (
											<CancelRounded
												sx={{ fontSize: '1rem', color: '#EF4444' }}
											/>
										)}
										<Typography
											variant='body2'
											sx={{ fontSize: '0.75rem', color: '#64748B' }}>
											{t('passwordNumber')}
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{passwordValidation.hasSpecialChar ? (
											<CheckCircleRounded
												sx={{ fontSize: '1rem', color: '#10B981' }}
											/>
										) : (
											<CancelRounded
												sx={{ fontSize: '1rem', color: '#EF4444' }}
											/>
										)}
										<Typography
											variant='body2'
											sx={{ fontSize: '0.75rem', color: '#64748B' }}>
											{t('passwordSpecialChar')}
										</Typography>
									</Box>
								</Box>
							</Box>
						)}

						{/* Language selection fields - only in signup mode */}
						{formState === 'signup' && (
							<>
								<FormControl
									fullWidth
									required
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
									}}>
									<InputLabel id='spoken-language-label'>
										{t('spokenLanguage')}
									</InputLabel>
									<Select
										labelId='spoken-language-label'
										id='spokenLanguage'
										name='spokenLanguage'
										value={values.spokenLanguage}
										label={t('spokenLanguage')}
										onChange={handleChange}
										startAdornment={
											<InputAdornment position='start'>
												<RecordVoiceOverRounded sx={{ color: '#718096', ml: 1 }} />
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
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													{flags[selected]}
													<Typography>{names[selected]}</Typography>
												</Box>
											)
										}}
										MenuProps={{
											PaperProps: {
												sx: {
													borderRadius: 2,
													mt: 1,
													boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
													'& .MuiMenuItem-root': {
														borderRadius: 1,
														mx: 1,
														my: 0.5,
														'&:hover': {
															bgcolor: 'rgba(102, 126, 234, 0.08)',
														},
														'&.Mui-selected': {
															bgcolor: 'rgba(102, 126, 234, 0.12)',
															'&:hover': {
																bgcolor: 'rgba(102, 126, 234, 0.16)',
															},
														},
													},
												},
											},
										}}>
										<MenuItem value='english'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<EnglishFlag size={24} />
												</Box>
												<Typography sx={{ fontWeight: 500 }}>{t('english')}</Typography>
											</Box>
										</MenuItem>
										<MenuItem value='french'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<FrenchFlag size={24} />
												</Box>
												<Typography sx={{ fontWeight: 500 }}>{t('french')}</Typography>
											</Box>
										</MenuItem>
										<MenuItem value='russian'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<RussianFlag size={24} />
												</Box>
												<Typography sx={{ fontWeight: 500 }}>{t('russian')}</Typography>
											</Box>
										</MenuItem>
									</Select>
								</FormControl>

								<FormControl
									fullWidth
									required
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
									}}>
									<InputLabel id='learning-language-label'>
										{t('learningLanguage')}
									</InputLabel>
									<Select
										labelId='learning-language-label'
										id='learningLanguage'
										name='learningLanguage'
										value={values.learningLanguage}
										label={t('learningLanguage')}
										onChange={handleChange}
										disabled={!values.spokenLanguage}
										startAdornment={
											<InputAdornment position='start'>
												<TranslateRounded sx={{ color: '#718096', ml: 1 }} />
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
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													{flags[selected]}
													<Typography>{names[selected]}</Typography>
												</Box>
											)
										}}
										MenuProps={{
											PaperProps: {
												sx: {
													borderRadius: 2,
													mt: 1,
													boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
													'& .MuiMenuItem-root': {
														borderRadius: 1,
														mx: 1,
														my: 0.5,
														'&:hover': {
															bgcolor: 'rgba(102, 126, 234, 0.08)',
														},
														'&.Mui-selected': {
															bgcolor: 'rgba(102, 126, 234, 0.12)',
															'&:hover': {
																bgcolor: 'rgba(102, 126, 234, 0.16)',
															},
														},
													},
												},
											},
										}}>
										{availableLearningLanguages.map(language => {
											const FlagComponent = language.flag
											return (
												<MenuItem key={language.value} value={language.value}>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
														<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
															<FlagComponent size={24} />
														</Box>
														<Typography sx={{ fontWeight: 500 }}>{language.label}</Typography>
													</Box>
												</MenuItem>
											)
										})}
									</Select>
								</FormControl>

								<FormControl
									fullWidth
									required
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
									}}>
									<InputLabel id='language-level-label'>
										{t('languageLevel')}
									</InputLabel>
									<Select
										labelId='language-level-label'
										id='languageLevel'
										name='languageLevel'
										value={values.languageLevel}
										label={t('languageLevel')}
										onChange={handleChange}
										renderValue={(selected) => {
											const levels = {
												beginner: { icon: <SignalCellular1Bar sx={{ color: '#10b981' }} />, name: t('beginner') },
												intermediate: { icon: <SignalCellular2Bar sx={{ color: '#f59e0b' }} />, name: t('intermediate') },
												advanced: { icon: <SignalCellular3Bar sx={{ color: '#ef4444' }} />, name: t('advanced') },
											}
											return (
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													{levels[selected]?.icon}
													<Typography>{levels[selected]?.name}</Typography>
												</Box>
											)
										}}
										MenuProps={{
											PaperProps: {
												sx: {
													borderRadius: 2,
													mt: 1,
													boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
													'& .MuiMenuItem-root': {
														borderRadius: 1,
														mx: 1,
														my: 0.5,
														'&:hover': {
															bgcolor: 'rgba(102, 126, 234, 0.08)',
														},
														'&.Mui-selected': {
															bgcolor: 'rgba(102, 126, 234, 0.12)',
															'&:hover': {
																bgcolor: 'rgba(102, 126, 234, 0.16)',
															},
														},
													},
												},
											},
										}}>
										<MenuItem value='beginner'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<SignalCellular1Bar sx={{ color: '#10b981' }} />
												<Typography sx={{ fontWeight: 500 }}>{t('beginner')}</Typography>
											</Box>
										</MenuItem>
										<MenuItem value='intermediate'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<SignalCellular2Bar sx={{ color: '#f59e0b' }} />
												<Typography sx={{ fontWeight: 500 }}>{t('intermediate')}</Typography>
											</Box>
										</MenuItem>
										<MenuItem value='advanced'>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<SignalCellular3Bar sx={{ color: '#ef4444' }} />
												<Typography sx={{ fontWeight: 500 }}>{t('advanced')}</Typography>
											</Box>
										</MenuItem>
									</Select>
								</FormControl>
							</>
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
									background:
										'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
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
							{formState === 'signin' ? t('signinBtn') : t('noaccount')}
						</Button>

						<Button
							onClick={() =>
								setFormState(formState === 'signin' ? 'signup' : 'signin')
							}
							sx={{
								color: '#667eea',
								fontWeight: 600,
								textTransform: 'none',
								fontSize: '0.9375rem',
								'&:hover': {
									background: 'rgba(102, 126, 234, 0.05)',
									textDecoration: 'underline',
								},
							}}>
							{formState === 'signin' ? t('noaccount') : t('haveaccount')}
						</Button>
					</Box>
				</Card>
			</Container>
		</Box>
	)
}

export default Signin
