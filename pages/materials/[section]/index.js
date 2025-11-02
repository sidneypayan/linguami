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

			{/* Compact Header */}
			<Box
				sx={{
					display: { xs: 'none', lg: 'block' },
					pt: { xs: '5.5rem', md: '6rem' },
					pb: 2.5,
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: '#fafafa',
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
						<IconButton
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
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
						<Typography
							variant='h4'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.75rem', sm: '2rem' },
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								flex: 1,
							}}>
							{section && t(section)}
						</Typography>
					</Box>
				</Container>
			</Box>

			<Container maxWidth='lg' sx={{ pt: { xs: '5.5rem', lg: 3 }, pb: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
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
					showStudiedFilter={false}
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
								.filter(material => {
									const userStatus = checkIfUserMaterialIsInMaterials(material.id)
									return !userStatus || !userStatus.is_studied
								})
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
						materials={
							filtered_materials
								?.filter(material => {
									const userStatus = checkIfUserMaterialIsInMaterials(material.id)
									return !userStatus || !userStatus.is_studied
								})
								.slice(sliceStart, sliceEnd) || []
						}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}

				{numOfPages > 1 && <Pagination />}
			</Container>
		</>
	)
}

export default Section
