import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getFirstChapterOfBook } from '../features/materials/materialsSlice'
import { useUserContext } from '../context/user'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Typography,
	Avatar,
	Chip,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import {
	Movie,
	MusicNote,
	Audiotrack,
	CheckCircle,
	Schedule,
	MenuBook,
} from '@mui/icons-material'
import { sections } from '../data/sections'

const MaterialsTable = ({ materials, checkIfUserMaterialIsInMaterials }) => {
	const router = useRouter()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { section } = router.query
	const { userLearningLanguage } = useUserContext()

	const handleRowClick = async (material) => {
		if (section === 'books') {
			try {
				const chapter = await dispatch(
					getFirstChapterOfBook({
						bookId: material.id,
						userLearningLanguage,
					})
				).unwrap()
				router.push(`/materials/books/${chapter.id}`)
			} catch (error) {
				console.error('Erreur lors de la récupération du chapitre :', error)
			}
		} else {
			router.push(`/materials/${material.section}/${material.id}`)
		}
	}

	const getIcon = (section) => {
		if (sections.audio.includes(section)) {
			return <Audiotrack sx={{ fontSize: '1.5rem', color: '#667eea' }} />
		}
		if (sections.music.includes(section)) {
			return <MusicNote sx={{ fontSize: '1.5rem', color: '#667eea' }} />
		}
		if (sections.video.includes(section)) {
			return <Movie sx={{ fontSize: '1.5rem', color: '#667eea' }} />
		}
		return <MenuBook sx={{ fontSize: '1.5rem', color: '#667eea' }} />
	}

	const getLevelColor = (level) => {
		if (level === 'débutant') return '#10b981'
		if (level === 'intermédiaire') return '#f59e0b'
		if (level === 'avancé') return '#ef4444'
		return '#667eea'
	}

	const getLevelLabel = (level) => {
		if (level === 'débutant') return 'A1/A2'
		if (level === 'intermédiaire') return 'B1/B2'
		if (level === 'avancé') return 'C1/C2'
		return level
	}

	const getStatusIcon = (materialId) => {
		const status = checkIfUserMaterialIsInMaterials(materialId)
		if (!status) return null

		if (status.is_studied) {
			return (
				<CheckCircle
					sx={{
						fontSize: '1.5rem',
						color: '#22c55e',
					}}
				/>
			)
		}
		if (status.is_being_studied) {
			return (
				<Schedule
					sx={{
						fontSize: '1.5rem',
						color: '#f59e0b',
					}}
				/>
			)
		}
		return null
	}

	// Version mobile - liste de cartes compactes
	if (isMobile) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{materials.map((material) => (
					<Paper
						key={material.id}
						onClick={() => handleRowClick(material)}
						sx={{
							p: 2,
							borderRadius: 3,
							cursor: 'pointer',
							border: '1px solid rgba(102, 126, 234, 0.08)',
							background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
							transition: 'all 0.3s ease',
							'&:hover': {
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.12)',
								transform: 'translateY(-2px)',
								borderColor: 'rgba(102, 126, 234, 0.2)',
							},
							'&:active': {
								transform: 'scale(0.98)',
							},
						}}>
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
							{/* Image */}
							<Avatar
								src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.image}`}
								alt={material.title}
								variant="rounded"
								sx={{
									width: 80,
									height: 80,
									flexShrink: 0,
									boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
								}}
							/>

							{/* Content */}
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
									<Typography
										sx={{
											fontSize: '1rem',
											fontWeight: 700,
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
											lineHeight: 1.3,
											flex: 1,
											mr: 1,
										}}>
										{material.title}
									</Typography>
									{getStatusIcon(material.id)}
								</Box>

								<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
									<Chip
										label={getLevelLabel(material.level)}
										size="small"
										sx={{
											backgroundColor: getLevelColor(material.level),
											color: 'white',
											fontWeight: 600,
											fontSize: '0.75rem',
											height: '24px',
										}}
									/>
									<Typography
										variant="caption"
										sx={{
											color: '#718096',
											fontWeight: 500,
										}}>
										{material.section}
									</Typography>
								</Box>
							</Box>
						</Box>
					</Paper>
				))}
			</Box>
		)
	}

	// Version desktop - tableau
	return (
		<TableContainer
			component={Paper}
			sx={{
				borderRadius: 4,
				boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
				border: '1px solid rgba(102, 126, 234, 0.08)',
				overflow: 'hidden',
			}}>
			<Table>
				<TableHead>
					<TableRow
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						}}>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '60px',
							}}>
							{/* Empty for icon */}
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
							}}>
							Title
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '150px',
							}}>
							Section
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '120px',
								textAlign: 'center',
							}}>
							Level
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '80px',
								textAlign: 'center',
							}}>
							Status
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{materials.map((material, index) => (
						<TableRow
							key={material.id}
							onClick={() => handleRowClick(material)}
							sx={{
								cursor: 'pointer',
								backgroundColor: index % 2 === 0 ? 'rgba(102, 126, 234, 0.02)' : 'white',
								transition: 'all 0.2s ease',
								'&:hover': {
									backgroundColor: 'rgba(102, 126, 234, 0.08)',
									transform: 'scale(1.01)',
									boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
								},
								'&:active': {
									transform: 'scale(0.99)',
								},
							}}>
							{/* Image/Icon Column */}
							<TableCell sx={{ py: 2 }}>
								<Avatar
									src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.image}`}
									alt={material.title}
									variant="rounded"
									sx={{
										width: 50,
										height: 50,
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
									}}
								/>
							</TableCell>

							{/* Title Column */}
							<TableCell sx={{ py: 2 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
									{getIcon(material.section)}
									<Typography
										sx={{
											fontSize: '1rem',
											fontWeight: 700,
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}>
										{material.title}
									</Typography>
								</Box>
							</TableCell>

							{/* Section Column */}
							<TableCell sx={{ py: 2 }}>
								<Typography
									sx={{
										fontSize: '0.9rem',
										fontWeight: 600,
										color: '#718096',
									}}>
									{material.section}
								</Typography>
							</TableCell>

							{/* Level Column */}
							<TableCell sx={{ py: 2, textAlign: 'center' }}>
								<Chip
									label={getLevelLabel(material.level)}
									sx={{
										backgroundColor: getLevelColor(material.level),
										color: 'white',
										fontWeight: 600,
										fontSize: '0.85rem',
										height: '28px',
										boxShadow: `0 2px 8px ${getLevelColor(material.level)}40`,
									}}
								/>
							</TableCell>

							{/* Status Column */}
							<TableCell sx={{ py: 2, textAlign: 'center' }}>
								{getStatusIcon(material.id)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default React.memo(MaterialsTable)
