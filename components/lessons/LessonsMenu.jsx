import Link from 'next/link'
import { useState } from 'react'
import {
	List,
	ListSubheader,
	ListItemText,
	ListItemButton,
	ListItemIcon,
	Collapse,
	Divider,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'

const CECR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LessonsMenu = ({ lessonsInfos, onSelectLesson }) => {
	const [openLevels, setOpenLevels] = useState({})

	const toggleLevel = level => {
		setOpenLevels(prev => ({ ...prev, [level]: !prev[level] }))
	}

	const CECR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

	const lessonsByLevel = CECR_LEVELS.reduce((acc, level) => {
		acc[level] = lessonsInfos.filter(lesson => lesson.lessonLevel === level)
		return acc
	}, {})

	return (
		<List
			sx={{ width: '100%', maxWidth: 360, bgcolor: 'clrCardBg' }}
			component='nav'
			aria-labelledby='nested-list-subheader'
			subheader={
				<ListSubheader component='div' id='nested-list-subheader'>
					Cours par niveau
				</ListSubheader>
			}>
			{CECR_LEVELS.map((level, index) => (
				<div key={level}>
					<ListItemButton onClick={() => toggleLevel(level)}>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={`Cours niveau ${level}`} />
						{openLevels[level] ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={openLevels[level]} timeout='auto' unmountOnExit>
						<List component='div' disablePadding>
							{lessonsByLevel[level].map(lesson => (
								<ListItemButton
									key={lesson.slug}
									sx={{ pl: 4 }}
									onClick={() => onSelectLesson(lesson.slug)}>
									<ListItemIcon>
										<StarBorder />
									</ListItemIcon>
									<ListItemText primary={lesson.titleFr} />
								</ListItemButton>
							))}
						</List>
					</Collapse>
					{index < CECR_LEVELS.length - 1 && (
						<Divider
							sx={{ borderBottomWidth: index % 2 === 1 ? '2px' : '1px' }}
						/>
					)}
				</div>
			))}
		</List>
	)
}

export default LessonsMenu
