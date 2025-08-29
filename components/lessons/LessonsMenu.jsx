import { useState } from 'react'
import {
	List,
	ListItemText,
	ListItemButton,
	ListItemIcon,
	Collapse,
	Divider,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import { ExpandLess, ExpandMore } from '@mui/icons-material/'
import { FaSeedling, FaTree, FaGraduationCap } from 'react-icons/fa'
import { GiSprout } from 'react-icons/gi'
import {
	FaTree as FaTreeBig,
	FaGraduationCap as FaGraduationCapBig,
} from 'react-icons/fa6'

const getLevelIcon = level => {
	switch (level) {
		case 'A1':
			return <FaSeedling />
		case 'A2':
			return <GiSprout />
		case 'B1':
			return <FaTree />
		case 'B2':
			return <FaTreeBig />
		case 'C1':
			return <FaGraduationCap />
		case 'C2':
			return <FaGraduationCapBig />
		default:
			return <InboxIcon />
	}
}

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
			sx={{
				width: '100%',
				maxWidth: 360,
				bgcolor: 'clrCardBg',
				borderRadius: 5,
				position: 'sticky',
				top: '160px',
				p: 0,
				overflow: 'hidden',
				alignSelf: 'flex-start',
			}}
			component='nav'
			aria-labelledby='nested-list-subheader'>
			{CECR_LEVELS.map((level, index) => (
				<div key={level}>
					<ListItemButton onClick={() => toggleLevel(level)}>
						<ListItemIcon>{getLevelIcon(level)}</ListItemIcon>
						<ListItemText
							primary={`Leçons  ${level}`}
							primaryTypographyProps={{ fontWeight: 'bold' }}
						/>
						{openLevels[level] ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={openLevels[level]} timeout='auto' unmountOnExit>
						<List component='div' disablePadding>
							{lessonsByLevel[level].map(lesson => (
								<ListItemButton
									key={lesson.slug}
									sx={{ pl: 4 }}
									onClick={() => onSelectLesson(lesson.slug)}>
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
