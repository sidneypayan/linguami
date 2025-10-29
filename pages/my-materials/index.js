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
	const [currentFilter, setCurrentFilter] = useState('')

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
					marginTop: '6rem',
					marginBottom: '4rem',
				}}>
				{!displayMaterials && (
					<>
						<Typography
							variant='h3'
							align='center'
							sx={{
								fontSize: { xs: '2rem', md: '3rem' },
								fontWeight: 800,
								mb: 2,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							Mes matériaux
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								fontSize: { xs: '1rem', md: '1.125rem' },
								mb: 5,
								maxWidth: '600px',
								mx: 'auto',
							}}>
							Suivez votre progression et accédez à vos matériaux d'apprentissage
						</Typography>

						<Stack
							direction={{ xs: 'column', md: 'row' }}
							justifyContent='center'
							gap={{ xs: 3, md: 4 }}
							sx={{
								margin: '0 auto',
								maxWidth: '1000px',
								px: { xs: 2, sm: 0 },
							}}>
							<CardActionArea
								onClick={() => {
									filterUserMaterialsByStatus('is_being_studied')
									setCurrentFilter('being_studied')
									setDisplayMaterials(true)
								}}
								sx={{
									flex: 1,
									borderRadius: 4,
									transition: 'all 0.3s ease',
									'&:active': {
										transform: 'scale(0.97)',
									},
								}}>
								<Card
									sx={{
										position: 'relative',
										overflow: 'hidden',
										borderRadius: 4,
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
										background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
										border: '2px solid rgba(245, 158, 11, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 12px 32px rgba(245, 158, 11, 0.2)',
											borderColor: 'rgba(245, 158, 11, 0.4)',
										},
									}}>
									<Box
										sx={{
											position: 'relative',
											height: { xs: 200, sm: 250 },
											overflow: 'hidden',
											background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										{/* Animated circles */}
										<Box
											sx={{
												position: 'absolute',
												width: '150px',
												height: '150px',
												borderRadius: '50%',
												background: 'rgba(245, 158, 11, 0.3)',
												top: '-50px',
												right: '-30px',
												animation: 'float 6s ease-in-out infinite',
												'@keyframes float': {
													'0%, 100%': {
														transform: 'translateY(0px) scale(1)',
													},
													'50%': {
														transform: 'translateY(-20px) scale(1.1)',
													},
												},
											}}
										/>
										<Box
											sx={{
												position: 'absolute',
												width: '100px',
												height: '100px',
												borderRadius: '50%',
												background: 'rgba(251, 191, 36, 0.4)',
												bottom: '-20px',
												left: '20px',
												animation: 'float 4s ease-in-out infinite 1s',
											}}
										/>
										{/* Book icon */}
										<Typography
											sx={{
												fontSize: { xs: '5rem', sm: '6rem' },
												filter: 'drop-shadow(0 8px 16px rgba(245, 158, 11, 0.3))',
												animation: 'bounce 2s ease-in-out infinite',
												'@keyframes bounce': {
													'0%, 100%': {
														transform: 'translateY(0) rotate(-5deg)',
													},
													'50%': {
														transform: 'translateY(-15px) rotate(5deg)',
													},
												},
											}}>
											📚
										</Typography>
									</Box>
									<Box sx={{ p: 3 }}>
										<Typography
											variant='h5'
											align='center'
											sx={{
												fontWeight: 700,
												color: '#f59e0b',
												mb: 1,
												fontSize: { xs: '1.25rem', md: '1.5rem' },
											}}>
											{t('being_studied')}
										</Typography>
										<Typography
											variant='body2'
											align='center'
											sx={{
												color: '#718096',
												fontWeight: 500,
											}}>
											{user_materials.filter(m => m.is_being_studied).length} matériau
											{user_materials.filter(m => m.is_being_studied).length > 1 ? 'x' : ''}
										</Typography>
									</Box>
								</Card>
							</CardActionArea>

							<CardActionArea
								onClick={() => {
									filterUserMaterialsByStatus('is_studied')
									setCurrentFilter('studied')
									setDisplayMaterials(true)
								}}
								sx={{
									flex: 1,
									borderRadius: 4,
									transition: 'all 0.3s ease',
									'&:active': {
										transform: 'scale(0.97)',
									},
								}}>
								<Card
									sx={{
										position: 'relative',
										overflow: 'hidden',
										borderRadius: 4,
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
										background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
										border: '2px solid rgba(34, 197, 94, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 12px 32px rgba(34, 197, 94, 0.2)',
											borderColor: 'rgba(34, 197, 94, 0.4)',
										},
									}}>
									<Box
										sx={{
											position: 'relative',
											height: { xs: 200, sm: 250 },
											overflow: 'hidden',
											background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										{/* Animated shapes */}
										<Box
											sx={{
												position: 'absolute',
												width: '120px',
												height: '120px',
												borderRadius: '50%',
												background: 'rgba(34, 197, 94, 0.3)',
												top: '20px',
												left: '-30px',
												animation: 'float 5s ease-in-out infinite',
												'@keyframes float': {
													'0%, 100%': {
														transform: 'translateY(0px) scale(1)',
													},
													'50%': {
														transform: 'translateY(-20px) scale(1.1)',
													},
												},
											}}
										/>
										<Box
											sx={{
												position: 'absolute',
												width: '80px',
												height: '80px',
												borderRadius: '50%',
												background: 'rgba(16, 185, 129, 0.4)',
												bottom: '10px',
												right: '30px',
												animation: 'float 4.5s ease-in-out infinite 0.5s',
											}}
										/>
										{/* Star/Trophy icon */}
										<Typography
											sx={{
												fontSize: { xs: '5rem', sm: '6rem' },
												filter: 'drop-shadow(0 8px 16px rgba(34, 197, 94, 0.3))',
												animation: 'pulse 3s ease-in-out infinite',
												'@keyframes pulse': {
													'0%, 100%': {
														transform: 'scale(1) rotate(0deg)',
													},
													'50%': {
														transform: 'scale(1.1) rotate(10deg)',
													},
												},
											}}>
											🏆
										</Typography>
									</Box>
									<Box sx={{ p: 3 }}>
										<Typography
											variant='h5'
											align='center'
											sx={{
												fontWeight: 700,
												color: '#22c55e',
												mb: 1,
												fontSize: { xs: '1.25rem', md: '1.5rem' },
											}}>
											{t('studied')}
										</Typography>
										<Typography
											variant='body2'
											align='center'
											sx={{
												color: '#718096',
												fontWeight: 500,
											}}>
											{user_materials.filter(m => m.is_studied).length} matériau
											{user_materials.filter(m => m.is_studied).length > 1 ? 'x' : ''}
										</Typography>
									</Box>
								</Card>
							</CardActionArea>

							<CardActionArea
								onClick={() => {
									filterUserMaterialsByStatus('all')
									setCurrentFilter('all')
									setDisplayMaterials(true)
								}}
								sx={{
									flex: 1,
									borderRadius: 4,
									transition: 'all 0.3s ease',
									'&:active': {
										transform: 'scale(0.97)',
									},
								}}>
								<Card
									sx={{
										position: 'relative',
										overflow: 'hidden',
										borderRadius: 4,
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
										background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
										border: '2px solid rgba(102, 126, 234, 0.2)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 12px 32px rgba(102, 126, 234, 0.2)',
											borderColor: 'rgba(102, 126, 234, 0.4)',
										},
									}}>
									<Box
										sx={{
											position: 'relative',
											height: { xs: 200, sm: 250 },
											overflow: 'hidden',
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										{/* Animated background shapes */}
										<Box
											sx={{
												position: 'absolute',
												width: '200px',
												height: '200px',
												borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
												background: 'rgba(255, 255, 255, 0.1)',
												top: '-80px',
												right: '-50px',
												animation: 'morph 8s ease-in-out infinite',
												'@keyframes morph': {
													'0%, 100%': {
														borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
														transform: 'rotate(0deg)',
													},
													'50%': {
														borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
														transform: 'rotate(180deg)',
													},
												},
											}}
										/>
										<Box
											sx={{
												position: 'absolute',
												width: '150px',
												height: '150px',
												borderRadius: '50%',
												background: 'rgba(255, 255, 255, 0.08)',
												bottom: '-40px',
												left: '-40px',
												animation: 'pulse 6s ease-in-out infinite 1s',
												'@keyframes pulse': {
													'0%, 100%': {
														transform: 'scale(1)',
													},
													'50%': {
														transform: 'scale(1.2)',
													},
												},
											}}
										/>
										{/* Number with emoji */}
										<Box
											sx={{
												position: 'relative',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												gap: 1,
											}}>
											<Typography
												sx={{
													fontSize: { xs: '3rem', sm: '4rem' },
													animation: 'rotate 10s linear infinite',
													'@keyframes rotate': {
														'0%': {
															transform: 'rotate(0deg)',
														},
														'100%': {
															transform: 'rotate(360deg)',
														},
													},
												}}>
												🎯
											</Typography>
											<Typography
												variant='h1'
												sx={{
													color: 'white',
													fontWeight: 900,
													fontSize: { xs: '3.5rem', sm: '5rem' },
													textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
												}}>
												{user_materials.length}
											</Typography>
										</Box>
									</Box>
									<Box sx={{ p: 3 }}>
										<Typography
											variant='h5'
											align='center'
											sx={{
												fontWeight: 700,
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												WebkitBackgroundClip: 'text',
												WebkitTextFillColor: 'transparent',
												backgroundClip: 'text',
												mb: 1,
												fontSize: { xs: '1.25rem', md: '1.5rem' },
											}}>
											Tous les matériaux
										</Typography>
										<Typography
											variant='body2'
											align='center'
											sx={{
												color: '#718096',
												fontWeight: 500,
											}}>
											{user_materials.length} matériau{user_materials.length > 1 ? 'x' : ''} au
											total
										</Typography>
									</Box>
								</Card>
							</CardActionArea>
						</Stack>
					</>
				)}
				{displayMaterials && (
					<>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								mb: 4,
								flexWrap: 'wrap',
								gap: 2,
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
									onClick={() => setDisplayMaterials(false)}>
									<ArrowBack fontSize='medium' />
								</IconButton>

								<Box>
									<Typography
										variant='h4'
										sx={{
											fontSize: { xs: '1.5rem', md: '2rem' },
											fontWeight: 700,
											background:
												currentFilter === 'being_studied'
													? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
													: currentFilter === 'studied'
													? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
													: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}>
										{currentFilter === 'being_studied'
											? t('being_studied')
											: currentFilter === 'studied'
											? t('studied')
											: 'Tous les matériaux'}
									</Typography>
									<Typography
										variant='subtitle2'
										sx={{
											color: '#718096',
											fontWeight: 500,
										}}>
										{filteredUserMaterials.length} matériau
										{filteredUserMaterials.length > 1 ? 'x' : ''}
									</Typography>
								</Box>
							</Box>
						</Box>

						{filteredUserMaterials.length === 0 ? (
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
									Aucun matériau trouvé
								</Typography>
								<Typography
									variant='body1'
									sx={{
										color: '#a0aec0',
									}}>
									Vous n'avez pas encore de matériaux dans cette catégorie
								</Typography>
							</Box>
						) : (
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: {
										xs: '1fr',
										md: 'repeat(2, 1fr)',
									},
									rowGap: 3,
									columnGap: { xs: 2, md: 8 },
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
						)}
					</>
				)}
			</Container>
		</>
	)
}

export default UserMaterials
