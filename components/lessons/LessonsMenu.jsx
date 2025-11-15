import { useTranslations, useLocale } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getUserLessonsStatus } from '@/features/lessons/lessonsSlice'
import {
	Box,
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
	const t = useTranslations('lessons')
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
				width: { xs: '100%', md: '80%' },
				maxWidth: { xs: '100%', md: 400 },
				background: 'white',
				borderRadius: { xs: 0, md: 4 },
				overflow: 'hidden',
				m: { xs: 0, md: '0 auto' },
				position: { xs: 'static', md: 'sticky' },
				top: { xs: 0, md: '100px' },
				p: 0,
				mb: { xs: 3, md: 0 },
				boxShadow: { xs: 'none', md: '0 8px 32px rgba(102, 126, 234, 0.15)' },
				border: { xs: 'none', md: '1px solid rgba(102, 126, 234, 0.1)' },
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
								py: 2.5,
								px: 3,
								background: openLevels[level]
									? `linear-gradient(135deg, ${levelColors.bg.replace('15', '20')}, ${levelColors.bg.replace('15', '10')})`
									: levelColors.bg,
								borderLeft: `5px solid ${levelColors.border}`,
								transition: 'all 0.3s ease',
								position: 'relative',
								'&::after': openLevels[level] ? {
									content: '""',
									position: 'absolute',
									bottom: 0,
									left: 0,
									right: 0,
									height: '2px',
									background: `linear-gradient(90deg, ${levelColors.border}, transparent)`,
								} : {},
								'&:hover': {
									background: `linear-gradient(135deg, ${levelColors.bg.replace('15', '30')}, ${levelColors.bg.replace('15', '15')})`,
									transform: 'translateX(4px)',
									boxShadow: `0 4px 12px ${levelColors.border}30`,
								},
							}}>
							<Box
								sx={{
									width: 44,
									height: 44,
									borderRadius: 2.5,
									background: `linear-gradient(135deg, ${levelColors.bg.replace('15', '40')}, ${levelColors.bg.replace('15', '20')})`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									mr: 2,
									border: `2px solid ${levelColors.border}30`,
									boxShadow: `0 2px 8px ${levelColors.border}20`,
								}}>
								<ListItemIcon
									sx={{
										color: levelColors.color,
										minWidth: 'auto',
										fontSize: '1.5rem',
										display: 'flex',
										justifyContent: 'center',
									}}>
									{getLevelIcon(level)}
								</ListItemIcon>
							</Box>
							<ListItemText
								primary={`${t('level')} ${level}`}
								secondary={`${lessonsByLevel[level].length} ${lessonsByLevel[level].length > 1 ? 'leçons' : 'leçon'}`}
								primaryTypographyProps={{
									fontWeight: 800,
									fontSize: '1.125rem',
									color: levelColors.color,
									letterSpacing: '-0.3px',
								}}
								secondaryTypographyProps={{
									fontWeight: 600,
									fontSize: '0.8125rem',
									color: levelColors.color,
									opacity: 0.7,
									mt: 0.25,
								}}
							/>
							{openLevels[level] ? (
								<ExpandLess
									sx={{
										color: levelColors.color,
										fontSize: '1.75rem',
										transition: 'transform 0.3s ease',
									}}
								/>
							) : (
								<ExpandMore
									sx={{
										color: levelColors.color,
										fontSize: '1.75rem',
										transition: 'transform 0.3s ease',
									}}
								/>
							)}
						</ListItemButton>
						<Collapse in={openLevels[level]} timeout='auto' unmountOnExit>
							<List
								component='div'
								disablePadding
								sx={{
									background: `linear-gradient(180deg, ${levelColors.bg.replace('15', '08')}, white)`,
									py: 1,
								}}>
								{lessonsByLevel[level].map((lesson, lessonIndex) => (
									<ListItemButton
										key={lesson.slug}
										sx={{
											pl: 5,
											pr: 3,
											py: 2,
											mx: 2,
											mb: 1,
											borderRadius: 2,
											backgroundColor:
												lessonSlug === lesson.slug
													? levelColors.bg.replace('15', '40')
													: 'transparent',
											borderLeft:
												lessonSlug === lesson.slug
													? `4px solid ${levelColors.border}`
													: '4px solid transparent',
											border: lessonSlug === lesson.slug
												? `1px solid ${levelColors.border}40`
												: '1px solid transparent',
											boxShadow: lessonSlug === lesson.slug
												? `0 2px 8px ${levelColors.border}20`
												: 'none',
											transition: 'all 0.3s ease',
											'&:hover': {
												backgroundColor: levelColors.bg.replace('15', '25'),
												transform: 'translateX(4px)',
												borderLeftColor: levelColors.border,
												boxShadow: `0 2px 8px ${levelColors.border}15`,
											},
										}}
										onClick={() => {
											onSelectLesson(lesson.slug)
											if (isSmallScreen) {
												setOpenLevels({})
											}
										}}>
										<Box
											sx={{
												width: 28,
												height: 28,
												borderRadius: 1.5,
												background: lessonSlug === lesson.slug
													? `linear-gradient(135deg, ${levelColors.color}, ${levelColors.border})`
													: levelColors.bg.replace('15', '30'),
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												mr: 2,
												flexShrink: 0,
											}}>
											<Box
												sx={{
													color: lessonSlug === lesson.slug ? 'white' : levelColors.color,
													fontSize: '0.75rem',
													fontWeight: 800,
												}}>
												{lessonIndex + 1}
											</Box>
										</Box>
										<ListItemText
											primary={lesson.titleRu}
											primaryTypographyProps={{
												fontWeight: lessonSlug === lesson.slug ? 700 : 600,
												fontSize: '0.9375rem',
												color: lessonSlug === lesson.slug ? levelColors.color : '#4a5568',
												letterSpacing: '-0.2px',
											}}
										/>

										{checkIfUserLessonIsStudied(lesson.id) && (
											<CheckCircleIcon
												sx={{
													color: '#22c55e',
													fontSize: '1.5rem',
													ml: 1,
													filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
												}}
											/>
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
