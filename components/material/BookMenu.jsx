import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	AutoStoriesRounded,
	CheckCircleRounded,
	ScheduleRounded,
	CloseRounded,
	MenuBookRounded,
} from '@mui/icons-material'
import { getBookChapters } from '../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
	Box,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
	IconButton,
	Divider,
	Chip,
} from '@mui/material'
import {
	getUserMaterialsStatus,
	getUserMaterialStatus,
} from '../../features/materials/materialsSlice'

const BookMenu = ({ bookId }) => {
	const { chapters, user_materials_status } = useSelector(
		store => store.materials
	)

	const router = useRouter()
	const { section, material } = router.query

	const dispatch = useDispatch()

	useEffect(() => {
		if (!section) return

		dispatch(getUserMaterialsStatus())
	}, [section, dispatch])

	useEffect(() => {
		if (bookId) {
			dispatch(getBookChapters(bookId))
		}
	}, [dispatch, bookId])

	const checkIfUserMaterialIsInMaterials = id => {
		const matchingMaterials = user_materials_status.find(
			userMaterial => userMaterial.material_id === id
		)
		return matchingMaterials
	}

	const [drawerState, setDrawerState] = useState(false)

	const toggleDrawer = open => event => {
		if (
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return
		}

		setDrawerState(open)
	}

	const list = (
		<Box
			sx={{
				width: { xs: '100vw', sm: 400 },
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: '#fafafa',
			}}
			role='presentation'>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					padding: 3,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
				}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<MenuBookRounded sx={{ fontSize: '2rem' }} />
					<Box>
						<Typography variant='h5' sx={{ fontWeight: 700, mb: 0.5 }}>
							Chapitres
						</Typography>
						<Typography variant='body2' sx={{ opacity: 0.9 }}>
							{chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
						</Typography>
					</Box>
				</Box>
				<IconButton
					onClick={toggleDrawer(false)}
					sx={{
						color: 'white',
						'&:hover': {
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							transform: 'rotate(90deg)',
						},
						transition: 'all 0.3s ease',
					}}>
					<CloseRounded />
				</IconButton>
			</Box>

			<Divider />

			{/* Chapters List */}
			<List
				sx={{
					flex: 1,
					overflow: 'auto',
					padding: 2,
				}}>
				{chapters.map((chapter, index) => {
					const status = checkIfUserMaterialIsInMaterials(chapter.id)
					const isBeingStudied = status?.is_being_studied
					const isStudied = status?.is_studied
					const isCurrentChapter = material == chapter.id

					return (
						<ListItem
							key={chapter.id}
							disablePadding
							sx={{ marginBottom: 1 }}>
							<ListItemButton
								href={`/materials/books/${chapter.id}`}
								onClick={toggleDrawer(false)}
								sx={{
									borderRadius: 2,
									padding: 2,
									backgroundColor: isCurrentChapter
										? 'rgba(102, 126, 234, 0.1)'
										: 'white',
									border: isCurrentChapter
										? '2px solid #667eea'
										: '1px solid rgba(0, 0, 0, 0.08)',
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: 'rgba(102, 126, 234, 0.08)',
										transform: 'translateX(4px)',
										boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
									},
									'&:active': {
										transform: 'scale(0.98)',
									},
								}}>
								{/* Chapter Number */}
								<Box
									sx={{
										minWidth: 40,
										height: 40,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: isCurrentChapter
											? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
											: 'rgba(102, 126, 234, 0.1)',
										color: isCurrentChapter ? 'white' : '#667eea',
										fontWeight: 700,
										fontSize: '1rem',
										marginRight: 2,
										flexShrink: 0,
									}}>
									{index + 1}
								</Box>

								<ListItemText
									primary={
										<Typography
											variant='subtitle1'
											sx={{
												color: isCurrentChapter ? '#667eea' : '#2d3748',
												fontWeight: 600,
												fontSize: '1rem',
												lineHeight: 1.4,
											}}>
											{chapter.title}
										</Typography>
									}
								/>

								{/* Status Badges */}
								<Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
									{isBeingStudied && (
										<Chip
											icon={<ScheduleRounded />}
											label='En cours'
											size='small'
											sx={{
												background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
												color: 'white',
												fontWeight: 600,
												fontSize: '0.7rem',
												height: 24,
												'& .MuiChip-icon': {
													color: 'white',
													fontSize: '0.9rem',
												},
											}}
										/>
									)}
									{isStudied && (
										<Chip
											icon={<CheckCircleRounded />}
											label='Terminé'
											size='small'
											sx={{
												background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
												color: 'white',
												fontWeight: 600,
												fontSize: '0.7rem',
												height: 24,
												'& .MuiChip-icon': {
													color: 'white',
													fontSize: '0.9rem',
												},
											}}
										/>
									)}
								</Box>
							</ListItemButton>
						</ListItem>
					)
				})}
			</List>
		</Box>
	)

	return (
		<>
			<Button
				variant='contained'
				startIcon={<AutoStoriesRounded />}
				onClick={toggleDrawer(true)}
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					fontWeight: 600,
					fontSize: { xs: '0.9rem', sm: '1rem' },
					padding: '0.75rem 1.5rem',
					borderRadius: 3,
					textTransform: 'none',
					transition: 'all 0.3s ease',
					boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
					'&:hover': {
						background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
						transform: 'translateY(-2px)',
						boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
					},
					'&:active': {
						transform: 'scale(0.98)',
					},
				}}>
				Chapitres du livre
			</Button>
			<Drawer
				anchor='left'
				open={drawerState}
				onClose={toggleDrawer(false)}
				sx={{
					'& .MuiDrawer-paper': {
						boxShadow: '8px 0 32px rgba(0, 0, 0, 0.1)',
					},
				}}>
				{list}
			</Drawer>
		</>
	)
}

export default BookMenu
