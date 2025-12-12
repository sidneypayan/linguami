'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { useAllLessonStatuses } from '@/lib/lessons-client'
import { ChevronRight, CheckCircle, Lock, Star, Flame, Crown, Zap, Shield, Swords } from 'lucide-react'
import { cn } from '@/lib/utils'

// Level configuration with gaming theme
const LEVEL_CONFIG = {
	A1: {
		icon: Zap,
		label: 'Novice',
		gradient: 'from-emerald-400 to-green-500',
		bgGradient: 'from-emerald-500/10 to-green-500/5',
		text: 'text-emerald-500',
		textDark: 'text-emerald-400',
		border: 'border-emerald-500/30',
		glow: 'shadow-emerald-500/20',
	},
	A2: {
		icon: Shield,
		label: 'Apprentice',
		gradient: 'from-cyan-400 to-teal-500',
		bgGradient: 'from-cyan-500/10 to-teal-500/5',
		text: 'text-cyan-500',
		textDark: 'text-cyan-400',
		border: 'border-cyan-500/30',
		glow: 'shadow-cyan-500/20',
	},
	B1: {
		icon: Flame,
		label: 'Adventurer',
		gradient: 'from-amber-400 to-orange-500',
		bgGradient: 'from-amber-500/10 to-orange-500/5',
		text: 'text-amber-500',
		textDark: 'text-amber-400',
		border: 'border-amber-500/30',
		glow: 'shadow-amber-500/20',
	},
	B2: {
		icon: Swords,
		label: 'Warrior',
		gradient: 'from-orange-400 to-red-500',
		bgGradient: 'from-orange-500/10 to-red-500/5',
		text: 'text-orange-500',
		textDark: 'text-orange-400',
		border: 'border-orange-500/30',
		glow: 'shadow-orange-500/20',
	},
	C1: {
		icon: Star,
		label: 'Master',
		gradient: 'from-purple-400 to-fuchsia-500',
		bgGradient: 'from-purple-500/10 to-fuchsia-500/5',
		text: 'text-purple-500',
		textDark: 'text-purple-400',
		border: 'border-purple-500/30',
		glow: 'shadow-purple-500/20',
	},
	C2: {
		icon: Crown,
		label: 'Legend',
		gradient: 'from-yellow-400 to-amber-500',
		bgGradient: 'from-yellow-500/10 to-amber-500/5',
		text: 'text-yellow-500',
		textDark: 'text-yellow-400',
		border: 'border-yellow-500/30',
		glow: 'shadow-yellow-500/20',
	},
}

