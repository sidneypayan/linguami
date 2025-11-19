'use client'
import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useUserContext } from '@/context/user'
import { useLocale } from 'next-intl'
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
// Head removed - use metadata in App Router

import { useRouter } from 'next/navigation'
import { logger } from '@/utils/logger'
import { changePassword, deleteAccount } from '@/app/actions/auth'

// Import section components
import { ProfileSection } from './ProfileSection'
import { LanguagePreferencesSection } from './LanguagePreferencesSection'
import { GoalsSection } from './GoalsSection'
import { NotificationsSection } from './NotificationsSection'
import { SecuritySection } from './SecuritySection'

const SettingsClient = ({ translations }) => {
	const { userProfile, updateUserProfile, logout } = useUserContext()
	const router = useRouter()
	const theme = useTheme()

	// Fix hydration mismatch: sync theme and media query only on client
	const [isDark, setIsDark] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		setIsDark(theme.palette.mode === 'dark')
	}, [theme.palette.mode])

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 600px)')
		setIsMobile(mediaQuery.matches)

		const handler = (e) => setIsMobile(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

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

	// Password validation (modern NIST approach: 12 characters minimum)
	const passwordValidation = useMemo(() => {
		const { newPassword } = passwordData
		return {
			minLength: newPassword.length >= 12,
		}
	}, [passwordData.newPassword])

	const passwordStrength = useMemo(() => {
		const { newPassword } = passwordData
		if (newPassword.length === 0) return 0

		// Calculate strength based on length and diversity
		let score = 0

		// Length (0-40 points)
		score += Math.min(newPassword.length * 2, 40)

		// Character diversity (0-60 points)
		if (/[a-z]/.test(newPassword)) score += 15
		if (/[A-Z]/.test(newPassword)) score += 15
		if (/[0-9]/.test(newPassword)) score += 15
		if (/[^a-zA-Z0-9]/.test(newPassword)) score += 15

		return Math.min(score, 100)
	}, [passwordData.newPassword])

	const isPasswordValid = useMemo(() => {
		return passwordData.newPassword.length >= 12
	}, [passwordData.newPassword])

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
			toast.success(translations.updateSuccess)
		} catch (error) {
			logger.error('Error updating toggle:', error)
			toast.error(error.message || translations.updateError)
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

			// Clear materials filters from localStorage when language level changes
			// This ensures filters are reset with the new level on next visit
			if (field === 'languageLevel') {
				try {
					localStorage.removeItem('materials_list_filters')
					// Also clear section filters
					const storageKeys = Object.keys(localStorage)
					storageKeys.forEach(key => {
						if (key.startsWith('materials_section_')) {
							localStorage.removeItem(key)
						}
					})
				} catch (e) {
					// Ignore localStorage errors
				}
			}

			toast.success(translations.updateSuccess)
			toggleEditMode(field)
		} catch (error) {
			logger.error('Error updating profile:', error)
			toast.error(error.message || translations.updateError)
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
			toast.error(translations.fillAllFields)
			return
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error(translations.passwordMismatch)
			return
		}

		if (!isPasswordValid) {
			toast.error(translations.passwordRequirements)
			return
		}

		setLoading(true)
		try {
			// Use Server Action instead of fetch()
			const result = await changePassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			})

			if (!result.success) {
				throw new Error(result.error || translations.changePasswordError)
			}

			toast.success(translations.passwordChanged)
			setChangePasswordDialogOpen(false)
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			})
		} catch (error) {
			logger.error('Error changing password:', error)
			toast.error(error.message || translations.changePasswordError)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		setLoading(true)
		try {
			// Use Server Action instead of fetch()
			const result = await deleteAccount()

			if (!result.success) {
				throw new Error(result.error || translations.deleteAccountError)
			}

			toast.success(translations.accountDeleted)

			// Clear client-side session
			await logout()

			// Redirect to home page
			router.push('/')
		} catch (error) {
			logger.error('Error deleting account:', error)
			toast.error(error.message || translations.deleteAccountError)
		} finally {
			setLoading(false)
		}
	}

	const handleAvatarChange = async newAvatarId => {
		setLoading(true)
		try {
			await updateUserProfile({ avatar_id: newAvatarId })
			setSelectedAvatar(newAvatarId)
			toast.success(translations.avatarUpdated)
			setAvatarDialogOpen(false)
		} catch (error) {
			logger.error('Error updating avatar:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}


	return (
		<>
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
						<ProfileSection
							isDark={isDark}
							translations={translations}
							editMode={editMode}
							formData={formData}
							loading={loading}
							handleChange={handleChange}
							handleSave={handleSave}
							handleCancel={handleCancel}
							toggleEditMode={toggleEditMode}
						/>

						<LanguagePreferencesSection
							isDark={isDark}
							translations={translations}
							editMode={editMode}
							formData={formData}
							loading={loading}
							handleChange={handleChange}
							handleSave={handleSave}
							handleCancel={handleCancel}
							toggleEditMode={toggleEditMode}
						/>

						<GoalsSection
							isDark={isDark}
							translations={translations}
							formData={formData}
							setFormData={setFormData}
							loading={loading}
							setLoading={setLoading}
							updateUserProfile={updateUserProfile}
						/>

						<NotificationsSection
							isDark={isDark}
							translations={translations}
							formData={formData}
							loading={loading}
							handleToggle={handleToggle}
						/>

						<SecuritySection
							isDark={isDark}
							translations={translations}
							formData={formData}
							loading={loading}
							handleToggle={handleToggle}
							setChangePasswordDialogOpen={setChangePasswordDialogOpen}
							setDeleteAccountDialogOpen={setDeleteAccountDialogOpen}
						/>


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
													alt={translations[avatar.nameKey]}
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
						{translations.changePassword}
					</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
							<TextField
								fullWidth
								type='password'
								label={translations.currentPassword}
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
									label={translations.newPassword}
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
												{ key: 'minLength', label: translations.passwordMinLength12 || 'At least 12 characters' },
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
								label={translations.confirmPassword}
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
							{translations.cancel}
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
							{translations.save}
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
						{translations.deleteAccountConfirm}
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
									{translations.deleteAccountWarning}
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
							{translations.cancel}
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
							{translations.deleteAccount}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</>
	)
}

export default React.memo(SettingsClient)
