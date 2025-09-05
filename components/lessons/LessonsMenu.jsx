import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

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
	const { t } = useTranslation('lessons')
	const [openLevels, setOpenLevels] = useState({})

	const theme = useTheme()
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

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
				width: '80%',
				maxWidth: 360,
				bgcolor: 'clrCardBg',
				borderRadius: 5,
				overflow: 'hidden',
				m: '0 auto',
				position: { sx: 'static', md: 'sticky' },
				top: { sx: 0, md: '160px' },
				p: 0,
			}}
			component='nav'
			aria-labelledby='nested-list-subheader'>
			{CECR_LEVELS.map((level, index) => (
				<div key={level}>
					<ListItemButton onClick={() => toggleLevel(level)}>
						<ListItemIcon>{getLevelIcon(level)}</ListItemIcon>
						<ListItemText
							primary={`${t('level')}  ${level}`}
							primaryTypographyProps={{ fontWeight: 'bold' }}
						/>
						{openLevels[level] ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={openLevels[level]} timeout='auto' unmountOnExit>
						<List component='div' disablePadding>
							{lessonsByLevel[level].map((lesson, index) => (
								<ListItemButton
									key={lesson.slug}
									sx={{ pl: 4 }}
									onClick={() => {
										onSelectLesson(lesson.slug)
										if (isSmallScreen) {
											setOpenLevels({})
										}
									}}>
									<ListItemText primary={`${index + 1} - ${lesson.titleRu}`} />
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
