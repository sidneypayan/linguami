import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMaterials } from '../../features/materials/materialsSlice'
import SectionCard from '../../components/SectionCard'
import MaterialsTable from '../../components/MaterialsTable'
import Head from 'next/head'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
	Box,
	Container,
	IconButton,
	TextField,
	InputAdornment,
	Stack,
	Chip,
	Tooltip,
	Typography,
} from '@mui/material'
import { ArrowBack, Search, Refresh, GridView, ViewList } from '@mui/icons-material'
import { useUserContext } from '../../context/user'

const UserMaterials = () => {
	const { t, lang } = useTranslation('materials')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user_materials, user_materials_loading } = useSelector(store => store.materials)
	const { userLearningLanguage, user, isUserLoggedIn, isBootstrapping } = useUserContext()
	const userId = user?.id

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [viewMode, setViewMode] = useState('card')

	// Filtrage des matériels
	const filteredMaterials = useMemo(() => {
		let filtered = [...user_materials]

		// Exclure les books et book-chapters (ils ne sont pas dans "my materials")
		filtered = filtered.filter(material =>
			material.section !== 'books' && material.section !== 'book-chapters'
		)

		// Filtre par recherche
		if (searchTerm) {
			filtered = filtered.filter(material =>
				material.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		// Filtre par niveau
		if (selectedLevel) {
			filtered = filtered.filter(material => material.level === selectedLevel)
		}

		// Filtre par statut
		if (selectedStatus === 'is_being_studied') {
			filtered = filtered.filter(material => material.is_being_studied)
		} else if (selectedStatus === 'is_studied') {
			filtered = filtered.filter(material => material.is_studied)
		}

		return filtered
	}, [user_materials, searchTerm, selectedLevel, selectedStatus])

	const handleSearchSubmit = e => {
		e.preventDefault()
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
	}

	const handleViewChange = view => {
		setViewMode(view)
	}

	const checkIfUserMaterialIsInMaterials = id => {
		return user_materials.find(material => material.id === id)
	}

	const levels = [
		{ label: 'A1/A2', key: 'débutant', tooltip: `🌱 ${t('beginner')} - ${t('beginnerTooltip')}`, color: '#10b981' },
		{ label: 'B1/B2', key: 'intermédiaire', tooltip: `🚀 ${t('intermediate')} - ${t('intermediateTooltip')}`, color: '#f59e0b' },
		{ label: 'C1/C2', key: 'avancé', tooltip: `⭐ ${t('advanced')} - ${t('advancedTooltip')}`, color: '#ef4444' },
	]

	const statuses = [
		{ label: t('being_studied'), key: 'is_being_studied', tooltip: `📚 ${t('being_studied')} - ${t('beingStudiedTooltip')}`, color: '#3b82f6' },
		{ label: t('studied'), key: 'is_studied', tooltip: `✨ ${t('studied')} - ${t('studiedTooltip')}`, color: '#8b5cf6' },
	]

	useEffect(() => {
		if (isBootstrapping) return

		if (!isUserLoggedIn) {
			router.push('/')
			return
		}

		if (user && user_materials.length === 0) {
			dispatch(getUserMaterials({ userId: userId, lang: userLearningLanguage }))
		}
	}, [
		dispatch,
		isUserLoggedIn,
		isBootstrapping,
		userLearningLanguage,
		user_materials.length,
		user,
		userId,
		router,
	])

	if (user_materials_loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			<Head>
				<title>Linguami | {t('myMaterialsTitle')}</title>
			</Head>
			<Container sx={{ marginTop: '6rem', marginBottom: '4rem' }}>
				{/* Back button */}
				<Box sx={{ mb: 3 }}>
					<IconButton
						sx={{
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							backdropFilter: 'blur(8px)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							transition: 'all 0.3s ease',
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							'&:hover': {
								transform: 'scale(1.1)',
								boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
							},
							'&:active': {
								transform: 'scale(0.95)',
							},
						}}
						aria-label='back'
						onClick={() => router.back()}>
						<ArrowBack fontSize='medium' />
					</IconButton>
				</Box>

				{/* Title */}
				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Typography
						variant='h3'
						sx={{
							fontSize: { xs: '2rem', md: '2.5rem' },
							fontWeight: 800,
							mb: 1,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}>
						{t('myMaterialsTitle')}
					</Typography>
					<Typography
						variant='subtitle1'
						sx={{
							color: '#718096',
							fontSize: { xs: '1rem', md: '1.125rem' },
						}}>
						{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
					</Typography>
				</Box>

				{/* Filter bar */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						mb: 4,
					}}>
					{/* Search bar and view toggle */}
					<Box
						sx={{
							display: 'flex',
							gap: 1.5,
							alignItems: 'center',
						}}>
						<Box
							component='form'
							onSubmit={handleSearchSubmit}
							sx={{
								flex: 1,
							}}>
							<TextField
								fullWidth
								size='small'
								placeholder={t('search')}
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												type='submit'
												edge='end'
												sx={{
													color: '#667eea',
													width: { xs: '36px', sm: '40px' },
													height: { xs: '36px', sm: '40px' },
													'&:hover': {
														transform: 'scale(1.1)',
														color: '#764ba2',
													},
												}}>
												<Search sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
											</IconButton>
										</InputAdornment>
									),
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 3,
										backgroundColor: 'white',
										'& fieldset': {
											borderColor: '#e0e0e0',
											borderWidth: 2,
										},
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
						</Box>

						{/* View toggle */}
						<Box
							sx={{
								display: 'flex',
								gap: 0.5,
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								borderRadius: 2,
								padding: '3px',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
								border: '2px solid rgba(102, 126, 234, 0.1)',
								flexShrink: 0,
							}}>
							<IconButton
								onClick={() => handleViewChange('card')}
								sx={{
									width: { xs: '34px', sm: '36px' },
									height: { xs: '34px', sm: '36px' },
									backgroundColor: viewMode === 'card' ? '#667eea' : 'transparent',
									color: viewMode === 'card' ? 'white' : '#667eea',
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: viewMode === 'card' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)',
									},
								}}>
								<GridView sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
							</IconButton>
							<IconButton
								onClick={() => handleViewChange('list')}
								sx={{
									width: { xs: '34px', sm: '36px' },
									height: { xs: '34px', sm: '36px' },
									backgroundColor: viewMode === 'list' ? '#667eea' : 'transparent',
									color: viewMode === 'list' ? 'white' : '#667eea',
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: viewMode === 'list' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)',
									},
								}}>
								<ViewList sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
							</IconButton>
						</Box>
					</Box>

					{/* Filters */}
					<Stack
						direction='row'
						spacing={{ xs: 0.75, sm: 1.5 }}
						sx={{
							alignItems: 'center',
							justifyContent: { xs: 'flex-start', md: 'flex-end' },
							flexWrap: 'wrap',
							gap: { xs: 0.75, sm: 1.5 },
						}}>
						{/* Level filters */}
						{levels.map(level => (
							<Tooltip key={level.label} title={level.tooltip} arrow placement='top'>
								<Chip
									label={level.label}
									onClick={() => setSelectedLevel(selectedLevel === level.key ? null : level.key)}
									sx={{
										fontWeight: 600,
										fontSize: { xs: '0.75rem', sm: '0.95rem' },
										px: { xs: 0.5, sm: 1 },
										height: { xs: '32px', sm: '40px' },
										minWidth: { xs: '50px', sm: 'auto' },
										borderRadius: 2,
										cursor: 'pointer',
										border: '2px solid',
										borderColor: selectedLevel === level.key ? '#667eea' : 'transparent',
										background: selectedLevel === level.key ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.9)',
										color: selectedLevel === level.key ? '#667eea' : '#666',
										boxShadow: selectedLevel === level.key ? '0 4px 15px rgba(102, 126, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
										transition: 'all 0.3s ease',
										'& .MuiChip-label': {
											px: { xs: 0.5, sm: 1 },
										},
										'&:hover': {
											transform: 'translateY(-2px)',
											boxShadow: `0 4px 16px ${level.color}60`,
											borderColor: level.color,
											background: `linear-gradient(135deg, ${level.color}30, ${level.color}50)`,
											color: level.color,
										},
									}}
								/>
							</Tooltip>
						))}

						{/* Status filters */}
						{statuses.map(status => (
							<Tooltip key={status.label} title={status.tooltip} arrow placement='top'>
								<Chip
									label={status.label}
									onClick={() => setSelectedStatus(selectedStatus === status.key ? null : status.key)}
									sx={{
										fontWeight: 600,
										fontSize: { xs: '0.7rem', sm: '0.95rem' },
										px: { xs: 0.5, sm: 1 },
										height: { xs: '32px', sm: '40px' },
										borderRadius: 2,
										cursor: 'pointer',
										border: '2px solid',
										borderColor: selectedStatus === status.key ? '#667eea' : 'transparent',
										background: selectedStatus === status.key ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.9)',
										color: selectedStatus === status.key ? '#667eea' : '#666',
										boxShadow: selectedStatus === status.key ? '0 4px 15px rgba(102, 126, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
										transition: 'all 0.3s ease',
										'& .MuiChip-label': {
											px: { xs: 0.5, sm: 1 },
										},
										'&:hover': {
											transform: 'translateY(-2px)',
											boxShadow: `0 4px 16px ${status.color}60`,
											borderColor: status.color,
											background: `linear-gradient(135deg, ${status.color}30, ${status.color}50)`,
											color: status.color,
										},
									}}
								/>
							</Tooltip>
						))}

						{/* Reset button */}
						<Tooltip title={`🔄 ${t('showall')} - ${t('showallTooltip')}`} arrow placement='top'>
							<IconButton
								onClick={handleClear}
								sx={{
									width: { xs: '32px', sm: '40px' },
									height: { xs: '32px', sm: '40px' },
									backgroundColor: 'rgba(255, 255, 255, 0.9)',
									boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
									'&:hover': {
										backgroundColor: '#667eea',
										color: 'white',
										transform: 'rotate(180deg) translateY(-2px)',
									},
								}}>
								<Refresh sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
							</IconButton>
						</Tooltip>
					</Stack>
				</Box>

				{/* Materials display */}
				{filteredMaterials.length === 0 ? (
					<Box
						sx={{
							textAlign: 'center',
							py: 8,
							px: 2,
						}}>
						<Typography
							variant='h5'
							sx={{
								color: '#718096',
								mb: 2,
								fontWeight: 600,
							}}>
							{t('noMaterialsFound')}
						</Typography>
						<Typography
							variant='body1'
							sx={{
								color: '#a0aec0',
							}}>
							{t('noMaterialsInCategory')}
						</Typography>
					</Box>
				) : viewMode === 'card' ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								md: 'repeat(2, 1fr)',
							},
							rowGap: 3,
							columnGap: 8,
						}}>
						{filteredMaterials.map(material => (
							<SectionCard
								key={material.id}
								material={material}
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
							/>
						))}
					</Box>
				) : (
					<MaterialsTable
						materials={filteredMaterials}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}
			</Container>
		</>
	)
}

export default UserMaterials
