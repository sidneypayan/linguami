import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import SectionCard from '../../../components/SectionCard'
import LevelBar from '../../../components/layouts/LevelBar'
import Pagination from '../../../components/layouts/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import {
	getBooks,
	getMaterials,
	getUserMaterialsStatus,
	filterMaterials,
} from '../../../features/materials/materialsSlice'
import { selectMaterialsData } from '../../../features/materials/materialsSelectors'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import SEO from '../../../components/SEO'
import { useUserContext } from '../../../context/user'

const Section = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage } = useUserContext()
	const router = useRouter()
	const { section } = router.query

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
		return (
			<div className='loader'>
				<Image
					src='/img/loader.gif'
					width={200}
					height={200}
					alt='loader'></Image>
			</div>
		)
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

			<Container sx={{ marginTop: '6rem', marginBottom: '4rem' }}>
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
				<LevelBar />
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
				{numOfPages > 1 && <Pagination />}
			</Container>
		</>
	)
}

export default Section
