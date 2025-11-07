import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMaterials } from '../../features/materials/materialsSlice'
import SectionCard from '../../components/SectionCard'
import MaterialsTable from '../../components/MaterialsTable'
import MaterialsFilterBar from '../../components/MaterialsFilterBar'
import Head from 'next/head'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
	Box,
	Container,
	IconButton,
	Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
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
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card')

	// Filtrage des matériels
	const filteredMaterials = useMemo(() => {
		let filtered = [...user_materials]

		// Exclure les books et book-chapters (ils ne sont pas dans "my materials")
		filtered = filtered.filter(material =>
			material.section !== 'books' && material.section !== 'book-chapters'
		)

		// Filtre par section
		if (selectedSection) {
			filtered = filtered.filter(material => material.section === selectedSection)
		}

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
	}, [user_materials, searchTerm, selectedLevel, selectedStatus, selectedSection])

	const handleSearchChange = (value) => {
		setSearchTerm(value)
	}

	const handleSectionChange = (section) => {
		setSelectedSection(section)
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
	}

	const handleViewChange = (view) => {
		setViewMode(view)
	}

	const checkIfUserMaterialIsInMaterials = id => {
		return user_materials.find(material => material.id === id)
	}

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

			{/* Header Section - App Style */}
			<Box
				sx={{
					display: { xs: 'none', lg: 'block' },
					pt: { xs: '3.75rem', md: '6rem' },
					pb: { xs: 2, md: 2.5 },
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: 'background.paper',
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 1.25, md: 1.5 } }}>
						<IconButton
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
								width: { xs: 40, md: 44 },
								height: { xs: 40, md: 44 },
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
									transform: 'scale(1.05)',
								},
							}}
							aria-label='back'
							onClick={() => router.back()}>
							<ArrowBack fontSize='medium' />
						</IconButton>
						<Box>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.5rem', sm: '2rem' },
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									mb: 0.5,
								}}>
								{t('myMaterialsTitle')}
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: '#64748b',
									fontSize: { xs: '0.875rem', sm: '0.9375rem' },
								}}>
								{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>

			<Container sx={{ pt: { xs: '3.75rem', lg: 2.5 }, pb: { xs: 2.5, md: 4 } }}>

				{/* Mobile Title - Hidden on desktop */}
				<Box
					sx={{
						display: { xs: 'flex', lg: 'none' },
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 2.5,
						pb: 1.5,
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					}}>
					<Box>
						<Typography
							variant='h5'
							sx={{
								fontWeight: 700,
								fontSize: '1.5rem',
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								mb: 0.25,
							}}>
							{t('myMaterialsTitle')}
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: '#64748b',
								fontSize: '0.875rem',
							}}>
							{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
						</Typography>
					</Box>
				</Box>

				<MaterialsFilterBar
					onSearchChange={handleSearchChange}
					onSectionChange={handleSectionChange}
					onLevelChange={handleLevelChange}
					onStatusChange={handleStatusChange}
					onClear={handleClear}
					onViewChange={handleViewChange}
					searchValue={searchTerm}
					selectedSection={selectedSection}
					selectedLevel={selectedLevel}
					selectedStatus={selectedStatus}
					currentView={viewMode}
					showNotStudiedFilter={false}
					showSectionFilter={true}
					translationNamespace="materials"
				/>

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
							rowGap: { xs: 2, md: 3 },
							columnGap: { xs: 2, md: 4 },
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
