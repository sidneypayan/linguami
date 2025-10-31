import { useState, useEffect } from 'react'
import { useUserContext } from '../context/user'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import { AVATARS, getAvatarUrl } from '../utils/avatars'
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
} from '@mui/material'
import {
	PersonRounded,
	EmailRounded,
	CakeRounded,
	LanguageRounded,
	EditRounded,
	CheckRounded,
	CloseRounded,
	SettingsRounded,
} from '@mui/icons-material'
import Head from 'next/head'

const Settings = () => {
	const { t } = useTranslation('settings')
	const { userProfile, updateUserProfile } = useUserContext()

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		dateOfBirth: '',
		languageLevel: '',
	})

	const [selectedAvatar, setSelectedAvatar] = useState('avatar1')
	const [loading, setLoading] = useState(false)
	const [editMode, setEditMode] = useState({
		username: false,
		email: false,
		dateOfBirth: false,
		languageLevel: false,
	})
	const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
	const [isAvatarHovered, setIsAvatarHovered] = useState(false)

	// Charger les données du profil utilisateur
	useEffect(() => {
		if (userProfile) {
			setFormData({
				username: userProfile.name || '',
				email: userProfile.email || '',
				dateOfBirth: userProfile.date_of_birth || '',
				languageLevel: userProfile.language_level || '',
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
				dateOfBirth: 'date_of_birth',
				languageLevel: 'language_level',
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
				dateOfBirth: 'date_of_birth',
				languageLevel: 'language_level',
			}
			setFormData({
				...formData,
				[field]: userProfile[fieldMapping[field]] || '',
			})
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

		// Déterminer les couleurs selon le type de champ
		const isLanguageField = field === 'languageLevel'
		const iconBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.12)' : 'rgba(139, 92, 246, 0.12)'
		const iconColor = isLanguageField ? '#0891b2' : '#7c3aed'
		const hoverBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.05)' : 'rgba(139, 92, 246, 0.05)'

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
					borderBottom: `1px solid ${isLanguageField ? 'rgba(6, 182, 212, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
					'&:last-child': {
						borderBottom: 'none',
					},
					transition: 'all 0.2s',
					'&:hover': {
						bgcolor: isLanguageField ? 'rgba(6, 182, 212, 0.08)' : 'rgba(139, 92, 246, 0.08)',
					},
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 40,
						height: 40,
						borderRadius: '50%',
						bgcolor: iconBgColor,
						color: iconColor,
						mr: 2,
					}}>
					{icon}
				</Box>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						variant='body2'
						sx={{
							color: 'text.secondary',
							fontSize: '0.75rem',
							fontWeight: 500,
							mb: 0.5,
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
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
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: iconColor,
											borderWidth: '2px',
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
										'& fieldset': {
											borderColor: iconColor,
										},
										'&:hover fieldset': {
											borderColor: iconColor,
										},
										'&.Mui-focused fieldset': {
											borderColor: iconColor,
											borderWidth: '2px',
										},
									},
								}}
							/>
						)
					) : (
						<Typography
							sx={{
								fontSize: '0.95rem',
								fontWeight: 600,
								color: 'text.primary',
							}}>
							{getDisplayValue()}
						</Typography>
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
									color: iconColor,
									bgcolor: iconBgColor,
									'&:hover': {
										bgcolor: iconBgColor,
										opacity: 0.8,
									},
								}}>
								<CheckRounded fontSize='small' />
							</IconButton>
							<IconButton
								size='small'
								onClick={() => handleCancel(field)}
								disabled={loading}
								sx={{
									color: '#ef4444',
									bgcolor: 'rgba(239, 68, 68, 0.1)',
									'&:hover': {
										bgcolor: 'rgba(239, 68, 68, 0.15)',
									},
								}}>
								<CloseRounded fontSize='small' />
							</IconButton>
						</>
					) : (
						<IconButton
							size='small'
							onClick={() => toggleEditMode(field)}
							sx={{
								color: iconColor,
								bgcolor: iconBgColor,
								'&:hover': {
									bgcolor: iconBgColor,
									opacity: 0.8,
								},
							}}>
							<EditRounded fontSize='small' />
						</IconButton>
					)}
				</Box>
			</Box>
		)
	}

	return (
		<>
			<Head>
				<title>{t('pageTitle')} - Linguami</title>
			</Head>
			<Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4, pt: { xs: 12, md: 10 } }}>
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
					<Grid container spacing={3}>
						{/* Section Informations personnelles */}
						<Grid item xs={12} md={6}>
							<Paper
								sx={{
									borderRadius: 3,
									boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
									overflow: 'hidden',
									height: '100%',
									background: '#ffffff',
								}}>
								<Box
									sx={{
										px: 3,
										py: 2,
										background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
										borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											color: 'white',
											fontSize: '0.95rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											textAlign: 'center',
										}}>
										{t('personalInfo')}
									</Typography>
								</Box>
								{renderField('username', t('username'), <PersonRounded fontSize='small' />)}
								{renderField('email', t('email'), <EmailRounded fontSize='small' />, 'email')}
								{renderField('dateOfBirth', t('dateOfBirth'), <CakeRounded fontSize='small' />, 'date')}
							</Paper>
						</Grid>

						{/* Section Préférences linguistiques */}
						<Grid item xs={12} md={6}>
							<Paper
								sx={{
									borderRadius: 3,
									boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
									overflow: 'hidden',
									height: '100%',
									background: '#ffffff',
								}}>
								<Box
									sx={{
										px: 3,
										py: 2,
										background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
										borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
									}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 700,
											color: 'white',
											fontSize: '0.95rem',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											textAlign: 'center',
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

					</Grid>
				</Container>

				{/* Dialog pour changer d'avatar */}
				<Dialog
					open={avatarDialogOpen}
					onClose={() => setAvatarDialogOpen(false)}
					maxWidth='md'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: 4,
							background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.4)',
							position: 'relative',
							overflow: 'hidden',
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
						},
					}}>
					<DialogContent
						sx={{
							p: 4,
							background: 'transparent',
							overflow: 'hidden',
							'&::-webkit-scrollbar': {
								display: 'none',
							},
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gap: 3,
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
											gap: 1.5,
											p: 2.5,
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
													width: 100,
													height: 100,
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
													alt={avatar.name}
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
														top: -6,
														right: -6,
														width: 32,
														height: 32,
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
															fontSize: 20,
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
			</Box>
		</>
	)
}

export default Settings
