import { useState, useEffect, useMemo } from 'react'
import { useUserContext } from '@/context/user'
import useTranslation from 'next-translate/useTranslation'
import toast from '@/utils/toast'
import { AVATARS, getAvatarUrl } from '@/utils/avatars'
import {
	Container,
	Box,
	Typography,
	Paper,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Divider,
	Grid,
	Avatar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	useMediaQuery,
	useTheme,
	Switch,
	FormControlLabel,
	Slider,
	LinearProgress,
} from '@mui/material'
import {
	PersonRounded,
	EmailRounded,
	LanguageRounded,
	EditRounded,
	CheckRounded,
	CloseRounded,
	SettingsRounded,
	NotificationsRounded,
	LockRounded,
	DeleteForeverRounded,
	TrackChangesRounded,
	CheckCircleRounded,
	CancelRounded,
} from '@mui/icons-material'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Settings = () => {
	const { t } = useTranslation('settings')
	const { userProfile, updateUserProfile, logout } = useUserContext()
	const router = useRouter()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		languageLevel: '',
		learningLanguage: '',
		dailyXpGoal: 100,
		emailReminders: true,
		streakReminders: true,
		newContentNotifications: true,
		showInLeaderboard: true,
	})

	const [selectedAvatar, setSelectedAvatar] = useState('avatar1')
	const [loading, setLoading] = useState(false)
	const [editMode, setEditMode] = useState({
		username: false,
		email: false,
		languageLevel: false,
		learningLanguage: false,
		dailyXpGoal: false,
	})
	const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
	const [isAvatarHovered, setIsAvatarHovered] = useState(false)
	const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
	const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})

	// Validation du mot de passe (mêmes règles que signup)
	const passwordValidation = useMemo(() => {
		const { newPassword } = passwordData
		return {
			minLength: newPassword.length >= 8,
			hasUpperCase: /[A-Z]/.test(newPassword),
			hasNumber: /[0-9]/.test(newPassword),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
		}
	}, [passwordData.newPassword])

	const passwordStrength = useMemo(() => {
		const checks = Object.values(passwordValidation)
		const passed = checks.filter(Boolean).length
		return (passed / checks.length) * 100
	}, [passwordValidation])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	// Charger les données du profil utilisateur
	useEffect(() => {
		if (userProfile) {
			setFormData({
				username: userProfile.name || '',
				email: userProfile.email || '',
				languageLevel: userProfile.language_level || '',
				learningLanguage: userProfile.learning_language || 'fr',
				dailyXpGoal: userProfile.daily_xp_goal || 100,
				emailReminders: userProfile.email_reminders ?? true,
				streakReminders: userProfile.streak_reminders ?? true,
				newContentNotifications: userProfile.new_content_notifications ?? true,
				showInLeaderboard: userProfile.show_in_leaderboard ?? true,
			})
			setSelectedAvatar(userProfile.avatar_id || 'avatar1')
		}
	}, [userProfile])

	const handleChange = field => event => {
		setFormData({
			...formData,
			[field]: event.target.value,
		})
	}

	const handleToggle = field => async event => {
		const newValue = event.target.checked
		setFormData({
			...formData,
			[field]: newValue,
		})

		// Auto-save toggles
		setLoading(true)
		try {
			const fieldMapping = {
				emailReminders: 'email_reminders',
				streakReminders: 'streak_reminders',
				newContentNotifications: 'new_content_notifications',
				showInLeaderboard: 'show_in_leaderboard',
			}

			await updateUserProfile({ [fieldMapping[field]]: newValue })
			toast.success(t('updateSuccess'))
		} catch (error) {
			console.error('Error updating toggle:', error)
			toast.error(error.message || t('updateError'))
			// Revert on error
			setFormData({
				...formData,
				[field]: !newValue,
			})
		} finally {
			setLoading(false)
		}
	}

	const toggleEditMode = field => {
		setEditMode({
			...editMode,
			[field]: !editMode[field],
		})
	}

	const handleSave = async field => {
		setLoading(true)
		try {
			const updateData = {}

			const fieldMapping = {
				username: 'name',
				email: 'email',
				languageLevel: 'language_level',
				learningLanguage: 'learning_language',
				dailyXpGoal: 'daily_xp_goal',
			}

			updateData[fieldMapping[field]] = formData[field]

			await updateUserProfile(updateData)

			toast.success(t('updateSuccess'))
			toggleEditMode(field)
		} catch (error) {
			console.error('Error updating profile:', error)
			toast.error(error.message || t('updateError'))
		} finally {
			setLoading(false)
		}
	}

	const handleCancel = field => {
		toggleEditMode(field)
		// Reset to original value
		if (userProfile) {
			const fieldMapping = {
				username: 'name',
				email: 'email',
				languageLevel: 'language_level',
				learningLanguage: 'learning_language',
				dailyXpGoal: 'daily_xp_goal',
			}
			setFormData({
				...formData,
				[field]: userProfile[fieldMapping[field]] || '',
			})
		}
	}

	const handleChangePassword = async () => {
		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			toast.error(t('fillAllFields'))
			return
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error(t('passwordMismatch'))
			return
		}

		if (!isPasswordValid) {
			toast.error(t('passwordRequirements'))
			return
		}

		setLoading(true)
		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || t('changePasswordError'))
			}

			toast.success(t('passwordChanged'))
			setChangePasswordDialogOpen(false)
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			})
		} catch (error) {
			console.error('Error changing password:', error)
			toast.error(error.message || t('changePasswordError'))
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/auth/delete-account', {
				method: 'DELETE',
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || t('deleteAccountError'))
			}

			toast.success(t('accountDeleted'))

			// Clear client-side session
			await logout()

			// Redirect to home page
			router.push('/')
		} catch (error) {
			console.error('Error deleting account:', error)
			toast.error(error.message || t('deleteAccountError'))
		} finally {
			setLoading(false)
		}
	}

	const handleAvatarChange = async newAvatarId => {
		setLoading(true)
		try {
			await updateUserProfile({ avatar_id: newAvatarId })
			setSelectedAvatar(newAvatarId)
			toast.success(t('avatarUpdated'))
			setAvatarDialogOpen(false)
		} catch (error) {
			console.error('Error updating avatar:', error)
			toast.error(error.message || t('updateError'))
		} finally {
			setLoading(false)
		}
	}

	const renderField = (field, label, icon, type = 'text', options = null) => {
		const isEditing = editMode[field]
		const value = formData[field]
		const isEmailField = field === 'email' // Email non modifiable pour raisons de sécurité

		// Déterminer les couleurs selon le type de champ - Dark Fantasy Theme
		const isLanguageField = field === 'languageLevel'
		const iconBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.2)' : 'rgba(139, 92, 246, 0.2)'
		const iconColor = isLanguageField ? '#06b6d4' : '#8b5cf6'
		const hoverBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)'

		// Traduire les valeurs affichées pour le niveau de langue
		const getDisplayValue = () => {
			if (!value) return '-'
			if (field === 'languageLevel') {
				return t(value) // Traduit beginner/intermediate/advanced
			}
			return value
		}

		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					py: 2.5,
					px: 3,
					borderBottom: `1px solid ${
						isLanguageField
							? isDark
								? 'rgba(6, 182, 212, 0.25)'
								: 'rgba(6, 182, 212, 0.15)'
							: isDark
							? 'rgba(139, 92, 246, 0.25)'
							: 'rgba(139, 92, 246, 0.15)'
					}`,
					'&:last-child': {
						borderBottom: 'none',
					},
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					position: 'relative',
					'&:hover': {
						bgcolor: isLanguageField
							? isDark
								? 'rgba(6, 182, 212, 0.15)'
								: 'rgba(6, 182, 212, 0.1)'
							: isDark
							? 'rgba(139, 92, 246, 0.15)'
							: 'rgba(139, 92, 246, 0.1)',
						'&::before': {
							opacity: 1,
						},
					},
					'&::before': {
						content: '""',
						position: 'absolute',
						left: 0,
						top: 0,
						bottom: 0,
						width: 3,
						background: isLanguageField
							? 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)'
							: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
						opacity: 0,
						transition: 'opacity 0.3s ease',
						boxShadow: isLanguageField
							? '0 0 10px rgba(6, 182, 212, 0.5)'
							: '0 0 10px rgba(139, 92, 246, 0.5)',
					},
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 44,
						height: 44,
						borderRadius: '50%',
						background: isLanguageField
							? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.25) 100%)'
							: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
						border: `2px solid ${isLanguageField ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
						color: iconColor,
						mr: 2,
						boxShadow: isLanguageField
							? '0 4px 12px rgba(6, 182, 212, 0.2)'
							: '0 4px 12px rgba(139, 92, 246, 0.2)',
						transition: 'all 0.3s ease',
						'&:hover': {
							transform: 'scale(1.1) rotate(5deg)',
							boxShadow: isLanguageField
								? '0 6px 20px rgba(6, 182, 212, 0.4)'
								: '0 6px 20px rgba(139, 92, 246, 0.4)',
						},
					}}>
					{icon}
				</Box>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						variant='body2'
						sx={{
							color: isLanguageField
								? isDark
									? '#67e8f9'
									: '#0891b2'
								: isDark
								? '#c4b5fd'
								: '#7c3aed',
							fontSize: '0.7rem',
							fontWeight: 600,
							mb: 0.5,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
						}}>
						{label}
					</Typography>

					{isEditing ? (
						options ? (
							<FormControl fullWidth size='small'>
								<Select
									value={value}
									onChange={handleChange(field)}
									sx={{
										fontSize: '0.95rem',
										color: isDark ? '#f1f5f9' : '#2d3748',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
											borderWidth: '2px',
											boxShadow: `0 0 10px ${isLanguageField ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
										},
										'& .MuiSvgIcon-root': {
											color: iconColor,
										},
									}}>
									{options.map(option => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						) : (
							<TextField
								fullWidth
								size='small'
								type={type}
								value={value}
								onChange={handleChange(field)}
								sx={{
									'& .MuiOutlinedInput-root': {
										fontSize: '0.95rem',
										color: isDark ? '#f1f5f9' : '#2d3748',
										'& fieldset': {
											borderColor: iconColor,
										},
										'&:hover fieldset': {
											borderColor: iconColor,
										},
										'&.Mui-focused fieldset': {
											borderColor: iconColor,
											borderWidth: '2px',
											boxShadow: `0 0 10px ${isLanguageField ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
										},
									},
								}}
							/>
						)
					) : (
						<>
							<Typography
								sx={{
									fontSize: '0.95rem',
									fontWeight: 600,
									color: isDark ? '#f1f5f9' : '#2d3748',
								}}>
								{getDisplayValue()}
							</Typography>
							{isEmailField && (
								<Typography
									variant='caption'
									sx={{
										color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
										fontSize: '0.7rem',
										fontStyle: 'italic',
										mt: 0.5,
									}}>
									{t('emailNotEditable')}
								</Typography>
							)}
						</>
					)}
				</Box>

				<Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
					{isEditing ? (
						<>
							<IconButton
								size='small'
								onClick={() => handleSave(field)}
								disabled={loading}
								sx={{
									color: 'white',
									background: isLanguageField
										? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
										: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
									border: `1px solid ${iconColor}`,
									boxShadow: isLanguageField
										? '0 4px 12px rgba(6, 182, 212, 0.3)'
										: '0 4px 12px rgba(139, 92, 246, 0.3)',
									'&:hover': {
										transform: 'scale(1.1)',
										boxShadow: isLanguageField
											? '0 6px 16px rgba(6, 182, 212, 0.5)'
											: '0 6px 16px rgba(139, 92, 246, 0.5)',
									},
								}}>
								<CheckRounded fontSize='small' />
							</IconButton>
							<IconButton
								size='small'
								onClick={() => handleCancel(field)}
								disabled={loading}
								sx={{
									color: 'white',
									background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
									border: '1px solid #ef4444',
									boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
									'&:hover': {
										transform: 'scale(1.1)',
										boxShadow: '0 6px 16px rgba(239, 68, 68, 0.5)',
									},
								}}>
								<CloseRounded fontSize='small' />
							</IconButton>
						</>
					) : (
						!isEmailField && (
							<IconButton
								size='small'
								onClick={() => toggleEditMode(field)}
								sx={{
									color: 'white',
									background: isLanguageField
										? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(8, 145, 178, 0.3) 100%)'
										: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
									border: `1px solid ${iconColor}`,
									boxShadow: isLanguageField
										? '0 4px 12px rgba(6, 182, 212, 0.2)'
										: '0 4px 12px rgba(139, 92, 246, 0.2)',
									'&:hover': {
										background: isLanguageField
											? 'linear-gradient(135deg, rgba(6, 182, 212, 0.5) 0%, rgba(8, 145, 178, 0.5) 100%)'
											: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(124, 58, 237, 0.5) 100%)',
										transform: 'scale(1.1) rotate(15deg)',
										boxShadow: isLanguageField
											? '0 6px 16px rgba(6, 182, 212, 0.4)'
											: '0 6px 16px rgba(139, 92, 246, 0.4)',
									},
								}}>
								<EditRounded fontSize='small' />
							</IconButton>
						)
					)}
				</Box>
			</Box>
		)
	}

	return (
		<>
			<Head>
				<title>{`${t('pageTitle')} - Linguami`}</title>
			</Head>
			<Box sx={{ bgcolor: 'background.paper', minHeight: '100vh', py: 4, pt: { xs: 12, md: 10 } }}>
				<Container maxWidth='md'>
					{/* Carte de personnage héroïque */}
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
						<Box
							sx={{
								position: 'relative',
								width: { xs: 280, sm: 320 },
								background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
								borderRadius: 4,
								p: 3,
								boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: -2,
									left: -2,
									right: -2,
									bottom: -2,
									borderRadius: 4,
									background: 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)',
									zIndex: -1,
								},
								'&::after': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									borderRadius: 4,
									background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
									pointerEvents: 'none',
								},
							}}
							onMouseEnter={() => setIsAvatarHovered(true)}
							onMouseLeave={() => setIsAvatarHovered(false)}>
							{/* Ornement décoratif haut */}
							<Box
								sx={{
									position: 'absolute',
									top: -1,
									left: '50%',
									transform: 'translateX(-50%)',
									width: 60,
									height: 8,
									background: 'linear-gradient(90deg, transparent 0%, #06b6d4 50%, transparent 100%)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										width: 12,
										height: 12,
										background: '#06b6d4',
										borderRadius: '50%',
										boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)',
									},
								}}
							/>

							{/* Nom du personnage */}
							<Box
								sx={{
									textAlign: 'center',
									mb: 2,
									pb: 2,
									borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
								}}>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										background: 'linear-gradient(145deg, #a78bfa 0%, #06b6d4 50%, #a78bfa 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
										letterSpacing: '0.05em',
										fontSize: { xs: '1.3rem', sm: '1.5rem' },
									}}>
									{userProfile?.name || 'Aventurier'}
								</Typography>
							</Box>

							{/* Portrait avec cadre */}
							<Box sx={{ position: 'relative', mb: 2 }}>
								<Box
									sx={{
										position: 'relative',
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Box
										sx={{
											position: 'relative',
											width: 160,
											height: 160,
											borderRadius: '50%',
											background: 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 100%)',
											p: 0.5,
											boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
										}}>
										<Avatar
											src={getAvatarUrl(selectedAvatar)}
											alt='User avatar'
											sx={{
												width: '100%',
												height: '100%',
												border: '4px solid #0f172a',
												boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
												transition: 'all 0.3s ease',
												cursor: 'pointer',
											}}
										/>
										<IconButton
											onClick={() => setAvatarDialogOpen(true)}
											sx={{
												position: 'absolute',
												bottom: 5,
												right: 5,
												bgcolor: '#06b6d4',
												width: 36,
												height: 36,
												boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
												opacity: isAvatarHovered ? 1 : 0,
												transition: 'all 0.3s ease',
												'&:hover': {
													bgcolor: '#0891b2',
													transform: 'scale(1.1)',
												},
											}}>
											<EditRounded sx={{ fontSize: 20, color: 'white' }} />
										</IconButton>
									</Box>
								</Box>
							</Box>

							{/* Statistiques */}
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: '1fr 1fr 1fr',
									gap: 2,
									mt: 2,
									pt: 2,
									borderTop: '1px solid rgba(139, 92, 246, 0.3)',
									alignItems: 'end',
								}}>
								{/* XP */}
								<Box sx={{ textAlign: 'center' }}>
									<Typography
										variant='caption'
										sx={{
											color: 'rgba(6, 182, 212, 0.8)',
											fontSize: '0.7rem',
											fontWeight: 600,
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
										}}>
										XP
									</Typography>
									<Typography
										variant='h5'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(145deg, #06b6d4 0%, #67e8f9 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											lineHeight: 1,
											mt: 0.5,
										}}>
										{userProfile?.xp || 0}
									</Typography>
								</Box>

								{/* Niveau */}
								<Box sx={{ textAlign: 'center' }}>
									<Typography
										variant='caption'
										sx={{
											color: 'rgba(167, 139, 250, 0.8)',
											fontSize: '0.75rem',
											fontWeight: 700,
											textTransform: 'uppercase',
											letterSpacing: '0.12em',
										}}>
										Niveau
									</Typography>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 800,
											background: 'linear-gradient(145deg, #a78bfa 0%, #c4b5fd 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											lineHeight: 1,
											mt: 0.5,
											textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
										}}>
										{userProfile?.level || 1}
									</Typography>
								</Box>

								{/* Or */}
								<Box sx={{ textAlign: 'center' }}>
									<Typography
										variant='caption'
										sx={{
											color: 'rgba(6, 182, 212, 0.8)',
											fontSize: '0.7rem',
											fontWeight: 600,
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
										}}>
										Or
									</Typography>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(145deg, #06b6d4 0%, #67e8f9 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											lineHeight: 1.2,
											mt: 0.5,
											fontSize: '1rem',
										}}>
										{userProfile?.gold || 0}
									</Typography>
								</Box>
							</Box>

							{/* Ornement décoratif bas */}
							<Box
								sx={{
									position: 'absolute',
									bottom: -1,
									left: '50%',
									transform: 'translateX(-50%)',
									width: 60,
									height: 8,
									background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										width: 12,
										height: 12,
										background: '#8b5cf6',
										borderRadius: '50%',
										boxShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
									},
								}}
							/>
						</Box>
					</Box>

					{/* Sections en grille */}
					<Grid container spacing={{ xs: 3, md: 4 }}>
						{/* Section Informations personnelles */}
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									overflow: 'hidden',
									height: '100%',
									position: 'relative',
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
									backdropFilter: 'blur(20px)',
									border: '2px solid rgba(139, 92, 246, 0.2)',
									boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
										pointerEvents: 'none',
										opacity: 0,
										transition: 'opacity 0.4s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 48px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.3) inset',
										borderColor: 'rgba(139, 92, 246, 0.4)',
										'&::before': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										px: 3,
										py: 2.5,
										background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(124, 58, 237, 0.85) 100%)',
										borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
										position: 'relative',
										'&::after': {
											content: '""',
											position: 'absolute',
											bottom: -1,
											left: '50%',
											transform: 'translateX(-50%)',
											width: '60%',
											height: 2,
											background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%)',
											boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)',
										},
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											fontSize: '1rem',
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
											textAlign: 'center',
											textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
										}}>
										{t('personalInfo')}
									</Typography>
								</Box>
								{renderField('username', t('username'), <PersonRounded fontSize='small' />)}
								{renderField('email', t('email'), <EmailRounded fontSize='small' />, 'email')}
								</Paper>
						</Grid>

						{/* Section Préférences linguistiques */}
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									overflow: 'hidden',
									height: '100%',
									position: 'relative',
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
									backdropFilter: 'blur(20px)',
									border: '2px solid rgba(6, 182, 212, 0.2)',
									boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.05) inset',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
										pointerEvents: 'none',
										opacity: 0,
										transition: 'opacity 0.4s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 48px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(6, 182, 212, 0.3) inset',
										borderColor: 'rgba(6, 182, 212, 0.4)',
										'&::before': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										px: 3,
										py: 2.5,
										background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 145, 178, 0.85) 100%)',
										borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
										position: 'relative',
										'&::after': {
											content: '""',
											position: 'absolute',
											bottom: -1,
											left: '50%',
											transform: 'translateX(-50%)',
											width: '60%',
											height: 2,
											background: 'linear-gradient(90deg, transparent 0%, #06b6d4 50%, transparent 100%)',
											boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)',
										},
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #fff 0%, #67e8f9 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											fontSize: '1rem',
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
											textAlign: 'center',
											textShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
										}}>
										{t('languagePreferences')}
									</Typography>
								</Box>
								{renderField(
									'languageLevel',
									t('languageLevel'),
									<LanguageRounded fontSize='small' />,
									'select',
									[
										{ value: 'beginner', label: t('beginner') },
										{ value: 'intermediate', label: t('intermediate') },
										{ value: 'advanced', label: t('advanced') },
									]
								)}
							</Paper>
						</Grid>

						{/* Section Objectifs & Motivation */}
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									overflow: 'hidden',
									height: '100%',
									position: 'relative',
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
									backdropFilter: 'blur(20px)',
									border: '2px solid rgba(245, 87, 108, 0.2)',
									boxShadow: '0 8px 32px rgba(245, 87, 108, 0.15), 0 0 0 1px rgba(245, 87, 108, 0.05) inset',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'radial-gradient(circle at 50% 0%, rgba(245, 87, 108, 0.08) 0%, transparent 50%)',
										pointerEvents: 'none',
										opacity: 0,
										transition: 'opacity 0.4s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 48px rgba(245, 87, 108, 0.25), 0 0 0 1px rgba(245, 87, 108, 0.3) inset',
										borderColor: 'rgba(245, 87, 108, 0.4)',
										'&::before': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										px: 3,
										py: 2.5,
										background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.85) 0%, rgba(190, 24, 93, 0.85) 100%)',
										borderBottom: '1px solid rgba(245, 87, 108, 0.3)',
										position: 'relative',
										'&::after': {
											content: '""',
											position: 'absolute',
											bottom: -1,
											left: '50%',
											transform: 'translateX(-50%)',
											width: '60%',
											height: 2,
											background: 'linear-gradient(90deg, transparent 0%, #f5576c 50%, transparent 100%)',
											boxShadow: '0 0 10px rgba(245, 87, 108, 0.6)',
										},
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #fff 0%, #fda4af 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											fontSize: '1rem',
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
											textAlign: 'center',
											textShadow: '0 0 20px rgba(245, 87, 108, 0.5)',
										}}>
										{t('goalsAndMotivation')}
									</Typography>
								</Box>
								<Box sx={{ p: 2.5 }}>
									<Typography
										variant='body2'
										sx={{
											color: isDark ? '#fda4af' : '#e11d48',
											fontSize: '0.75rem',
											fontWeight: 600,
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											mb: 2.5,
											textAlign: 'center',
										}}>
										{t('dailyXpGoal')}
									</Typography>

									{/* Goal Cards */}
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
										{[
											{ value: 50, emoji: '🌱', label: t('goalRelaxed'), time: t('goal5to10min'), color: '#10b981' },
											{ value: 100, emoji: '⭐', label: t('goalRegular'), time: t('goal15to20min'), color: '#f59e0b', recommended: true },
											{ value: 200, emoji: '🔥', label: t('goalMotivated'), time: t('goal30min'), color: '#f97316' },
											{ value: 300, emoji: '💪', label: t('goalIntensive'), time: t('goal45minPlus'), color: '#ef4444' },
											{ value: 0, emoji: '🎯', label: t('goalNone'), time: t('goalAtMyPace'), color: '#8b5cf6' },
										].map(goal => {
											const isSelected = formData.dailyXpGoal === goal.value
											return (
												<Box
													key={goal.value}
													onClick={async () => {
														setFormData({ ...formData, dailyXpGoal: goal.value })
														// Auto-save
														setLoading(true)
														try {
															await updateUserProfile({ daily_xp_goal: goal.value })
															toast.success(t('updateSuccess'))
														} catch (error) {
															console.error('Error updating goal:', error)
															toast.error(error.message || t('updateError'))
														} finally {
															setLoading(false)
														}
													}}
													sx={{
														position: 'relative',
														cursor: loading ? 'not-allowed' : 'pointer',
														p: 1.75,
														borderRadius: 2.5,
														background: isSelected
															? `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}25 100%)`
															: isDark
															? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)'
															: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.6) 100%)',
														border: isSelected ? `2.5px solid ${goal.color}` : `1.5px solid ${goal.color}40`,
														opacity: loading ? 0.6 : 1,
														transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
														boxShadow: isSelected
															? `0 4px 16px ${goal.color}40, 0 0 24px ${goal.color}20`
															: '0 2px 8px rgba(0, 0, 0, 0.1)',
														'&:hover': loading ? {} : {
															transform: 'translateX(4px)',
															boxShadow: `0 6px 24px ${goal.color}50, 0 0 32px ${goal.color}30`,
															borderColor: goal.color,
															background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}30 100%)`,
														},
														'&::before': isSelected ? {
															content: '""',
															position: 'absolute',
															left: 0,
															top: 0,
															bottom: 0,
															width: 4,
															background: `linear-gradient(180deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
															borderRadius: '2.5px 0 0 2.5px',
															boxShadow: `0 0 12px ${goal.color}80`,
														} : {},
													}}>
													{/* Recommended Badge */}
													{goal.recommended && (
														<Box
															sx={{
																position: 'absolute',
																top: -8,
																right: 8,
																bgcolor: goal.color,
																color: 'white',
																px: 1.5,
																py: 0.3,
																borderRadius: 2,
																fontSize: '0.65rem',
																fontWeight: 700,
																textTransform: 'uppercase',
																letterSpacing: '0.05em',
																boxShadow: `0 4px 12px ${goal.color}60`,
															}}>
															{t('recommended')}
														</Box>
													)}

													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
														{/* Emoji Icon */}
														<Box
															sx={{
																fontSize: '2rem',
																lineHeight: 1,
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																width: 50,
																height: 50,
																borderRadius: '50%',
																background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}30 100%)`,
																border: `2px solid ${goal.color}50`,
																flexShrink: 0,
																transition: 'transform 0.3s ease',
																transform: isSelected ? 'scale(1.1)' : 'scale(1)',
															}}>
															{goal.emoji}
														</Box>

														{/* Content */}
														<Box sx={{ flex: 1, minWidth: 0 }}>
															<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
																<Typography
																	sx={{
																		fontWeight: 700,
																		fontSize: '0.95rem',
																		color: isSelected ? goal.color : isDark ? '#f1f5f9' : '#2d3748',
																		transition: 'color 0.3s ease',
																	}}>
																	{goal.label}
																</Typography>
																{goal.value > 0 && (
																	<Typography
																		sx={{
																			fontSize: '0.75rem',
																			fontWeight: 600,
																			color: goal.color,
																			opacity: 0.8,
																		}}>
																		{goal.value} XP
																	</Typography>
																)}
															</Box>
															<Typography
																variant='caption'
																sx={{
																	color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
																	fontSize: '0.7rem',
																	display: 'block',
																}}>
																{goal.time}
															</Typography>
														</Box>

														{/* Check Icon */}
														{isSelected && (
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	width: 28,
																	height: 28,
																	borderRadius: '50%',
																	background: goal.color,
																	color: 'white',
																	boxShadow: `0 4px 12px ${goal.color}60`,
																	flexShrink: 0,
																}}>
																<CheckRounded sx={{ fontSize: 18 }} />
															</Box>
														)}
													</Box>
												</Box>
											)
										})}
									</Box>
								</Box>
							</Paper>
						</Grid>

						{/* Section Notifications */}
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									overflow: 'hidden',
									height: '100%',
									position: 'relative',
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
									backdropFilter: 'blur(20px)',
									border: '2px solid rgba(251, 146, 60, 0.2)',
									boxShadow: '0 8px 32px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05) inset',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'radial-gradient(circle at 50% 0%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)',
										pointerEvents: 'none',
										opacity: 0,
										transition: 'opacity 0.4s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 48px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.3) inset',
										borderColor: 'rgba(251, 146, 60, 0.4)',
										'&::before': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										px: 3,
										py: 2.5,
										background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.85) 0%, rgba(194, 65, 12, 0.85) 100%)',
										borderBottom: '1px solid rgba(251, 146, 60, 0.3)',
										position: 'relative',
										'&::after': {
											content: '""',
											position: 'absolute',
											bottom: -1,
											left: '50%',
											transform: 'translateX(-50%)',
											width: '60%',
											height: 2,
											background: 'linear-gradient(90deg, transparent 0%, #fb923c 50%, transparent 100%)',
											boxShadow: '0 0 10px rgba(251, 146, 60, 0.6)',
										},
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #fff 0%, #fdba74 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											fontSize: '1rem',
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
											textAlign: 'center',
											textShadow: '0 0 20px rgba(251, 146, 60, 0.5)',
										}}>
										{t('notifications')}
									</Typography>
								</Box>
								<Box sx={{ p: 3 }}>
									<FormControlLabel
										control={
											<Switch
												checked={formData.emailReminders}
												onChange={handleToggle('emailReminders')}
												disabled={loading}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#fb923c',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#fb923c',
													},
												}}
											/>
										}
										label={
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>
													{t('emailReminders')}
												</Typography>
												<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
													{t('emailRemindersDesc')}
												</Typography>
											</Box>
										}
										sx={{ mb: 2 }}
									/>
									<FormControlLabel
										control={
											<Switch
												checked={formData.streakReminders}
												onChange={handleToggle('streakReminders')}
												disabled={loading}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#fb923c',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#fb923c',
													},
												}}
											/>
										}
										label={
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>
													{t('streakReminders')}
												</Typography>
												<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
													{t('streakRemindersDesc')}
												</Typography>
											</Box>
										}
										sx={{ mb: 2 }}
									/>
									<FormControlLabel
										control={
											<Switch
												checked={formData.newContentNotifications}
												onChange={handleToggle('newContentNotifications')}
												disabled={loading}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#fb923c',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#fb923c',
													},
												}}
											/>
										}
										label={
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>
													{t('newContentNotifications')}
												</Typography>
												<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
													{t('newContentNotificationsDesc')}
												</Typography>
											</Box>
										}
									/>
								</Box>
							</Paper>
						</Grid>

						{/* Section Confidentialité & Sécurité */}
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									overflow: 'hidden',
									height: '100%',
									position: 'relative',
									background: isDark
										? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
										: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
									backdropFilter: 'blur(20px)',
									border: '2px solid rgba(239, 68, 68, 0.2)',
									boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.05) inset',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)',
										pointerEvents: 'none',
										opacity: 0,
										transition: 'opacity 0.4s ease',
									},
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: '0 12px 48px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.3) inset',
										borderColor: 'rgba(239, 68, 68, 0.4)',
										'&::before': {
											opacity: 1,
										},
									},
								}}>
								<Box
									sx={{
										px: 3,
										py: 2.5,
										background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.85) 0%, rgba(185, 28, 28, 0.85) 100%)',
										borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
										position: 'relative',
										'&::after': {
											content: '""',
											position: 'absolute',
											bottom: -1,
											left: '50%',
											transform: 'translateX(-50%)',
											width: '60%',
											height: 2,
											background: 'linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)',
											boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
										},
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #fff 0%, #fca5a5 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											fontSize: '1rem',
											textTransform: 'uppercase',
											letterSpacing: '0.1em',
											textAlign: 'center',
											textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
										}}>
										{t('privacyAndSecurity')}
									</Typography>
								</Box>
								<Box sx={{ p: 3 }}>
									<FormControlLabel
										control={
											<Switch
												checked={formData.showInLeaderboard}
												onChange={handleToggle('showInLeaderboard')}
												disabled={loading}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#10b981',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#10b981',
													},
												}}
											/>
										}
										label={
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>
													{t('showInLeaderboard')}
												</Typography>
												<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
													{t('showInLeaderboardDesc')}
												</Typography>
											</Box>
										}
										sx={{ mb: 3 }}
									/>
									<Button
										fullWidth
										variant='outlined'
										startIcon={<LockRounded />}
										onClick={() => setChangePasswordDialogOpen(true)}
										sx={{
											mb: 2,
											borderColor: '#ef4444',
											color: '#ef4444',
											'&:hover': {
												borderColor: '#dc2626',
												bgcolor: 'rgba(239, 68, 68, 0.05)',
											},
										}}>
										{t('changePassword')}
									</Button>
									<Button
										fullWidth
										variant='outlined'
										startIcon={<DeleteForeverRounded />}
										onClick={() => setDeleteAccountDialogOpen(true)}
										sx={{
											borderColor: '#dc2626',
											color: '#dc2626',
											'&:hover': {
												borderColor: '#b91c1c',
												bgcolor: 'rgba(220, 38, 38, 0.05)',
											},
										}}>
										{t('deleteAccount')}
									</Button>
								</Box>
							</Paper>
						</Grid>


					</Grid>
				</Container>

				{/* Dialog pour changer d'avatar */}
				<Dialog
					open={avatarDialogOpen}
					onClose={() => setAvatarDialogOpen(false)}
					maxWidth='md'
					fullWidth
					fullScreen={isMobile}
					PaperProps={{
						sx: {
							borderRadius: { xs: 0, sm: 4 },
							background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.4)',
							position: 'relative',
							overflow: 'hidden',
							m: { xs: 0, sm: 3 },
							'&::before': {
								content: '""',
								position: 'absolute',
								top: -2,
								left: -2,
								right: -2,
								bottom: -2,
								borderRadius: { xs: 0, sm: 4 },
								background: 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)',
								zIndex: -1,
							},
						},
					}}>
					<DialogContent
						sx={{
							p: { xs: 2, sm: 3, md: 4 },
							background: 'transparent',
							overflow: 'auto',
							position: 'relative',
							'&::-webkit-scrollbar': {
								display: 'none',
							},
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}>
						{/* Bouton de fermeture */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
							<IconButton
								onClick={() => setAvatarDialogOpen(false)}
								sx={{
									color: 'white',
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)',
									border: '2px solid rgba(139, 92, 246, 0.5)',
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
									width: { xs: 48, sm: 56 },
									height: { xs: 48, sm: 56 },
									'&:hover': {
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.5) 100%)',
										transform: 'scale(1.1) rotate(90deg)',
										boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)',
										borderColor: '#06b6d4',
									},
									transition: 'all 0.3s ease',
								}}>
								<CloseRounded sx={{ fontSize: { xs: 28, sm: 32 } }} />
							</IconButton>
						</Box>

						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
								gap: { xs: 1.5, sm: 2, md: 3 },
							}}>
							{AVATARS.map(avatar => {
								const isSelected = selectedAvatar === avatar.id
								return (
									<Box
										key={avatar.id}
										onClick={() => !loading && handleAvatarChange(avatar.id)}
										sx={{
											cursor: loading ? 'not-allowed' : 'pointer',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											gap: { xs: 1, sm: 1.5 },
											p: { xs: 1.5, sm: 2, md: 2.5 },
											borderRadius: 3,
											background: isSelected
												? 'linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
												: 'linear-gradient(145deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
											border: isSelected ? '3px solid' : '2px solid rgba(139, 92, 246, 0.3)',
											borderColor: isSelected ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
											transition: 'all 0.3s ease',
											opacity: loading ? 0.6 : 1,
											boxShadow: isSelected
												? '0 8px 24px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3)'
												: '0 4px 12px rgba(0, 0, 0, 0.3)',
											'&:hover': {
												transform: loading ? 'none' : 'translateY(-4px) scale(1.02)',
												borderColor: isSelected ? '#06b6d4' : '#8b5cf6',
												boxShadow: isSelected
													? '0 12px 32px rgba(6, 182, 212, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)'
													: '0 8px 24px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3)',
												background: isSelected
													? 'linear-gradient(145deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)'
													: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
											},
										}}>
										<Box sx={{ position: 'relative' }}>
											<Box
												sx={{
													position: 'relative',
													width: { xs: 80, sm: 90, md: 100 },
													height: { xs: 80, sm: 90, md: 100 },
													borderRadius: '50%',
													background: isSelected
														? 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 100%)'
														: 'linear-gradient(145deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.5) 100%)',
													p: 0.4,
													boxShadow: isSelected
														? '0 8px 24px rgba(139, 92, 246, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
														: '0 4px 12px rgba(139, 92, 246, 0.3)',
												}}>
												<Avatar
													src={avatar.url}
													alt={t(avatar.nameKey)}
													sx={{
														width: '100%',
														height: '100%',
														border: '3px solid #0f172a',
														boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
													}}
												/>
											</Box>
											{isSelected && (
												<Box
													sx={{
														position: 'absolute',
														top: { xs: -4, sm: -6 },
														right: { xs: -4, sm: -6 },
														width: { xs: 24, sm: 28, md: 32 },
														height: { xs: 24, sm: 28, md: 32 },
														borderRadius: '50%',
														background: 'linear-gradient(145deg, #06b6d4 0%, #0891b2 100%)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														boxShadow: '0 4px 12px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.4)',
														border: '2px solid #0f172a',
													}}>
													<CheckRounded
														sx={{
															fontSize: { xs: 16, sm: 18, md: 20 },
															color: 'white',
														}}
													/>
												</Box>
											)}
										</Box>
									</Box>
								)
							})}
						</Box>
					</DialogContent>
				</Dialog>

				{/* Dialog pour changer le mot de passe */}
				<Dialog
					open={changePasswordDialogOpen}
					onClose={() => setChangePasswordDialogOpen(false)}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: 4,
							background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.4)',
							border: '2px solid rgba(239, 68, 68, 0.3)',
						},
					}}>
					<DialogTitle sx={{ textAlign: 'center', color: '#fca5a5', fontWeight: 700 }}>
						{t('changePassword')}
					</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
							<TextField
								fullWidth
								type='password'
								label={t('currentPassword')}
								value={passwordData.currentPassword}
								onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#ef4444' },
										'&:hover fieldset': { borderColor: '#dc2626' },
										'&.Mui-focused fieldset': { borderColor: '#ef4444' },
									},
									'& .MuiInputLabel-root': { color: '#fca5a5' },
									'& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' },
								}}
							/>
							<Box>
								<TextField
									fullWidth
									type='password'
									label={t('newPassword')}
									value={passwordData.newPassword}
									onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
									sx={{
										'& .MuiOutlinedInput-root': {
											'& fieldset': { borderColor: '#ef4444' },
											'&:hover fieldset': { borderColor: '#dc2626' },
											'&.Mui-focused fieldset': { borderColor: '#ef4444' },
										},
										'& .MuiInputLabel-root': { color: '#fca5a5' },
										'& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' },
									}}
								/>

								{/* Indicateur de force du mot de passe */}
								{passwordData.newPassword && (
									<Box sx={{ mt: 2 }}>
										<LinearProgress
											variant='determinate'
											value={passwordStrength}
											sx={{
												height: 6,
												borderRadius: 3,
												backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
												{ key: 'minLength', label: t('passwordMinLength') },
												{ key: 'hasUpperCase', label: t('passwordUpperCase') },
												{ key: 'hasNumber', label: t('passwordNumber') },
												{ key: 'hasSpecialChar', label: t('passwordSpecialChar') },
											].map(({ key, label }) => (
												<Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													{passwordValidation[key] ? (
														<CheckCircleRounded sx={{ fontSize: '1.1rem', color: '#10B981' }} />
													) : (
														<CancelRounded sx={{ fontSize: '1.1rem', color: '#EF4444' }} />
													)}
													<Typography variant='body2' sx={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
														{label}
													</Typography>
												</Box>
											))}
										</Box>
									</Box>
								)}
							</Box>
							<TextField
								fullWidth
								type='password'
								label={t('confirmPassword')}
								value={passwordData.confirmPassword}
								onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#ef4444' },
										'&:hover fieldset': { borderColor: '#dc2626' },
										'&.Mui-focused fieldset': { borderColor: '#ef4444' },
									},
									'& .MuiInputLabel-root': { color: '#fca5a5' },
									'& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' },
								}}
							/>
						</Box>
					</DialogContent>
					<DialogActions sx={{ p: 3, pt: 0 }}>
						<Button
							onClick={() => setChangePasswordDialogOpen(false)}
							sx={{
								color: '#94a3b8',
								'&:hover': { bgcolor: 'rgba(148, 163, 184, 0.1)' },
							}}>
							{t('cancel')}
						</Button>
						<Button
							onClick={handleChangePassword}
							disabled={loading}
							variant='contained'
							sx={{
								bgcolor: '#ef4444',
								'&:hover': { bgcolor: '#dc2626' },
								'&:disabled': { bgcolor: 'rgba(239, 68, 68, 0.5)' },
							}}>
							{t('save')}
						</Button>
					</DialogActions>
				</Dialog>

				{/* Dialog pour supprimer le compte */}
				<Dialog
					open={deleteAccountDialogOpen}
					onClose={() => setDeleteAccountDialogOpen(false)}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: 4,
							background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(220, 38, 38, 0.4)',
							border: '2px solid rgba(220, 38, 38, 0.3)',
						},
					}}>
					<DialogTitle sx={{ textAlign: 'center', color: '#fca5a5', fontWeight: 700 }}>
						{t('deleteAccountConfirm')}
					</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									p: 2,
									borderRadius: 2,
									bgcolor: 'rgba(220, 38, 38, 0.1)',
									border: '1px solid rgba(220, 38, 38, 0.3)',
								}}>
								<DeleteForeverRounded sx={{ fontSize: 40, color: '#dc2626' }} />
								<Typography variant='body2' sx={{ color: '#fca5a5', whiteSpace: 'pre-line' }}>
									{t('deleteAccountWarning')}
								</Typography>
							</Box>
						</Box>
					</DialogContent>
					<DialogActions sx={{ p: 3, pt: 0 }}>
						<Button
							onClick={() => setDeleteAccountDialogOpen(false)}
							sx={{
								color: '#94a3b8',
								'&:hover': { bgcolor: 'rgba(148, 163, 184, 0.1)' },
							}}>
							{t('cancel')}
						</Button>
						<Button
							onClick={handleDeleteAccount}
							disabled={loading}
							variant='contained'
							startIcon={<DeleteForeverRounded />}
							sx={{
								bgcolor: '#dc2626',
								'&:hover': { bgcolor: '#b91c1c' },
								'&:disabled': { bgcolor: 'rgba(220, 38, 38, 0.5)' },
							}}>
							{t('deleteAccount')}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</>
	)
}

export default Settings
