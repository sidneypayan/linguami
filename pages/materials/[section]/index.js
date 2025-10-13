import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import SectionCard from '../../../components/SectionCard'
import LevelBar from '../../../components/layouts/LevelBar'
import Pagination from '../../../components/layouts/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import {
	getMaterials,
	getUserMaterialsStatus,
	filterMaterials,
} from '../../../features/materials/materialsSlice'
import {
	getBooks,
	filterBooks,
	getBookChapters,
} from '../../../features/books/booksSlice'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Head from 'next/head'
import { useUserContext } from '../../../context/user'

const Section = () => {
	const { t } = useTranslation('materials')
	const { userLearningLanguage } = useUserContext()
	const router = useRouter()
	const { section } = router.query

	const dispatch = useDispatch()
	const {
		materials_loading,
		filtered_materials,
		user_materials_status,
		level,
		sliceStart,
		sliceEnd,
		numOfPages,
	} = useSelector(store => store.materials)

	const { filtered_books } = useSelector(store => store.books)

	const checkIfUserMaterialIsInMaterials = id => {
		const matchingMaterials = user_materials_status.find(
			userMaterial => userMaterial.material_id === id
		)
		return matchingMaterials
	}

	useEffect(() => {
		if (section && section !== 'book' && section !== 'books') {
			dispatch(getMaterials({ userLearningLanguage, section }))
			dispatch(getUserMaterialsStatus(section))
		} else {
			dispatch(getBooks({ userLearningLanguage }))
		}
	}, [userLearningLanguage, section, dispatch])

	useEffect(() => {
		if (level && section !== 'book' && section !== 'books') {
			dispatch(filterMaterials({ section, level }))
		} else {
			dispatch(filterBooks({ level }))
		}
	}, [section, level, dispatch])

	if (materials_loading) {
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
	console.log(filtered_books)
	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>

			<IconButton
				sx={{
					position: 'absolute',
					top: '6rem',
					left: '5%',
					color: 'clrBtn2',
				}}
				aria-label='back'
				onClick={() => router.back()}>
				<ArrowBack fontSize='large' />
			</IconButton>

			<Container sx={{ margin: '10rem auto' }}>
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
					{section !== 'books' && filtered_materials?.length > 0
						? filtered_materials
								.slice(sliceStart, sliceEnd)
								.map(material => (
									<SectionCard
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
											material.id
										)}
										key={material.id}
										material={material}
									/>
								))
						: filtered_books
								.slice(sliceStart, sliceEnd)
								.map(book => (
									<SectionCard
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
											book.id
										)}
										key={book.id}
										material={book}
									/>
								))}
				</Box>
				{numOfPages > 1 && <Pagination />}
			</Container>
		</>
	)
}

export default Section