const LessonsMenu = ({ lessonsInfos, onSelectLesson, lessonSlug }) => {
	const t = useTranslations('lessons')
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const [openLevels, setOpenLevels] = useState({})

	// Get lesson title based on interface language
	const getLessonTitle = (lesson) => {
		if (locale === 'fr') return lesson.titleFr || lesson.titleEn || lesson.titleRu
		if (locale === 'en') return lesson.titleEn || lesson.titleFr || lesson.titleRu
		return lesson.titleRu || lesson.titleEn || lesson.titleFr
	}

	// Get user authentication state
	const { isUserLoggedIn } = useUserContext()

	// Fetch all lesson statuses using React Query
	const { data: userLessonStatuses = [], isLoading } = useAllLessonStatuses(isUserLoggedIn)

	// Fix hydration mismatch: sync media query only on client
	const [isSmallScreen, setIsSmallScreen] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1280px)')
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

	// Filter levels that have at least one lesson
	const levelsWithLessons = CECR_LEVELS.filter(
		(level) => lessonsByLevel[level].length > 0
	)

	// Calculate progress for each level
	const getLevelProgress = (level) => {
		const lessons = lessonsByLevel[level]
		if (lessons.length === 0) return 0
		const completed = lessons.filter(l => checkIfUserLessonIsStudied(l.id)).length
		return Math.round((completed / lessons.length) * 100)
	}

	return (
		<nav
			className={cn(
				'w-full xl:w-[380px] xl:min-w-[380px] xl:rounded-2xl overflow-hidden',
				'xl:sticky xl:top-[100px] mb-6 xl:mb-0',
				'min-h-[calc(100vh-120px)] xl:min-h-0',
				isDark
					? 'bg-slate-900 xl:bg-gradient-to-b xl:from-slate-800 xl:to-slate-900 xl:border xl:border-slate-700/50'
					: 'bg-white xl:bg-gradient-to-b xl:from-white xl:to-slate-50 xl:shadow-[0_8px_32px_rgba(102,126,234,0.15)] xl:border xl:border-indigo-100'
			)}
			aria-labelledby="lessons-menu">

			{/* Header */}
			<div className={cn(
				'p-5 border-b',
				isDark ? 'border-slate-700/50' : 'border-slate-200'
			)}>
				<h2 className={cn(
					'text-lg font-bold',
					isDark ? 'text-slate-100' : 'text-slate-800'
				)}>
					{t('pagetitle')}
				</h2>
				<p className={cn(
					'text-sm mt-1',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{lessonsInfos.length} {t('lessons_available') || 'lessons'}
				</p>
			</div>

			{/* Levels */}
			<div className="p-3 space-y-2">
				{levelsWithLessons.map((level) => {
					const config = LEVEL_CONFIG[level]
					const LevelIcon = config.icon
					const isOpen = openLevels[level]
					const progress = getLevelProgress(level)
					const completedCount = lessonsByLevel[level].filter(l => checkIfUserLessonIsStudied(l.id)).length
					const totalCount = lessonsByLevel[level].length

					return (
						<div key={level} className="relative">
							{/* Level Card */}
							<button
								onClick={() => toggleLevel(level)}
								className={cn(
									'w-full p-4 rounded-xl transition-all duration-300',
									'flex items-center gap-4',
									'group',
									isOpen
										? cn('bg-gradient-to-r', config.bgGradient, config.border, 'border')
										: cn(
											isDark
												? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'
												: 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
										),
									!isDark && !isOpen && 'hover:shadow-md',
								)}>

								{/* Level Icon */}
								<div className={cn(
									'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
									'bg-gradient-to-br',
									config.gradient,
									'shadow-lg',
									config.glow
								)}>
									<LevelIcon className="w-6 h-6 text-white" />
								</div>

								{/* Level Info */}
								<div className="flex-1 text-left min-w-0">
									<div className="flex items-center gap-2">
										<span className={cn(
											'font-bold text-lg',
											isDark ? 'text-white' : 'text-slate-800'
										)}>
											{level}
										</span>
										<span className={cn(
											'text-sm font-medium px-2 py-0.5 rounded-full',
											'bg-gradient-to-r',
											config.gradient,
											'text-white'
										)}>
											{config.label}
										</span>
									</div>

									{/* Progress bar */}
									<div className="mt-2 flex items-center gap-2">
										<div className={cn(
											'flex-1 h-1.5 rounded-full overflow-hidden',
											isDark ? 'bg-slate-700' : 'bg-slate-200'
										)}>
											<div
												className={cn('h-full rounded-full bg-gradient-to-r', config.gradient)}
												style={{ width: `${progress}%` }}
											/>
										</div>
										<span className={cn(
											'text-xs font-semibold whitespace-nowrap',
											isDark ? config.textDark : config.text
										)}>
											{completedCount}/{totalCount}
										</span>
									</div>
								</div>

								{/* Chevron */}
								<ChevronRight className={cn(
									'w-5 h-5 transition-transform duration-300 flex-shrink-0',
									isDark ? 'text-slate-400' : 'text-slate-500',
									isOpen && 'rotate-90'
								)} />
							</button>

							{/* Lessons List */}
							<div className={cn(
								'overflow-hidden transition-all duration-300',
								isOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
							)}>
								<div className={cn(
									'space-y-1 pl-2',
								)}>
									{lessonsByLevel[level].map((lesson, lessonIndex) => {
										const isSelected = lessonSlug === lesson.slug
										const isStudied = !isLoading && checkIfUserLessonIsStudied(lesson.id)

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
													'w-full flex items-center gap-3 p-3 rounded-lg',
													'transition-all duration-200 text-left',
													'group/lesson',
													isSelected
														? cn(
															'bg-gradient-to-r',
															config.gradient,
															'shadow-lg',
															config.glow
														)
														: cn(
															isDark
																? 'hover:bg-slate-800/80'
																: 'hover:bg-slate-100'
														)
												)}>

												{/* Lesson number / status */}
												<div className={cn(
													'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
													'text-sm font-bold transition-all',
													isSelected
														? 'bg-white/20 text-white'
														: isStudied
															? cn('bg-gradient-to-br', config.gradient, 'text-white')
															: cn(
																isDark
																	? 'bg-slate-700 text-slate-400 group-hover/lesson:bg-slate-600'
																	: 'bg-slate-200 text-slate-500 group-hover/lesson:bg-slate-300'
															)
												)}>
													{isStudied && !isSelected ? (
														<CheckCircle className="w-4 h-4" />
													) : (
														lessonIndex + 1
													)}
												</div>

												{/* Lesson title */}
												<span className={cn(
													'flex-1 text-sm font-medium truncate',
													isSelected
														? 'text-white'
														: isDark
															? 'text-slate-300 group-hover/lesson:text-white'
															: 'text-slate-600 group-hover/lesson:text-slate-900'
												)}>
													{getLessonTitle(lesson)}
												</span>

												{/* Completed badge */}
												{isStudied && !isSelected && (
													<span className={cn(
														'text-xs font-semibold',
														isDark ? config.textDark : config.text
													)}>
														✓
													</span>
												)}
											</button>
										)
									})}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</nav>
	)
}

export default LessonsMenu
