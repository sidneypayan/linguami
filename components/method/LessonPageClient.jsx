'use client'

import { useState } from 'react'
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import LessonNavigator from '@/components/courses/LessonNavigator'
import PaywallBlock from '@/components/courses/PaywallBlock'
import UpsellModal from '@/components/courses/UpsellModal'
import { useLessonProgress, useCompleteLesson } from '@/lib/courses-client'
import { useAddXP } from '@/hooks/gamification/useAddXP'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'
import {
	CheckCircle,
	ArrowLeft,
	ArrowRight,
	Clock,
	ChevronRight,
	Target,
	Scroll,
	Zap,
	Sparkles,
	Trophy,
	Flame,
	Shield,
	// Level icons
	Sprout,
	Sword,
	Castle,
} from 'lucide-react'

const LessonPageClient = ({
	level,
	course,
	lesson,
	spokenLanguage,
	userHasAccess,
	isPremium,
	isUserLoggedIn,
}) => {
	const router = useRouterCompat()
	const t = useTranslations('common')
	const locale = useLocale()
	const { isDark } = useThemeMode()

	// Local state
	const [showUpsellModal, setShowUpsellModal] = useState(false)

	// Level config for theming
	const levelConfig = {
		beginner: {
			icon: Sprout,
			rank: '🌱 APPRENTI',
			gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
			accentColor: 'emerald',
			xpReward: 50,
		},
		intermediate: {
			icon: Sword,
			rank: '⚔️ GUERRIER',
			gradient: 'from-amber-400 via-orange-500 to-red-500',
			accentColor: 'amber',
			xpReward: 75,
		},
		advanced: {
			icon: Castle,
			rank: '🏰 MAÎTRE',
			gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
			accentColor: 'violet',
			xpReward: 100,
		},
	}

	const config = levelConfig[level?.slug] || levelConfig.beginner
	const LevelIcon = config.icon

	// React Query: Get lesson progress (supports both logged in and guest users)
	const { data: progressData } = useLessonProgress(lesson?.id, isUserLoggedIn)

	// React Query: Complete lesson mutation with optimistic updates
	const { mutate: completeLesson, isPending: isCompleting } = useCompleteLesson(isUserLoggedIn)

	// React Query: Add XP mutation
	const { mutate: addXP } = useAddXP()

	// Derived state: Is lesson completed?
	const lessonCompleted = progressData?.is_completed || false

	const handleMarkComplete = () => {
		if (!lesson) return

		// Optimistic update handled automatically by React Query
		completeLesson(lesson.id, {
			onSuccess: () => {
				toast.success(t('methode_lesson_completed_toast'))
				// Award XP for completing the lesson (only for logged in users)
				if (isUserLoggedIn) {
					addXP({
						actionType: 'course_lesson_completed',
						sourceId: `lesson-${lesson.id}`,
					})
				}

				// Check if we should show upsell modal
				const isFirstLesson = course?.course_lessons?.[0]?.id === lesson.id
				const levelIsFree = level?.is_free === true

				// Show upsell modal if: 1st lesson + level not free + user doesn't have access
				if (isFirstLesson && !levelIsFree && !userHasAccess) {
					setShowUpsellModal(true)
				}
			},
			onError: () => {
				toast.error(t('methode_save_error'))
			},
		})
	}

	const handlePurchase = () => {
		// TODO: Implement purchase flow
		logger.log('Purchase clicked')
		toast.info('Fonctionnalité de paiement à venir !')
		setShowUpsellModal(false)
	}

	const titleKey = `title_${locale}`
	const objectivesKey = `objectives_${locale}`
	const blocksKey = `blocks_${spokenLanguage}` // Use spoken language for lesson content
	const levelName = level?.[`name_${locale}`] || level?.slug

	// Get objectives in current language, fallback to objectives or objectives_fr
	const objectives =
		lesson?.[objectivesKey] || lesson?.objectives || lesson?.objectives_fr || []

	// Get blocks in spoken language (user's native language for translations)
	// Prefer blocks_fr/blocks_ru/blocks_en based on spoken language, fallback to blocks
	const blocks =
		lesson?.[blocksKey] && lesson[blocksKey].length > 0
			? lesson[blocksKey]
			: lesson?.blocks && lesson.blocks.length > 0
				? lesson.blocks
				: []

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
					'absolute bottom-1/4 -left-40 w-80 h-80 rounded-full blur-3xl',
					isDark ? 'bg-cyan-600/10' : 'bg-cyan-300/15'
				)} />
			</div>

			{/* Header */}
			<header className="pt-24 md:pt-28 pb-6 relative z-10">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumbs */}
					<nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
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
							'w-4 h-4 flex-shrink-0',
							isDark ? 'text-slate-600' : 'text-slate-400'
						)} />
						<Link
							href={`/method/${level?.slug}`}
							className={cn(
								'hover:text-violet-500 transition-colors',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}
						>
							{levelName}
						</Link>
						<ChevronRight className={cn(
							'w-4 h-4 flex-shrink-0',
							isDark ? 'text-slate-600' : 'text-slate-400'
						)} />
						<span className={cn(
							'font-semibold truncate',
							isDark ? 'text-white' : 'text-slate-900'
						)}>
							{lesson?.[titleKey]}
						</span>
					</nav>

					{/* Quest Card Header */}
					<div className={cn(
						'relative rounded-3xl overflow-hidden p-6 sm:p-8',
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

						{/* Completed banner */}
						{lessonCompleted && (
							<div className="absolute top-4 right-4 sm:top-6 sm:right-6">
								<div className={cn(
									'flex items-center gap-2 px-4 py-2 rounded-full',
									'bg-gradient-to-r from-emerald-500 to-green-600',
									'text-white font-bold text-sm shadow-lg shadow-emerald-500/30'
								)}>
									<Trophy className="w-4 h-4" />
									Quête accomplie !
								</div>
							</div>
						)}

						<div className="flex flex-col sm:flex-row sm:items-start gap-6">
							{/* Quest icon with glow */}
							<div className="relative flex-shrink-0">
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

							<div className="flex-1 min-w-0">
								{/* Rank and XP badges */}
								<div className="flex flex-wrap items-center gap-3 mb-3">
									<div className={cn(
										'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider',
										'border backdrop-blur-sm',
										isDark
											? 'bg-slate-800/80 border-slate-600 text-slate-200'
											: 'bg-slate-100/80 border-slate-200 text-slate-700'
									)}>
										{config.rank}
									</div>
									<div className={cn(
										'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold',
										'bg-amber-500/20 text-amber-400'
									)}>
										<Zap className="w-3.5 h-3.5" />
										+{config.xpReward} XP
									</div>
									{lesson?.estimated_minutes && (
										<div className={cn(
											'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs',
											isDark
												? 'bg-slate-800 text-slate-400'
												: 'bg-slate-100 text-slate-500'
										)}>
											<Clock className="w-3.5 h-3.5" />
											{lesson.estimated_minutes} min
										</div>
									)}
								</div>

								{/* Quest title */}
								<h1 className={cn(
									'text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4',
									isDark ? 'text-white' : 'text-slate-900'
								)}>
									{lesson?.[titleKey]}
								</h1>

								{/* Objectives as quest goals */}
								{objectives && objectives.length > 0 && (
									<div className={cn(
										'p-4 rounded-xl',
										isDark ? 'bg-slate-800/50' : 'bg-slate-50'
									)}>
										<div className="flex items-center gap-2 mb-3">
											<Target className={cn(
												'w-5 h-5',
												isDark ? 'text-amber-400' : 'text-amber-600'
											)} />
											<span className={cn(
												'text-sm font-bold uppercase tracking-wide',
												isDark ? 'text-slate-300' : 'text-slate-700'
											)}>
												Objectifs de quête
											</span>
										</div>
										<div className="space-y-2">
											{objectives.map((obj, index) => (
												<div
													key={index}
													className={cn(
														'flex items-center gap-3 text-sm',
														isDark ? 'text-slate-300' : 'text-slate-600'
													)}
												>
													<div className={cn(
														'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
														lessonCompleted
															? 'bg-emerald-500/20 text-emerald-400'
															: isDark
																? 'bg-slate-700 text-slate-400'
																: 'bg-slate-200 text-slate-500'
													)}>
														{lessonCompleted ? (
															<CheckCircle className="w-4 h-4" />
														) : (
															index + 1
														)}
													</div>
													<span className={lessonCompleted ? 'line-through opacity-60' : ''}>
														{obj}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10">
				{/* Show paywall if user doesn't have access */}
				{!userHasAccess ? (
					<PaywallBlock isLoggedIn={isUserLoggedIn} />
				) : (
					<>
						{/* Quest content section */}
						<div className={cn(
							'rounded-3xl overflow-hidden border-2 mb-8',
							isDark
								? 'bg-slate-900/60 border-slate-700/50'
								: 'bg-white/60 border-slate-200/50',
							'backdrop-blur-sm'
						)}>
							<div className="p-6 sm:p-8">
								{/* Lesson Navigator - Mode guidé / Vue d'ensemble */}
								<LessonNavigator
									blocks={blocks}
									lessonId={lesson?.id}
									onComplete={handleMarkComplete}
									isCompleting={isCompleting}
								/>
							</div>
						</div>

						{/* Navigation */}
						<div className={cn(
							'flex flex-col sm:flex-row justify-between gap-4 pt-6',
							'border-t',
							isDark ? 'border-slate-800' : 'border-slate-200'
						)}>
							<Button
								variant="outline"
								onClick={() => router.push(`/${locale}/method/${level?.slug}`)}
								className={cn(
									'gap-2 px-6 py-5',
									isDark
										? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
										: 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
								)}
							>
								<ArrowLeft className="w-5 h-5" />
								Retour aux quêtes
							</Button>

							{/* Next quest button */}
							<Button
								disabled
								className={cn(
									'gap-2 px-6 py-5 font-bold',
									'bg-gradient-to-r shadow-lg',
									config.gradient,
									'opacity-50 cursor-not-allowed'
								)}
							>
								Prochaine quête
								<ArrowRight className="w-5 h-5" />
							</Button>
						</div>

						{/* XP Reward reminder */}
						{!lessonCompleted && (
							<div className={cn(
								'mt-8 p-4 rounded-2xl text-center',
								'border-2 border-dashed',
								isDark
									? 'bg-amber-500/5 border-amber-500/30'
									: 'bg-amber-50 border-amber-200'
							)}>
								<div className="flex items-center justify-center gap-2 mb-1">
									<Flame className={cn(
										'w-5 h-5 animate-pulse',
										isDark ? 'text-amber-400' : 'text-amber-500'
									)} />
									<span className={cn(
										'font-bold',
										isDark ? 'text-amber-300' : 'text-amber-700'
									)}>
										Complète cette quête pour gagner {config.xpReward} XP !
									</span>
									<Flame className={cn(
										'w-5 h-5 animate-pulse',
										isDark ? 'text-amber-400' : 'text-amber-500'
									)} />
								</div>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									Parcours toutes les sections et clique sur "Terminer" pour valider
								</p>
							</div>
						)}

						{/* Completed celebration */}
						{lessonCompleted && (
							<div className={cn(
								'mt-8 p-6 rounded-2xl text-center',
								'bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10',
								'border-2',
								isDark ? 'border-emerald-500/30' : 'border-emerald-200'
							)}>
								<div className="flex items-center justify-center gap-3 mb-2">
									<Sparkles className="w-6 h-6 text-emerald-400" />
									<Trophy className="w-8 h-8 text-amber-400" />
									<Sparkles className="w-6 h-6 text-emerald-400" />
								</div>
								<h3 className={cn(
									'text-xl font-bold mb-1',
									isDark ? 'text-emerald-300' : 'text-emerald-700'
								)}>
									Quête accomplie !
								</h3>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									Tu as gagné <span className="font-bold text-amber-400">+{config.xpReward} XP</span>. Continue ton aventure !
								</p>
							</div>
						)}
					</>
				)}
			</main>

			{/* Upsell Modal */}
			{showUpsellModal && level && (
				<UpsellModal
					open={showUpsellModal}
					onClose={() => setShowUpsellModal(false)}
					levelName={level[`name_${locale}`] || level.slug}
					isPremium={isPremium}
					onPurchase={handlePurchase}
				/>
			)}
		</div>
	)
}

export default LessonPageClient
