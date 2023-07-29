import { useEffect, useState } from 'react'
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
	const dispatch = useDispatch()
	const { user_materials } = useSelector(store => store.materials)
	const { learningLanguage } = useUserContext()

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
		setFilteredUserMaterials(user_materials)
	}, [user_materials])

	useEffect(() => {
		dispatch(getUserMaterials(learningLanguage))
	}, [dispatch, learningLanguage])

	return (
		<>
			<Head>
				<title>Linguami | Mes materiels</title>
			</Head>
			<Container
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: 'calc(100vh - 500px)',
					margin: '10rem auto',
				}}>
				{!displayMaterials && (
					<Stack
						justifyContent='center'
						gap={2}
						sx={{
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
									En cours d&apos;étude
								</Typography>
								<Box
									component='img'
									src='/img/studying.jpg'
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
									Etudiés
								</Typography>

								<Box
									component='img'
									src='/img/studied.jpg'
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
