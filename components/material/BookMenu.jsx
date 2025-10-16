import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AutoStories } from '@mui/icons-material'
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
	ListItemIcon,
} from '@mui/material'
import {
	getUserMaterialsStatus,
	getUserMaterialStatus,
} from '../../features/materials/materialsSlice'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const BookMenu = ({ bookId }) => {
	const { chapters, user_materials_status } = useSelector(
		store => store.materials
	)

	console.log(user_materials_status)
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
			width={350}
			role='presentation'
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}>
			<List>
				{chapters.map((chapter, index) => (
					<ListItem key={chapter.id} disablePadding>
						<ListItemButton href={`/materials/books/${chapter.id}`}>
							<ListItemText
								primary={
									<Typography color='primaryGrey' variant='subtitle1'>
										{chapter.title}
									</Typography>
								}
							/>
							{typeof checkIfUserMaterialIsInMaterials(chapter.id) !==
								'undefined' &&
								checkIfUserMaterialIsInMaterials(chapter.id)
									.is_being_studied && (
									<ListItemIcon sx={{ minWidth: 30 }}>
										<AccessTimeIcon sx={{ color: '#1c991cb3' }} />
									</ListItemIcon>
								)}
							{typeof checkIfUserMaterialIsInMaterials(chapter.id) !==
								'undefined' &&
								checkIfUserMaterialIsInMaterials(chapter.id).is_studied && (
									<ListItemIcon sx={{ minWidth: 30 }}>
										<CheckCircleIcon sx={{ color: '#1c991cb3' }} />
									</ListItemIcon>
								)}
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)

	return (
		<>
			<Button
				sx={{
					marginBottom: '2rem',
					marginLeft: '1rem',
					backgroundColor: 'clrPrimary1',
					color: '#fff',
				}}
				variant='contained'
				endIcon={<AutoStories />}
				onClick={toggleDrawer(true)}>
				Afficher les chapitres
			</Button>
			<Drawer anchor='left' open={drawerState} onClose={toggleDrawer(false)}>
				{list}
			</Drawer>
		</>
	)
}

export default BookMenu
