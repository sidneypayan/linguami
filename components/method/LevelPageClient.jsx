'use client'

import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Link } from '@/i18n/navigation'
import {
	CheckCircle,
	Clock,
	ArrowLeft,
	ChevronRight,
	Scroll,
	Star,
	Flame,
	Lock,
	Sparkles,
	Trophy,
	Target,
	Zap,
	// Level icons
	Sprout,
	Sword,
	Castle,
} from 'lucide-react'

const LevelPageClient = ({
	level,
	course,
	lessons,
	userProgress,
	isUserLoggedIn,
}) => {
	const router = useRouterCompat()
	const t = useTranslations('common')
	const locale = useLocale()
	const { isDark } = useThemeMode()

	const titleKey = `title_${locale}`
	const descriptionKey = `description_${locale}`
	const levelName = level?.[`name_${locale}`] || level?.slug

	// Level config for theming
	const levelConfig = {
		beginner: {
			icon: Sprout,
			rank: '🌱 APPRENTI',
			gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
			accentColor: 'emerald',
			xpPerQuest: 50,
		},
		intermediate: {
			icon: Sword,
			rank: '⚔️ GUERRIER',
			gradient: 'from-amber-400 via-orange-500 to-red-500',
			accentColor: 'amber',
			xpPerQuest: 75,
		},
		advanced: {
			icon: Castle,
			rank: '🏰 MAÎTRE',
			gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
			accentColor: 'violet',
			xpPerQuest: 100,
		},
	}

	const config = levelConfig[level?.slug] || levelConfig.beginner
	const LevelIcon = config.icon

	// Calculate progress
	const completedLessons = userProgress.filter((p) => p.is_completed).length
	const totalLessons = lessons.length
	const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
	const totalXpEarned = completedLessons * config.xpPerQuest
	const totalXpPossible = totalLessons * config.xpPerQuest

	// Check if lesson is completed
	const isLessonCompleted = (lessonId) => {
		return userProgress.some((p) => p.lesson_id === lessonId && p.is_completed)
	}

	// Render stars for XP indicator
	const renderXpStars = (count) => {
		return (
			<div className="flex items-center gap-0.5">
				{[1, 2, 3].map((star) => (
					<Star
						key={star}
						className={cn(
							'w-3 h-3',
							star <= count
								? 'fill-amber-400 text-amber-400'
								: isDark ? 'text-slate-700' : 'text-slate-300'
						)}
					/>
				))}
			</div>
		)
	}

	return (
		<div className={cn(
			'min-h-screen relative overflow-hidden',
			isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'
		)}>
			{/* Background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className={cn(
					'absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl',
					level?.slug === 'beginner' && (isDark ? 'bg-emerald-600/20' : 'bg-emerald-300/30'),
					level?.slug === 'intermediate' && (isDark ? 'bg-amber-600/20' : 'bg-amber-300/30'),
					level?.slug === 'advanced' && (isDark ? 'bg-violet-600/20' : 'bg-violet-300/30')
				)} />
				<div className={cn(
					'absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl',
					isDark ? 'bg-cyan-600/10' : 'bg-cyan-300/15'
				)} />
			</div>

			{/* Header */}
			<header className="pt-24 md:pt-28 pb-8 relative z-10">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumbs */}
					<nav className="flex items-center gap-2 text-sm mb-8">
						<Link
							href="/method"
							className={cn(
								'flex items-center gap-1.5 hover:text-violet-500 transition-colors',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}
						>
							<Scroll className="w-4 h-4" />
							{t('methode_title')}
						</Link>
						<ChevronRight className={cn(
							'w-4 h-4',
							isDark ? 'text-slate-600' : 'text-slate-400'
						)} />
						<span className={cn(
							'font-semibold',
							isDark ? 'text-white' : 'text-slate-900'
						)}>
							{levelName}
						</span>
					</nav>

					{/* Hero section */}
					<div className={cn(
						'relative rounded-3xl overflow-hidden p-6 sm:p-8 mb-8',
						'border-2',
						isDark
							? 'bg-slate-900/80 border-slate-700/50'
							: 'bg-white/80 border-slate-200/50',
						'backdrop-blur-sm'
					)}>
						{/* Top gradient bar */}
						<div className={cn(
							'absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r',
							config.gradient
						)} />

						{/* Decorative corner */}
						<div className={cn(
							'absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-bl',
							config.gradient
						)} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />

						<div className="flex flex-col md:flex-row md:items-start gap-6">
							{/* Icon and title */}
							<div className="flex items-start gap-4 flex-1">
								{/* Icon with glow */}
								<div className="relative">
									<div className={cn(
										'absolute inset-0 rounded-2xl blur-xl opacity-50',
										`bg-gradient-to-br ${config.gradient}`
									)} />
									<div className={cn(
										'relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center',
										'bg-gradient-to-br shadow-2xl',
										config.gradient
									)}>
										<LevelIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
									</div>
								</div>

								<div className="flex-1">
									{/* Rank badge */}
									<div className={cn(
										'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3',
										'border backdrop-blur-sm',
										isDark
											? 'bg-slate-800/80 border-slate-600 text-slate-200'
											: 'bg-slate-100/80 border-slate-200 text-slate-700'
									)}>
										{config.rank}
									</div>

									{/* Title */}
									<h1 className={cn(
										'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3',
										isDark ? 'text-white' : 'text-slate-900'
									)}>
										{levelName}
									</h1>

									{/* Description */}
									{level?.[descriptionKey] && (
										<p className={cn(
											'text-base sm:text-lg leading-relaxed max-w-2xl',
											isDark ? 'text-slate-400' : 'text-slate-600'
										)}>
											{level[descriptionKey]}
										</p>
									)}
								</div>
							</div>

							{/* Stats panel */}
							<div className={cn(
								'flex flex-row md:flex-col gap-4 p-4 rounded-2xl',
								isDark ? 'bg-slate-800/50' : 'bg-slate-50'
							)}>
								{/* Quests count */}
								<div className="text-center flex-1 md:flex-none">
									<div className={cn(
										'text-2xl sm:text-3xl font-black',
										`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`
									)}>
										{totalLessons}
									</div>
									<div className={cn(
										'text-xs font-medium uppercase tracking-wide',
										isDark ? 'text-slate-500' : 'text-slate-400'
									)}>
										Quêtes
									</div>
								</div>

								{/* Divider */}
								<div className={cn(
									'w-px md:w-full md:h-px',
									isDark ? 'bg-slate-700' : 'bg-slate-200'
								)} />

								{/* XP to earn */}
								<div className="text-center flex-1 md:flex-none">
									<div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
										{totalXpPossible}
									</div>
									<div className={cn(
										'text-xs font-medium uppercase tracking-wide',
										isDark ? 'text-slate-500' : 'text-slate-400'
									)}>
										XP Total
									</div>
								</div>
							</div>
						</div>

						{/* Progress section */}
						{isUserLoggedIn && totalLessons > 0 && (
							<div className={cn(
								'mt-6 pt-6 border-t',
								isDark ? 'border-slate-700/50' : 'border-slate-200/50'
							)}>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<Trophy className={cn(
											'w-5 h-5',
											isDark ? 'text-amber-400' : 'text-amber-500'
										)} />
										<span className={cn(
											'font-semibold',
											isDark ? 'text-white' : 'text-slate-900'
										)}>
											Progression
										</span>
									</div>
									<div className="flex items-center gap-4">
										<span className={cn(
											'text-sm',
											isDark ? 'text-slate-400' : 'text-slate-500'
										)}>
											{completedLessons} / {totalLessons} quêtes
										</span>
										<span className="text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
											{totalXpEarned} XP
										</span>
									</div>
								</div>
								<div className="relative">
									<Progress
										value={progressPercentage}
										className={cn(
											'h-3 rounded-full',
											isDark ? 'bg-slate-700' : 'bg-slate-200'
										)}
									/>
									{/* Progress glow effect */}
									{progressPercentage > 0 && (
										<div
											className={cn(
												'absolute top-0 left-0 h-3 rounded-full blur-sm opacity-50 bg-gradient-to-r',
												config.gradient
											)}
											style={{ width: `${progressPercentage}%` }}
										/>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Quest List */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
				{/* Section header */}
				<div className="flex items-center gap-3 mb-8">
					<Scroll className={cn(
						'w-6 h-6',
						isDark ? 'text-amber-400' : 'text-amber-600'
					)} />
					<h2 className={cn(
						'text-2xl sm:text-3xl font-bold',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						Quêtes disponibles
					</h2>
				</div>

				{/* Quest cards - Timeline style */}
				<div className="relative">
					{/* Timeline line */}
					<div className={cn(
						'absolute left-6 top-0 bottom-0 w-0.5 hidden sm:block',
						isDark ? 'bg-slate-800' : 'bg-slate-200'
					)} />

					<div className="space-y-4">
						{lessons.map((lesson, index) => {
							const isCompleted = isLessonCompleted(lesson.id)
							const lessonTitle = lesson[titleKey]
							const objectivesKey = `objectives_${locale}`
							const lessonObjectives = lesson[objectivesKey] || lesson.objectives || lesson.objectives_fr || []
							const xpReward = config.xpPerQuest

							return (
								<div
									key={lesson.id}
									className="group relative sm:pl-16"
									onClick={() => router.push(`/${locale}/method/${level.slug}/${lesson.slug}`)}
								>
									{/* Timeline node */}
									<div className={cn(
										'absolute left-4 top-6 w-5 h-5 rounded-full border-4 hidden sm:block transition-all duration-300 z-10',
										isCompleted
											? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
											: isDark
												? 'bg-slate-900 border-slate-700 group-hover:border-violet-500'
												: 'bg-white border-slate-300 group-hover:border-violet-400'
									)}>
										{isCompleted && (
											<CheckCircle className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
										)}
									</div>

									{/* Quest card */}
									<div className={cn(
										'relative cursor-pointer rounded-2xl overflow-hidden',
										'border-2 transition-all duration-300',
										'hover:scale-[1.01] hover:-translate-y-1',
										isCompleted
											? isDark
												? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50'
												: 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
											: isDark
												? 'bg-slate-900/80 border-slate-700/50 hover:border-violet-500/50'
												: 'bg-white/80 border-slate-200 hover:border-violet-300',
										'backdrop-blur-sm',
										'hover:shadow-xl',
										isDark ? 'hover:shadow-violet-500/10' : 'hover:shadow-violet-200/50'
									)}>
										<div className="p-5 sm:p-6">
											<div className="flex items-start gap-4">
												{/* Quest number / status */}
												<div className={cn(
													'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
													'font-bold text-xl transition-all duration-300',
													isCompleted
														? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
														: `bg-gradient-to-br ${config.gradient} text-white shadow-lg`,
													'group-hover:scale-110 group-hover:rotate-3'
												)}>
													{isCompleted ? (
														<CheckCircle className="w-7 h-7" />
													) : (
														<span className="drop-shadow-lg">{index + 1}</span>
													)}
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													{/* Title row */}
													<div className="flex items-start justify-between gap-4 mb-2">
														<h3 className={cn(
															'text-lg sm:text-xl font-bold group-hover:text-violet-500 transition-colors',
															isDark ? 'text-white' : 'text-slate-900'
														)}>
															{lessonTitle}
														</h3>

														{/* XP badge */}
														<div className={cn(
															'flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0',
															isCompleted
																? 'bg-emerald-500/20 text-emerald-400'
																: 'bg-amber-500/20 text-amber-400'
														)}>
															<Zap className="w-4 h-4" />
															{isCompleted ? `+${xpReward}` : xpReward} XP
														</div>
													</div>

													{/* Objectives as quest objectives */}
													{lessonObjectives && lessonObjectives.length > 0 && (
														<div className="flex flex-wrap gap-2 mb-3">
															{lessonObjectives.slice(0, 3).map((obj, idx) => (
																<div
																	key={idx}
																	className={cn(
																		'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full',
																		isDark
																			? 'bg-slate-800 text-slate-300'
																			: 'bg-slate-100 text-slate-600'
																	)}
																>
																	<Target className="w-3 h-3" />
																	{obj}
																</div>
															))}
														</div>
													)}

													{/* Bottom row */}
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-4">
															{lesson.estimated_minutes && (
																<div className={cn(
																	'flex items-center gap-1.5 text-sm',
																	isDark ? 'text-slate-500' : 'text-slate-400'
																)}>
																	<Clock className="w-4 h-4" />
																	{lesson.estimated_minutes} min
																</div>
															)}
															{isCompleted && (
																<div className="flex items-center gap-1.5 text-sm text-emerald-500">
																	<Sparkles className="w-4 h-4" />
																	Complétée
																</div>
															)}
														</div>

														{/* Arrow */}
														<ChevronRight className={cn(
															'w-6 h-6 transition-transform group-hover:translate-x-2',
															isDark ? 'text-slate-600' : 'text-slate-400'
														)} />
													</div>
												</div>
											</div>
										</div>

										{/* Completed glow effect */}
										{isCompleted && (
											<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* No lessons */}
				{lessons.length === 0 && (
					<div className={cn(
						'text-center py-20 rounded-3xl border-2 border-dashed',
						isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'
					)}>
						<Scroll className={cn(
							'w-20 h-20 mx-auto mb-6',
							isDark ? 'text-slate-700' : 'text-slate-300'
						)} />
						<p className={cn(
							'text-xl font-semibold mb-2',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							Aucune quête disponible
						</p>
						<p className={cn(
							'text-sm',
							isDark ? 'text-slate-600' : 'text-slate-400'
						)}>
							De nouvelles aventures arrivent bientôt...
						</p>
					</div>
				)}

				{/* Back button */}
				<div className="mt-12">
					<Button
						variant="outline"
						onClick={() => router.push(`/${locale}/method`)}
						className={cn(
							'gap-2 px-6 py-5',
							isDark
								? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
								: 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
						)}
					>
						<ArrowLeft className="w-5 h-5" />
						Retour aux royaumes
					</Button>
				</div>
			</main>
		</div>
	)
}

export default LevelPageClient
