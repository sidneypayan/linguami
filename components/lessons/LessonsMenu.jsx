'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useUserContext } from '@/context/user'
import { useAllLessonStatuses } from '@/lib/lessons-client'
import { ChevronDown, ChevronUp, CheckCircle, Inbox, Sprout, TreeDeciduous, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const getLevelIcon = (level) => {
	const iconClass = "h-5 w-5"
	switch (level) {
		case 'A1':
			return <Sprout className={iconClass} />
		case 'A2':
			return <Sprout className={cn(iconClass, "scale-110")} />
		case 'B1':
			return <TreeDeciduous className={iconClass} />
		case 'B2':
			return <TreeDeciduous className={cn(iconClass, "scale-110")} />
		case 'C1':
			return <GraduationCap className={iconClass} />
		case 'C2':
			return <GraduationCap className={cn(iconClass, "scale-110")} />
		default:
			return <Inbox className={iconClass} />
	}
}

const getLevelColors = (level) => {
	switch (level) {
		case 'A1':
			return {
				bg: 'bg-green-500/10',
				bgHover: 'hover:bg-green-500/20',
				text: 'text-green-600',
				border: 'border-green-400',
				shadow: 'shadow-green-400/20',
				gradient: 'from-green-500/20 to-green-500/10'
			}
		case 'A2':
			return {
				bg: 'bg-cyan-500/10',
				bgHover: 'hover:bg-cyan-500/20',
				text: 'text-cyan-600',
				border: 'border-cyan-400',
				shadow: 'shadow-cyan-400/20',
				gradient: 'from-cyan-500/20 to-cyan-500/10'
			}
		case 'B1':
			return {
				bg: 'bg-amber-500/10',
				bgHover: 'hover:bg-amber-500/20',
				text: 'text-amber-600',
				border: 'border-amber-400',
				shadow: 'shadow-amber-400/20',
				gradient: 'from-amber-500/20 to-amber-500/10'
			}
		case 'B2':
			return {
				bg: 'bg-orange-500/10',
				bgHover: 'hover:bg-orange-500/20',
				text: 'text-orange-600',
				border: 'border-orange-400',
				shadow: 'shadow-orange-400/20',
				gradient: 'from-orange-500/20 to-orange-500/10'
			}
		case 'C1':
			return {
				bg: 'bg-fuchsia-500/10',
				bgHover: 'hover:bg-fuchsia-500/20',
				text: 'text-fuchsia-600',
				border: 'border-fuchsia-400',
				shadow: 'shadow-fuchsia-400/20',
				gradient: 'from-fuchsia-500/20 to-fuchsia-500/10'
			}
		case 'C2':
			return {
				bg: 'bg-violet-500/10',
				bgHover: 'hover:bg-violet-500/20',
				text: 'text-violet-600',
				border: 'border-violet-400',
				shadow: 'shadow-violet-400/20',
				gradient: 'from-violet-500/20 to-violet-500/10'
			}
		default:
			return {
				bg: 'bg-indigo-500/10',
				bgHover: 'hover:bg-indigo-500/20',
				text: 'text-indigo-600',
				border: 'border-indigo-400',
				shadow: 'shadow-indigo-400/20',
				gradient: 'from-indigo-500/20 to-indigo-500/10'
			}
	}
}

const LessonsMenu = ({ lessonsInfos, onSelectLesson, lessonSlug }) => {
	const t = useTranslations('lessons')
	const [openLevels, setOpenLevels] = useState({})

	// Get user authentication state
	const { isUserLoggedIn } = useUserContext()

	// Fetch all lesson statuses using React Query
	const { data: userLessonStatuses = [], isLoading } = useAllLessonStatuses(isUserLoggedIn)

	// Fix hydration mismatch: sync media query only on client
	const [isSmallScreen, setIsSmallScreen] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)')
		setIsSmallScreen(mediaQuery.matches)

		const handler = (e) => setIsSmallScreen(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	const checkIfUserLessonIsStudied = (id) => {
		const matchingLessons = userLessonStatuses.find(
			(userLesson) => userLesson.lesson_id === id && userLesson.is_studied
		)
		return !!matchingLessons
	}

	const toggleLevel = (level) => {
		setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }))
	}

	const CECR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

	const lessonsByLevel = CECR_LEVELS.reduce((acc, level) => {
		acc[level] = lessonsInfos.filter((lesson) => lesson.lessonLevel === level)
		return acc
	}, {})

	// Filtrer les niveaux qui ont au moins une leçon
	const levelsWithLessons = CECR_LEVELS.filter(
		(level) => lessonsByLevel[level].length > 0
	)

	return (
		<nav
			className={cn(
				'w-full md:w-4/5 md:max-w-[400px] bg-white md:rounded-2xl overflow-hidden',
				'md:sticky md:top-[100px] p-0 mb-6 md:mb-0',
				'md:shadow-[0_8px_32px_rgba(102,126,234,0.15)] md:border md:border-indigo-500/10'
			)}
			aria-labelledby="lessons-menu">
			{levelsWithLessons.map((level, index) => {
				const colors = getLevelColors(level)
				return (
					<div key={level}>
						{/* Level Header */}
						<button
							onClick={() => toggleLevel(level)}
							className={cn(
								'w-full flex items-center py-4 px-4 transition-all duration-300',
								'border-l-[5px]',
								colors.border,
								openLevels[level]
									? `bg-gradient-to-r ${colors.gradient}`
									: colors.bg,
								colors.bgHover,
								'hover:translate-x-1 hover:shadow-lg',
								colors.shadow,
								'relative',
								openLevels[level] && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-current after:to-transparent'
							)}>
							{/* Icon container */}
							<div
								className={cn(
									'w-11 h-11 rounded-xl flex items-center justify-center mr-3',
									'bg-gradient-to-br',
									colors.gradient,
									'border-2',
									colors.border,
									'border-opacity-30',
									'shadow-sm',
									colors.text
								)}>
								{getLevelIcon(level)}
							</div>

							{/* Text */}
							<div className="flex-1 text-left">
								<p className={cn('font-extrabold text-lg tracking-tight', colors.text)}>
									{t('level')} {level}
								</p>
								<p className={cn('text-sm font-semibold opacity-70', colors.text)}>
									{lessonsByLevel[level].length} {lessonsByLevel[level].length > 1 ? 'leçons' : 'leçon'}
								</p>
							</div>

							{/* Chevron */}
							{openLevels[level] ? (
								<ChevronUp className={cn('h-6 w-6 transition-transform', colors.text)} />
							) : (
								<ChevronDown className={cn('h-6 w-6 transition-transform', colors.text)} />
							)}
						</button>

						{/* Lessons List */}
						<div
							className={cn(
								'overflow-hidden transition-all duration-300',
								openLevels[level] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
							)}>
							<div className={cn('py-2 bg-gradient-to-b', colors.gradient.replace('20', '05'), 'to-white')}>
								{lessonsByLevel[level].map((lesson, lessonIndex) => {
									const isSelected = lessonSlug === lesson.slug
									return (
										<button
											key={lesson.slug}
											onClick={() => {
												onSelectLesson(lesson.slug)
												if (isSmallScreen) {
													setOpenLevels({})
												}
											}}
											className={cn(
												'w-[calc(100%-16px)] flex items-center pl-6 pr-4 py-3 mx-2 mb-1 rounded-lg',
												'transition-all duration-300 text-left',
												'border-l-4',
												isSelected
													? cn(colors.bg.replace('10', '30'), colors.border, 'border shadow', colors.shadow)
													: 'border-transparent hover:border-current',
												!isSelected && colors.bgHover,
												'hover:translate-x-1'
											)}>
											{/* Lesson number */}
											<div
												className={cn(
													'w-7 h-7 rounded-md flex items-center justify-center mr-3 flex-shrink-0',
													'text-xs font-extrabold',
													isSelected
														? cn('bg-gradient-to-br', colors.text.replace('text', 'from'), colors.border.replace('border', 'to'), 'text-white')
														: cn(colors.bg.replace('10', '25'), colors.text)
												)}>
												{lessonIndex + 1}
											</div>

											{/* Lesson title */}
											<span
												className={cn(
													'flex-1 text-[0.9375rem] tracking-tight',
													isSelected ? cn('font-bold', colors.text) : 'font-semibold text-slate-600'
												)}>
												{lesson.titleRu}
											</span>

											{/* Check icon if studied */}
											{!isLoading && checkIfUserLessonIsStudied(lesson.id) && (
												<CheckCircle
													className="h-5 w-5 text-green-500 ml-2 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(34,197,94,0.3)]"
												/>
											)}
										</button>
									)
								})}
							</div>
						</div>

						{/* Divider */}
						{index < levelsWithLessons.length - 1 && (
							<div className="border-b border-gray-200" />
						)}
					</div>
				)
			})}
		</nav>
	)
}

export default LessonsMenu
