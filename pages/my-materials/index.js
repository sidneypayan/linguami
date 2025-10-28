import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMaterials } from '../../features/materials/materialsSlice'
import SectionCard from '../../components/SectionCard'
import Head from 'next/head'
import {
	Card,
	CardActionArea,
	Container,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { ArrowBack } from '@mui/icons-material'
import { useUserContext } from '../../context/user'

const UserMaterials = () => {
	const { t } = useTranslation('materials')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user_materials } = useSelector(store => store.materials)
	const { userLearningLanguage, user, isUserLoggedIn, isBootstrapping } = useUserContext()
	const userId = user?.id

	const [filteredUserMaterials, setFilteredUserMaterials] = useState([])
	const [displayMaterials, setDisplayMaterials] = useState(false)

	const filterUserMaterialsByStatus = status => {
		let filteredMaterials
		if (status === 'is_being_studied') {
			filteredMaterials = user_materials.filter(
				userMaterial => userMaterial.is_being_studied
			)
		}
		if (status === 'is_studied') {
			filteredMaterials = user_materials.filter(
				userMaterial => userMaterial.is_studied
			)
		}
		if (status === 'all') {
			filteredMaterials = user_materials
		}

		setFilteredUserMaterials(filteredMaterials)
	}

	const checkIfUserMaterialIsInMaterials = id => {
		const filteredUserMaterialsStatus = filteredUserMaterials.map(
			filteredUserMaterial => ({
				id: filteredUserMaterial.id,
				...filteredUserMaterial,
			})
		)

		return filteredUserMaterialsStatus.find(
			filteredUserMaterialStatus => filteredUserMaterialStatus.id === id
		)
	}

	useEffect(() => {
		// Attendre que le bootstrap soit terminé avant de rediriger
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

	useEffect(() => {
		if (user_materials.length > 0) {
			setFilteredUserMaterials(user_materials)
		}
	}, [user_materials])

	return (
		<>
			<Head>
				<title>Linguami | Mes materiels</title>
			</Head>
			<Container
				sx={{
					margin: '10rem auto',
				}}>
				{!displayMaterials && (
					<Stack
						justifyContent='center'
						gap={2}
						sx={{
							margin: '0 auto',
							width: '500px',
							flexDirection: {
								sx: 'column',
								md: 'row',
							},
						}}>
						<CardActionArea
							onClick={() => {
								filterUserMaterialsByStatus('is_being_studied')
								setDisplayMaterials(true)
							}}>
							<Card>
								<Typography variant='h6' align='center' p={2}>
									{t('being_studied')}
								</Typography>
								<Box
									component='img'
									src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/studying.jpg`}
									alt='studied'
									width='100%'
									height={250}
								/>
							</Card>
						</CardActionArea>
						<CardActionArea
							onClick={() => {
								filterUserMaterialsByStatus('is_studied')
								setDisplayMaterials(true)
							}}>
							<Card>
								<Typography variant='h6' align='center' p={2}>
									{t('studied')}
								</Typography>

								<Box
									component='img'
									src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/studied.jpg`}
									alt='studied'
									width='100%'
									height={250}
								/>
							</Card>
						</CardActionArea>
					</Stack>
				)}
				{displayMaterials && (
					<>
						<IconButton
							sx={{
								position: 'absolute',
								top: '6rem',
								left: '5%',
								color: 'clrBtn2',
							}}
							aria-label='back'
							onClick={() => setDisplayMaterials(false)}>
							<ArrowBack fontSize='large' />
						</IconButton>
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
							{filteredUserMaterials.map(material => (
								<SectionCard
									key={material.id}
									material={material}
									checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
										material.id
									)}
								/>
							))}
						</Box>
					</>
				)}
			</Container>
		</>
	)
}

export default UserMaterials
