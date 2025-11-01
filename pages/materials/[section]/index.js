import useTranslation from 'next-translate/useTranslation'
import SectionCard from '../../../components/SectionCard'
import MaterialsTable from '../../../components/MaterialsTable'
import MaterialsFilterBar from '../../../components/MaterialsFilterBar'
import Pagination from '../../../components/layouts/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import {
	getBooks,
	getMaterials,
	getUserMaterialsStatus,
	filterMaterials,
	searchMaterial,
	showAllMaterials,
	filterMaterialsByStatus,
} from '../../../features/materials/materialsSlice'
import { selectMaterialsData } from '../../../features/materials/materialsSelectors'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, IconButton, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import SEO from '../../../components/SEO'
import { useUserContext } from '../../../context/user'
import LoadingSpinner from '../../../components/LoadingSpinner'

const Section = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage } = useUserContext()
	const router = useRouter()
	const { section } = router.query
	const [viewMode, setViewMode] = useState('card')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)

	const dispatch = useDispatch()
	// Utiliser le sélecteur mémoïsé pour optimiser les performances
	const {
		materials_loading,
		filtered_materials,
		level,
		sliceStart,
		sliceEnd,
		numOfPages,
	} = useSelector(selectMaterialsData)

	// Sélecteurs supplémentaires (non inclus dans selectMaterialsData)
	const books_loading = useSelector(state => state.materials.books_loading)
	const user_materials_status = useSelector(state => state.materials.user_materials_status)

	const handleViewChange = (view) => {
		setViewMode(view)
	}

	const handleSearchChange = (value) => {
		setSearchTerm(value)
		dispatch(searchMaterial(value))
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
		setSelectedStatus(null)
		if (level) {
			dispatch(filterMaterials({ section, level }))
		} else {
			dispatch(showAllMaterials())
		}
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
		setSelectedLevel(null)
		if (status) {
			dispatch(filterMaterialsByStatus({ section, status, userMaterialsStatus: user_materials_status }))
		} else {
			dispatch(showAllMaterials())
		}
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		dispatch(showAllMaterials())
	}

	const checkIfUserMaterialIsInMaterials = id => {
		const matchingMaterials = user_materials_status.find(
			userMaterial => userMaterial.material_id === id
		)
		return matchingMaterials
	}

	useEffect(() => {
		if (!userLearningLanguage || !section) return

		if (section === 'books') {
			dispatch(getBooks({ userLearningLanguage }))
		} else {
			dispatch(getMaterials({ userLearningLanguage, section }))
			dispatch(getUserMaterialsStatus())
		}
	}, [userLearningLanguage, section, dispatch])

	useEffect(() => {
		if (!level || !section || section === 'books') return

		dispatch(filterMaterials({ section, level }))
	}, [section, level, dispatch])

	if (materials_loading && books_loading) {
		return <LoadingSpinner />
	}

	// Mots-clés SEO par section et langue
	const getSectionKeywords = () => {
		const sectionName = t(section || 'materials')
		if (lang === 'fr') {
			return `${sectionName} russe, matériel ${sectionName}, apprendre russe avec ${sectionName}`
		} else if (lang === 'ru') {
			return `${sectionName} французский, материалы ${sectionName}, учить французский`
		} else {
			return `${sectionName} russian, ${sectionName} french, language learning ${sectionName}`
		}
	}

	// JSON-LD pour CollectionPage
	const jsonLd = section ? {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${t(section)} | ${t('pagetitle')}`,
		description: t('description'),
		url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials/${section}`,
		inLanguage: lang === 'fr' ? 'fr-FR' : lang === 'ru' ? 'ru-RU' : 'en-US',
		about: {
			'@type': 'Thing',
			name: t(section)
		}
	} : null

	return (
		<>
			<SEO
				title={`${t(section || 'pagetitle')} | Linguami`}
				description={t('description')}
				path={`/materials/${section || ''}`}
				keywords={getSectionKeywords()}
				jsonLd={jsonLd}
			/>

			{/* Hero Section */}
			<Box
				sx={{
					position: 'relative',
					background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
					overflow: 'hidden',
					pt: { xs: '6rem', md: '7rem' },
					pb: { xs: '5rem', md: '6rem' },
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
				}}>
				<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: { xs: 2, md: 3 } }}>
					{/* Back button */}
					<Box sx={{ mb: 3 }}>
						<IconButton
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: 'white',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
									transform: 'scale(1.15)',
									boxShadow: '0 8px 30px rgba(139, 92, 246, 0.6)',
									borderColor: 'rgba(139, 92, 246, 0.5)',
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
					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
							fontWeight: 800,
							mb: { xs: 2.5, md: 3 },
							textAlign: 'center',
							background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'gradientShift 8s ease infinite',
							'@keyframes gradientShift': {
								'0%': { backgroundPosition: '0% 50%' },
								'50%': { backgroundPosition: '100% 50%' },
								'100%': { backgroundPosition: '0% 50%' },
							},
						}}>
						{section && t(section)}
					</Typography>
				</Container>

				{/* Diagonal separator */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: { xs: '60px', md: '80px' },
						background: '#ffffff',
						clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
					}}
				/>
			</Box>

			<Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
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
					showNotStudiedFilter={true}
					translationNamespace="materials"
				/>

				{viewMode === 'card' ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								sx: '1fr',
								md: 'repeat(2, 1fr)',
							},
							rowGap: 3,
							columnGap: 8,
						}}>
						{filtered_materials?.length > 0 &&
							filtered_materials
								.slice(sliceStart, sliceEnd)
								.map(material => (
									<SectionCard
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
											material.id
										)}
										key={material.id}
										material={material}
									/>
								))}
					</Box>
				) : (
					<MaterialsTable
						materials={filtered_materials?.slice(sliceStart, sliceEnd) || []}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}

				{numOfPages > 1 && <Pagination />}
			</Container>
		</>
	)
}

export default Section
