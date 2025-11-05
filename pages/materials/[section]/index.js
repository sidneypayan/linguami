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
	filterMaterialsByLevelAndStatus,
} from '../../../features/materials/materialsSlice'
import { selectMaterialsData } from '../../../features/materials/materialsSelectors'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, IconButton, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import SEO from '../../../components/SEO'
import { useUserContext } from '../../../context/user'
import LoadingSpinner from '../../../components/LoadingSpinner'

const Section = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage, userProfile } = useUserContext()
	const router = useRouter()
	const { section } = router.query
	const [viewMode, setViewMode] = useState('card')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)

	// Tracker le niveau précédent pour détecter les changements
	const prevUserLevelRef = useRef(null)

	const dispatch = useDispatch()
	// Utiliser le sélecteur mémoïsé pour optimiser les performances
	const {
		materials_loading,
		filtered_materials,
		level,
		sliceStart,
		sliceEnd,
		page,
		materialsPerPage,
	} = useSelector(selectMaterialsData)

	// Sélecteurs supplémentaires (non inclus dans selectMaterialsData)
	const books_loading = useSelector(state => state.materials.books_loading)
	const user_materials_status = useSelector(state => state.materials.user_materials_status)

	// Définir cette fonction avant de l'utiliser dans useMemo
	const checkIfUserMaterialIsInMaterials = id => {
		const matchingMaterials = user_materials_status.find(
			userMaterial => userMaterial.material_id === id
		)
		return matchingMaterials
	}

	// Filtrer localement les matériaux pour s'assurer qu'ils correspondent à la langue d'apprentissage
	// Note: Le filtre par statut (is_studied) est maintenant géré au niveau Redux
	const displayedMaterials = useMemo(() => {
		if (!filtered_materials || !userLearningLanguage) return []
		const result = filtered_materials.filter(material => {
			// Vérifier que le matériel correspond à la langue d'apprentissage
			return material.lang === userLearningLanguage
		})
		console.log('📦 DisplayedMaterials recalculated:', result.length, 'materials')
		console.log('🔍 Sample levels:', result.slice(0, 3).map(m => ({ title: m.title, level: m.level })))
		console.log('🎚️ Selected status filter:', selectedStatus)
		return result
	}, [filtered_materials, userLearningLanguage, selectedStatus])

	// Calculer le nombre de pages basé sur les matériaux réellement affichés
	const numOfPages = Math.ceil(displayedMaterials.length / materialsPerPage)

	// S'assurer que la page actuelle ne dépasse pas le nombre de pages disponibles
	const currentPage = Math.min(page, Math.max(1, numOfPages))

	// Calculer localement sliceStart et sliceEnd basés sur les matériaux réellement affichés
	const localSliceStart = (currentPage - 1) * materialsPerPage
	const localSliceEnd = currentPage * materialsPerPage

	const handleViewChange = (view) => {
		setViewMode(view)
	}

	const handleSearchChange = (value) => {
		setSearchTerm(value)
		dispatch(searchMaterial(value))
	}

	// Fonction helper pour appliquer les deux filtres ensemble
	const applyBothFilters = (level, status) => {
		console.log('🎯 Applying filters - level:', level, 'status:', status)

		// Si aucun filtre, tout afficher
		if (!level && !status) {
			dispatch(showAllMaterials())
			return
		}

		// Utiliser la nouvelle action qui gère les deux filtres ensemble
		dispatch(filterMaterialsByLevelAndStatus({
			section,
			level,
			status,
			userMaterialsStatus: user_materials_status
		}))
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
		// Garder le statut actuel et appliquer les deux filtres
		applyBothFilters(level, selectedStatus)
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
		// Garder le niveau actuel et appliquer les deux filtres
		applyBothFilters(selectedLevel, status)
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		// Réinitialiser tous les filtres
		dispatch(showAllMaterials())
	}

	useEffect(() => {
		if (!userLearningLanguage || !section) return

		// Réinitialiser le flag quand la section change
		setHasAppliedDefaultFilter(false)
		// Réinitialiser aussi le filtre de statut
		setSelectedStatus(null)

		if (section === 'books') {
			dispatch(getBooks({ userLearningLanguage }))
		} else {
			dispatch(getMaterials({ userLearningLanguage, section }))
			dispatch(getUserMaterialsStatus())
		}
	}, [userLearningLanguage, section, dispatch])

	// Appliquer les filtres par défaut : niveau utilisateur + non étudiés
	useEffect(() => {
		if (
			!materials_loading &&
			userProfile?.language_level &&
			section &&
			section !== 'books' &&
			!hasAppliedDefaultFilter &&
			user_materials_status // Attendre que le statut des matériaux soit chargé
		) {
			const userLevel = userProfile.language_level
			console.log('🎯 Applying default filters - level:', userLevel, '+ not_studied')
			console.log('📊 User materials status loaded:', user_materials_status.length)

			// Mettre à jour l'état local
			setSelectedLevel(userLevel)
			setSelectedStatus('not_studied')

			// Appliquer les deux filtres ensemble
			dispatch(filterMaterialsByLevelAndStatus({
				section,
				level: userLevel,
				status: 'not_studied',
				userMaterialsStatus: user_materials_status
			}))

			setHasAppliedDefaultFilter(true)
			// Sauvegarder le niveau actuel comme référence
			prevUserLevelRef.current = userLevel
		}
	}, [materials_loading, userProfile?.language_level, section, hasAppliedDefaultFilter, user_materials_status, dispatch])

	// Détecter et réagir aux changements de niveau utilisateur
	useEffect(() => {
		const currentUserLevel = userProfile?.language_level
		const previousUserLevel = prevUserLevelRef.current

		// Vérifier si le niveau a vraiment changé
		if (
			currentUserLevel &&
			previousUserLevel &&
			currentUserLevel !== previousUserLevel &&
			section &&
			section !== 'books' &&
			user_materials_status
		) {
			console.log('🔄 User level changed from', previousUserLevel, 'to', currentUserLevel)
			// Le niveau a changé, réappliquer les filtres par défaut
			setSelectedLevel(currentUserLevel)
			setSelectedStatus('not_studied')

			// Appliquer les deux filtres ensemble
			dispatch(filterMaterialsByLevelAndStatus({
				section,
				level: currentUserLevel,
				status: 'not_studied',
				userMaterialsStatus: user_materials_status
			}))

			// Mettre à jour la référence
			prevUserLevelRef.current = currentUserLevel
		}
	}, [userProfile?.language_level, section, user_materials_status, dispatch])

	// Note: Ce useEffect a été supprimé car il créait un conflit avec le filtre par défaut
	// basé sur le niveau utilisateur. Le filtre est maintenant géré par les useEffect ci-dessus.

	// Afficher le loader pendant le chargement
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
					display: 'block',
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

			<Container maxWidth='lg' sx={{ pt: 3, pb: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
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
							// Masquer temporairement pendant que displayedMaterials se met à jour
							opacity: displayedMaterials.length > 0 ? 1 : 0,
							transition: 'opacity 0.15s ease-in',
						}}>
						{displayedMaterials.length > 0 &&
							displayedMaterials
								.slice(localSliceStart, localSliceEnd)
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
						materials={displayedMaterials.slice(localSliceStart, localSliceEnd)}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}

				{numOfPages > 1 && <Pagination numOfPages={numOfPages} />}
			</Container>
		</>
	)
}

export default Section
