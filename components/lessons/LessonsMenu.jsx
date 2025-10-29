import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getUserLessonsStatus } from '../../features/lessons/lessonsSlice'
import {
	List,
	ListItemText,
	ListItemButton,
	ListItemIcon,
	Collapse,
	Divider,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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

const getLevelColor = level => {
	switch (level) {
		case 'A1':
			return { bg: '#4ade8015', color: '#22c55e', border: '#4ade80' }
		case 'A2':
			return { bg: '#22d3ee15', color: '#0891b2', border: '#22d3ee' }
		case 'B1':
			return { bg: '#f59e0b15', color: '#d97706', border: '#f59e0b' }
		case 'B2':
			return { bg: '#f97316 15', color: '#ea580c', border: '#f97316' }
		case 'C1':
			return { bg: '#f093fb15', color: '#c026d3', border: '#f093fb' }
		case 'C2':
			return { bg: '#a855f715', color: '#9333ea', border: '#a855f7' }
		default:
			return { bg: '#667eea15', color: '#667eea', border: '#667eea' }
	}
}

const LessonsMenu = ({ lessonsInfos, onSelectLesson, lessonSlug }) => {
	const { t } = useTranslation('lessons')
	const [openLevels, setOpenLevels] = useState({})

	const dispatch = useDispatch()
	const { user_lessons_status } = useSelector(store => store.lessons)

	const theme = useTheme()
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

	const checkIfUserLessonIsStudied = id => {
		const matchingLessons = user_lessons_status.find(
			userLesson => userLesson.lesson_id === id
		)
		return matchingLessons
	}

	const toggleLevel = level => {
		setOpenLevels(prev => ({ ...prev, [level]: !prev[level] }))
	}

	const CECR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

	const lessonsByLevel = CECR_LEVELS.reduce((acc, level) => {
		acc[level] = lessonsInfos.filter(lesson => lesson.lessonLevel === level)
		return acc
	}, {})

	// Filtrer les niveaux qui ont au moins une leçon
	const levelsWithLessons = CECR_LEVELS.filter(
		level => lessonsByLevel[level].length > 0
	)

	useEffect(() => {
		dispatch(getUserLessonsStatus())
	}, [dispatch])

	return (
		<List
			sx={{
				width: '80%',
				maxWidth: 380,
				background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
				borderRadius: 5,
				overflow: 'hidden',
				m: '0 auto',
				position: { sx: 'static', md: 'sticky' },
				top: { sx: 0, md: '120px' },
				p: 0,
				boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
				border: '1px solid rgba(102, 126, 234, 0.1)',
			}}
			component='nav'
			aria-labelledby='nested-list-subheader'>
			{levelsWithLessons.map((level, index) => {
				const levelColors = getLevelColor(level)
				return (
					<div key={level}>
						<ListItemButton
							onClick={() => toggleLevel(level)}
							sx={{
								py: 2,
								px: 2.5,
								background: levelColors.bg,
								borderLeft: `4px solid ${levelColors.border}`,
								transition: 'all 0.2s ease',
								'&:hover': {
									background: levelColors.bg.replace('15', '25'),
									transform: 'translateX(4px)',
								},
							}}>
							<ListItemIcon
								sx={{
									color: levelColors.color,
									minWidth: 40,
									fontSize: '1.4rem',
								}}>
								{getLevelIcon(level)}
							</ListItemIcon>
							<ListItemText
								primary={`${t('level')} ${level}`}
								primaryTypographyProps={{
									fontWeight: 700,
									fontSize: '1rem',
									color: levelColors.color,
								}}
							/>
							{openLevels[level] ? (
								<ExpandLess sx={{ color: levelColors.color }} />
							) : (
								<ExpandMore sx={{ color: levelColors.color }} />
							)}
						</ListItemButton>
						<Collapse in={openLevels[level]} timeout='auto' unmountOnExit>
							<List component='div' disablePadding sx={{ background: '#fafafa' }}>
								{lessonsByLevel[level].map((lesson, lessonIndex) => (
									<ListItemButton
										key={lesson.slug}
										sx={{
											pl: 4,
											pr: 2,
											py: 1.5,
											backgroundColor:
												lessonSlug === lesson.slug
													? levelColors.bg.replace('15', '30')
													: 'transparent',
											borderLeft:
												lessonSlug === lesson.slug
													? `4px solid ${levelColors.border}`
													: '4px solid transparent',
											transition: 'all 0.2s ease',
											'&:hover': {
												backgroundColor: levelColors.bg.replace('15', '20'),
												pl: 5,
											},
										}}
										onClick={() => {
											onSelectLesson(lesson.slug)
											if (isSmallScreen) {
												setOpenLevels({})
											}
										}}>
										<ListItemText
											primary={`${lessonIndex + 1}. ${lesson.titleRu}`}
											primaryTypographyProps={{
												fontWeight: lessonSlug === lesson.slug ? 700 : 500,
												fontSize: '0.95rem',
												color: lessonSlug === lesson.slug ? levelColors.color : '#4a5568',
											}}
										/>

										{checkIfUserLessonIsStudied(lesson.id) && (
											<ListItemIcon sx={{ minWidth: 30 }}>
												<CheckCircleIcon
													sx={{
														color: '#22c55e',
														fontSize: '1.2rem',
													}}
												/>
											</ListItemIcon>
										)}
									</ListItemButton>
								))}
							</List>
						</Collapse>
						{index < levelsWithLessons.length - 1 && (
							<Divider sx={{ borderBottomWidth: '1px', borderColor: '#e5e7eb' }} />
						)}
					</div>
				)
			})}
		</List>
	)
}

export default LessonsMenu
