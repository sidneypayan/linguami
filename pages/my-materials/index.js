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

	const handleSearchChange = (value) => {
		setSearchTerm(value)
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

			{/* Hero Section */}
			<Box
				sx={{
					background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
					pt: { xs: '6rem', md: '7rem' },
					pb: { xs: '5rem', md: '6rem' },
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '60px',
						background: '#ffffff',
						clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
					},
				}}>
				<Container
					maxWidth='lg'
					sx={{
						position: 'relative',
						zIndex: 1,
						pb: { xs: 2, md: 3 },
					}}>
					{/* Back button */}
					<Box sx={{ mb: 3 }}>
						<IconButton
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								color: 'white',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
									transform: 'scale(1.1)',
									boxShadow: '0 6px 30px rgba(139, 92, 246, 0.5)',
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
					<Box sx={{ textAlign: 'center' }}>
						<Typography
							variant='h1'
							sx={{
								fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
								fontWeight: 800,
								mb: { xs: 2.5, md: 3 },
								background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								backgroundSize: '200% 200%',
								animation: 'gradientShift 8s ease infinite',
								'@keyframes gradientShift': {
									'0%, 100%': {
										backgroundPosition: '0% 50%',
									},
									'50%': {
										backgroundPosition: '100% 50%',
									},
								},
							}}>
							{t('myMaterialsTitle')}
						</Typography>
						<Typography
							variant='h6'
							sx={{
								color: 'rgba(255, 255, 255, 0.9)',
								fontWeight: 500,
								fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
								px: { xs: 2, sm: 0 },
							}}>
							{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
						</Typography>
					</Box>
				</Container>
			</Box>

			<Container sx={{ py: { xs: 4, md: 6 } }}>

				<MaterialsFilterBar
					onSearchChange={handleSearchChange}
					onLevelChange={handleLevelChange}
					onStatusChange={handleStatusChange}
					onClear={handleClear}
					onViewChange={handleViewChange}
					searchValue={searchTerm}
					selectedLevel={selectedLevel}
					selectedStatus={selectedStatus}
					currentView={viewMode}
					showNotStudiedFilter={false}
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
