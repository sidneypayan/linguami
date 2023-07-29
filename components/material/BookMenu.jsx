import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AutoStories } from '@mui/icons-material'
import { getBookChapters } from '../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import {
	Box,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material'

const BookMenu = ({ bookName }) => {
	const { chapters } = useSelector(store => store.materials)
	const dispatch = useDispatch()

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

	useEffect(() => {
		if (bookName) {
			dispatch(getBookChapters(bookName))
		}
	}, [dispatch, bookName])

	const list = (
		<Box
			width={350}
			role='presentation'
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}>
			<List>
				{chapters.map((chapter, index) => (
					<ListItem key={chapter.id} disablePadding>
						<ListItemButton href={`/materials/book/${chapter.id}`}>
							<ListItemText
								primary={
									<Typography
										color='primaryGrey'
										variant='subtitle1'
										sx={{ fontWeight: '500' }}>
										{chapter.title}
									</Typography>
								}
							/>
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
