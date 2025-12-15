import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import BlockRenderer from './blocks/BlockRenderer'
import LessonVocabularyImport from './LessonVocabularyImport'
import { logger } from '@/utils/logger'
import {
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	Clock,
	Compass,
	Map,
	ChevronDown,
	Loader2,
	Flame,
	Route,
	Shield,
	Sparkles,
	Star,
	Scroll,
	Zap,
	Trophy,
} from 'lucide-react'

// Configuration des types de blocs avec icones et couleurs gaming
const blockConfig = {
	dialogue: {
		icon: Scroll,
		label: 'Dialogue',
		gradient: 'from-blue-400 to-cyan-500',
		bgGlow: 'blue',
	},
	grammar: {
		icon: Shield,
		label: 'Grammaire',
		gradient: 'from-violet-400 to-purple-500',
		bgGlow: 'violet',
	},
	vocabulary: {
		icon: Star,
		label: 'Vocabulaire',
		gradient: 'from-emerald-400 to-green-500',
		bgGlow: 'emerald',
	},
	culture: {
		icon: Compass,
		label: 'Culture',
		gradient: 'from-cyan-400 to-teal-500',
		bgGlow: 'cyan',
	},
	tip: {
		icon: Zap,
		label: 'Conseil',
		gradient: 'from-amber-400 to-yellow-500',
		bgGlow: 'amber',
	},
	conversation: {
		icon: Scroll,
		label: 'Conversation',
		gradient: 'from-orange-400 to-red-500',
		bgGlow: 'orange',
	},
	summary: {
		icon: CheckCircle,
		label: 'Resume',
		gradient: 'from-green-400 to-emerald-500',
		bgGlow: 'green',
	},
	exerciseInline: {
		icon: Flame,
		label: 'Exercice',
		gradient: 'from-purple-400 to-pink-500',
		bgGlow: 'purple',
	},
	audio: {
		icon: Sparkles,
		label: 'Audio',
		gradient: 'from-pink-400 to-rose-500',
		bgGlow: 'pink',
	},
	pronunciation: {
		icon: Sparkles,
		label: 'Prononciation',
		gradient: 'from-indigo-400 to-blue-500',
		bgGlow: 'indigo',
	},
}

/**
 * LessonNavigator - Navigateur gaming avec barre d'XP et cartes de competence
 */
const LessonNavigator = ({ blocks = [], lesson, lessonId, onComplete, isCompleting = false, isLessonCompleted = false, locale }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const { userLearningLanguage } = useUserContext()

	// Filtrer les blocs summary - ils seront remplacés par le vocab import
	const filteredBlocks = blocks.filter(block => block.type !== 'summary')

	const [viewMode, setViewMode] = useState('guided')
	const [currentSection, setCurrentSection] = useState(0)
	const [completedSections, setCompletedSections] = useState(() => new Array(filteredBlocks.length).fill(false))
	const [openAccordions, setOpenAccordions] = useState([0])
	const [isHydrated, setIsHydrated] = useState(false)

	// Charger la progression depuis localStorage après l'hydratation
	useEffect(() => {
		if (lessonId) {
			try {
				const savedProgress = localStorage.getItem(`lesson_progress_${lessonId}`)
				if (savedProgress) {
					const { section, completed } = JSON.parse(savedProgress)
					if (typeof section === 'number') {
						setCurrentSection(section)
					}
					if (completed && completed.length === filteredBlocks.length) {
						setCompletedSections(completed)
					}
				}
			} catch (e) {
				// Ignore errors
			}
		}
		setIsHydrated(true)
	}, [lessonId, filteredBlocks.length])

	// Sauvegarder la progression
	useEffect(() => {
		if (isHydrated && lessonId) {
			const progress = {
				section: currentSection,
				completed: completedSections,
			}
			localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(progress))
		}
	}, [currentSection, completedSections, lessonId, isHydrated])

	const completedCount = completedSections.filter(Boolean).length
	const totalSteps = filteredBlocks.length + 1 // +1 pour le step vocab import (remplace summary)
	const progressPercent = (completedCount / filteredBlocks.length) * 100

	const getBlockTitle = (block, index) => {
		if (block.title) return block.title
		const config = blockConfig[block.type]
		if (config) return t(`methode_block_${block.type}`) || config.label
		return `Section ${index + 1}`
	}

	const getBlockEstimatedTime = (block) => {
		const timeByType = {
			dialogue: 3,
			grammar: 5,
			vocabulary: 3,
			culture: 2,
			tip: 1,
			conversation: 2,
			summary: 2,
			exerciseInline: 3,
			audio: 3,
			pronunciation: 4,
		}
		return block.estimatedTime || timeByType[block.type] || 2
	}

	const handleNext = () => {
		// Ne pas permettre de naviguer au-delà du dernier step
		if (currentSection < totalSteps - 1) {
			// Si on est sur un bloc normal, le marquer comme complété
			if (currentSection < filteredBlocks.length) {
				const newCompleted = [...completedSections]
				newCompleted[currentSection] = true
				setCompletedSections(newCompleted)
			}
			setCurrentSection(currentSection + 1)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	// Fonction séparée pour terminer la leçon (appelée uniquement sur le dernier step)
	const handleCompleteLesson = () => {
		// Ne rien faire si déjà complété ou en cours de completion
		if (isLessonCompleted || isCompleting) return

		if (onComplete) {
			onComplete()
		}
	}

	const handlePrevious = () => {
		if (currentSection > 0) {
			setCurrentSection(currentSection - 1)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const toggleAccordion = (index) => {
		setOpenAccordions(prev =>
			prev.includes(index)
				? prev.filter(i => i !== index)
				: [...prev, index]
		)
	}

	// Rendu du mode guide avec theme gaming
	const renderGuidedMode = () => {
		// Attendre que les blocs soient chargés
		if (filteredBlocks.length === 0) return null

		// Le dernier step est l'import de vocabulaire (remplace summary)
		const isVocabImportStep = currentSection === filteredBlocks.length
		const isLastSection = currentSection === totalSteps - 1

		const currentBlock = isVocabImportStep ? null : filteredBlocks[currentSection]

		const allCompleted = completedSections.every(Boolean)

		// Config pour le step d'import
		const vocabImportConfig = {
			icon: Star,
			label: t('methode_import_vocabulary'),
			gradient: 'from-emerald-400 to-teal-500',
			bgGlow: 'emerald',
		}

		const config = isVocabImportStep
			? vocabImportConfig
			: (blockConfig[currentBlock?.type] || blockConfig.dialogue)
		const BlockIcon = config.icon

		return (
			<div className="animate-in fade-in duration-300">
				{/* Barre d'XP Gaming - more compact on mobile */}
				<div className={cn(
					'relative mb-3 sm:mb-8 p-2 sm:p-5 rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
					isDark
						? 'bg-gradient-to-r from-slate-900/90 via-violet-950/50 to-slate-900/90 border-violet-500/30'
						: 'bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border-violet-300'
				)}>
					{/* Effet de brillance */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

					<div className="relative z-10">
						<div className="flex justify-between items-center mb-2 sm:mb-4">
							<div className="flex items-center gap-2 sm:gap-3">
								<Route className={cn(
									'w-6 h-6 sm:w-7 sm:h-7',
									isDark ? 'text-violet-400' : 'text-violet-500'
								)} />
								<div>
									<span className={cn(
										'text-xs sm:text-sm font-bold uppercase tracking-wider block',
										isDark ? 'text-violet-400' : 'text-violet-600'
									)}>
										{t('methode_step')} {currentSection + 1} / {totalSteps}
									</span>
									<p className={cn(
										'text-xs sm:text-sm hidden sm:block',
										isDark ? 'text-slate-400' : 'text-slate-600'
									)}>
										{completedCount} {t('methode_completed_sections')}
									</p>
								</div>
							</div>

							{/* Navigation rapide - Desktop */}
							<div className="hidden sm:flex items-center gap-3">
								{/* Bouton Previous - masqué sur la première step */}
								{currentSection > 0 && (
									<button
										onClick={handlePrevious}
										className={cn(
											'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
											'border-2 border-violet-400/50 text-violet-400',
											'hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600',
											'hover:text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-110',
											'active:scale-95'
										)}
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
								)}

								{/* Indicateurs de steps */}
								<TooltipProvider delayDuration={0} skipDelayDuration={0}>
									<div className="flex items-center gap-2">
										{[...filteredBlocks, { type: 'vocabImport', title: t('methode_import_vocabulary') }].map((block, idx) => {
											const isVocabStep = idx === filteredBlocks.length
											const blockConf = isVocabStep ? vocabImportConfig : (blockConfig[block.type] || blockConfig.dialogue)
											const isActive = idx === currentSection
											const isCompleted = !isVocabStep && completedSections[idx]
											const BlockIcon = blockConf.icon

											return (
												<Tooltip key={idx} disableHoverableContent>
													<TooltipTrigger asChild>
														<button
															onClick={() => {
																setCurrentSection(idx)
																window.scrollTo({ top: 0, behavior: 'smooth' })
															}}
															className={cn(
																'relative rounded-full transition-all duration-300',
																isActive
																	? `w-10 h-4 bg-gradient-to-r ${blockConf.gradient} shadow-lg`
																	: isCompleted
																		? 'w-4 h-4 bg-emerald-500 shadow-emerald-500/30 shadow-md hover:scale-125'
																		: cn(
																			'w-4 h-4 hover:scale-125',
																			isDark
																				? 'bg-slate-600 hover:bg-slate-500'
																				: 'bg-slate-300 hover:bg-slate-400'
																		)
															)}
														>
															{isCompleted && !isActive && (
																<CheckCircle className="absolute inset-0 w-2.5 h-2.5 m-auto text-white" />
															)}
														</button>
													</TooltipTrigger>
													<TooltipContent
														side="bottom"
														className={cn(
															'px-3 py-2 rounded-xl border-2',
															'bg-gradient-to-br shadow-xl',
															isDark
																? 'from-slate-800 to-slate-900 border-violet-500/40 text-white'
																: 'from-white to-slate-50 border-violet-200 text-slate-800',
															'shadow-[0_4px_20px_rgba(139,92,246,0.2)]'
														)}
													>
														<div className="flex items-center gap-2">
															<div className={cn(
																'w-6 h-6 rounded-lg flex items-center justify-center',
																`bg-gradient-to-br ${blockConf.gradient}`
															)}>
																<BlockIcon className="w-3.5 h-3.5 text-white" />
															</div>
															<div>
																<p className="font-bold text-xs">
																	{idx + 1}. {block.title || blockConf.label}
																</p>
																{isCompleted && (
																	<p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
																		<CheckCircle className="w-3 h-3" />
																		{t('methode_completed') || 'Terminé'}
																	</p>
																)}
															</div>
														</div>
													</TooltipContent>
												</Tooltip>
											)
										})}
									</div>
								</TooltipProvider>

								{/* Bouton Next - masqué sur le dernier step */}
								{!isLastSection && (
									<button
										onClick={handleNext}
										className={cn(
											'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
											'border-2 border-violet-400/50 text-violet-400',
											'hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600',
											'hover:text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-110',
											'active:scale-95'
										)}
									>
										<ChevronRight className="w-5 h-5" />
									</button>
								)}
							</div>

							<Badge className={cn(
								'px-2 sm:px-3 py-1 font-bold text-xs',
								'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0'
							)}>
								<Zap className="w-3 h-3 mr-1" />
								{Math.round(progressPercent)}%
							</Badge>
						</div>

						{/* Barre de progression stylisee */}
						<div className={cn(
							'relative h-2 sm:h-4 rounded-full overflow-hidden',
							isDark ? 'bg-slate-800' : 'bg-violet-200'
						)}>
							<div
								className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out"
								style={{ width: `${progressPercent}%` }}
							>
								{/* Effet de brillance sur la barre */}
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
							</div>

							{/* Marqueurs de sections - hidden on mobile for cleaner look */}
							<div className="absolute inset-0 hidden sm:flex">
								{filteredBlocks.map((_, idx) => (
									<div
										key={idx}
										className="flex-1 border-r border-white/20 last:border-r-0"
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Header de l'étape - style skill tree node */}
				<div className="relative mb-3 sm:mb-5">
					{/* Carte skill node */}
					<div className={cn(
						'relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl',
						'border-2 transition-all duration-300',
						isDark
							? 'bg-gradient-to-r from-slate-900/90 via-slate-800/50 to-slate-900/90'
							: 'bg-gradient-to-r from-white via-slate-50 to-white',
						// Default border
						isDark ? 'border-violet-500/50' : 'border-violet-300 shadow-violet-100',
						// Type-specific borders
						currentBlock?.type === 'dialogue' && (isDark ? 'border-blue-500/50' : 'border-blue-300 shadow-blue-100'),
						currentBlock?.type === 'grammar' && (isDark ? 'border-violet-500/50' : 'border-violet-300 shadow-violet-100'),
						currentBlock?.type === 'vocabulary' && (isDark ? 'border-emerald-500/50' : 'border-emerald-300 shadow-emerald-100'),
						currentBlock?.type === 'culture' && (isDark ? 'border-cyan-500/50' : 'border-cyan-300 shadow-cyan-100'),
						currentBlock?.type === 'exercise' && (isDark ? 'border-orange-500/50' : 'border-orange-300 shadow-orange-100'),
						currentBlock?.type === 'exerciseInline' && (isDark ? 'border-purple-500/50' : 'border-purple-300 shadow-purple-100'),
						currentBlock?.type === 'tip' && (isDark ? 'border-amber-500/50' : 'border-amber-300 shadow-amber-100'),
						currentBlock?.type === 'summary' && (isDark ? 'border-green-500/50' : 'border-green-300 shadow-green-100'),
						currentBlock?.type === 'conversation' && (isDark ? 'border-orange-500/50' : 'border-orange-300 shadow-orange-100'),
						currentBlock?.type === 'audio' && (isDark ? 'border-pink-500/50' : 'border-pink-300 shadow-pink-100'),
						currentBlock?.type === 'pronunciation' && (isDark ? 'border-indigo-500/50' : 'border-indigo-300 shadow-indigo-100'),
						'shadow-lg'
					)}>
						{/* Icône hexagonale du skill */}
						<div className="relative flex-shrink-0">
							{/* Hexagon background with glow */}
							<div className={cn(
								'w-12 h-12 sm:w-14 sm:h-14 rounded-xl rotate-45 flex items-center justify-center',
								'shadow-lg transition-all duration-300',
								'bg-gradient-to-br from-violet-400 to-violet-600 shadow-violet-500/40', // default
								currentBlock?.type === 'dialogue' && 'from-blue-400 to-blue-600 shadow-blue-500/40',
								currentBlock?.type === 'grammar' && 'from-violet-400 to-violet-600 shadow-violet-500/40',
								currentBlock?.type === 'vocabulary' && 'from-emerald-400 to-emerald-600 shadow-emerald-500/40',
								currentBlock?.type === 'culture' && 'from-cyan-400 to-cyan-600 shadow-cyan-500/40',
								currentBlock?.type === 'exercise' && 'from-orange-400 to-orange-600 shadow-orange-500/40',
								currentBlock?.type === 'exerciseInline' && 'from-purple-400 to-pink-600 shadow-purple-500/40',
								currentBlock?.type === 'tip' && 'from-amber-400 to-yellow-600 shadow-amber-500/40',
								currentBlock?.type === 'summary' && 'from-green-400 to-emerald-600 shadow-green-500/40',
								currentBlock?.type === 'conversation' && 'from-orange-400 to-red-600 shadow-orange-500/40',
								currentBlock?.type === 'audio' && 'from-pink-400 to-rose-600 shadow-pink-500/40',
								currentBlock?.type === 'pronunciation' && 'from-indigo-400 to-blue-600 shadow-indigo-500/40'
							)}>
								<span className="-rotate-45 text-white font-bold text-lg sm:text-xl">
									{currentSection + 1}
								</span>
							</div>

							{/* Completion indicator */}
							{completedSections[currentSection] && (
								<div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg">
									<CheckCircle className="w-3 h-3 text-white" />
								</div>
							)}
						</div>

						{/* Contenu du skill */}
						<div className="flex-1 min-w-0">
							<h2 className={cn(
								'text-base sm:text-lg font-bold leading-tight truncate',
								isDark ? 'text-white' : 'text-slate-800'
							)}>
								{isVocabImportStep ? t('methode_import_vocabulary') : getBlockTitle(currentBlock, currentSection)}
							</h2>
							<div className="flex items-center gap-2 mt-1">
								<span className={cn(
									'text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide',
									// Default
									isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600',
									// Type-specific
									isVocabImportStep && (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'),
									currentBlock?.type === 'dialogue' && (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'),
									currentBlock?.type === 'grammar' && (isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'),
									currentBlock?.type === 'vocabulary' && (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'),
									currentBlock?.type === 'culture' && (isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'),
									currentBlock?.type === 'exercise' && (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'),
									currentBlock?.type === 'exerciseInline' && (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'),
									currentBlock?.type === 'tip' && (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'),
									currentBlock?.type === 'summary' && (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'),
									currentBlock?.type === 'conversation' && (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'),
									currentBlock?.type === 'audio' && (isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'),
									currentBlock?.type === 'pronunciation' && (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600')
								)}>
									{isVocabImportStep && 'Flashcards'}
									{currentBlock?.type === 'dialogue' && t('methode_block_dialogue')}
									{currentBlock?.type === 'grammar' && t('methode_block_grammar')}
									{currentBlock?.type === 'vocabulary' && t('methode_block_vocabulary')}
									{currentBlock?.type === 'culture' && t('methode_block_culture')}
									{currentBlock?.type === 'exercise' && t('methode_block_exercise')}
									{currentBlock?.type === 'exerciseInline' && t('methode_block_exercise')}
									{currentBlock?.type === 'tip' && t('methode_block_tip')}
									{currentBlock?.type === 'summary' && t('methode_block_summary')}
									{currentBlock?.type === 'conversation' && t('methode_block_conversation')}
									{currentBlock?.type === 'audio' && t('methode_block_audio')}
									{currentBlock?.type === 'pronunciation' && t('methode_block_pronunciation')}
									{!isVocabImportStep && !['dialogue', 'grammar', 'vocabulary', 'culture', 'exercise', 'exerciseInline', 'tip', 'summary', 'conversation', 'audio', 'pronunciation'].includes(currentBlock?.type) && t('methode_lesson')}
								</span>
								{!isVocabImportStep && (
									<span className={cn(
										'text-xs flex items-center gap-1',
										isDark ? 'text-slate-500' : 'text-slate-400'
									)}>
										<Clock className="w-3 h-3" />
										{getBlockEstimatedTime(currentBlock)} min
									</span>
								)}
							</div>
						</div>

						{/* Ligne de connexion vers le prochain skill (visible seulement s'il y a une suite) */}
						{currentSection < totalSteps - 1 && (
							<div className={cn(
								'absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3',
								'bg-violet-500/30', // default
								currentBlock?.type === 'dialogue' && 'bg-blue-500/30',
								currentBlock?.type === 'grammar' && 'bg-violet-500/30',
								currentBlock?.type === 'vocabulary' && 'bg-emerald-500/30',
								currentBlock?.type === 'culture' && 'bg-cyan-500/30',
								currentBlock?.type === 'exercise' && 'bg-orange-500/30',
								currentBlock?.type === 'exerciseInline' && 'bg-purple-500/30',
								currentBlock?.type === 'tip' && 'bg-amber-500/30',
								currentBlock?.type === 'summary' && 'bg-green-500/30',
								currentBlock?.type === 'conversation' && 'bg-orange-500/30',
								currentBlock?.type === 'audio' && 'bg-pink-500/30',
								currentBlock?.type === 'pronunciation' && 'bg-indigo-500/30'
							)} />
						)}
					</div>
				</div>

				{/* Contenu du bloc ou Import vocabulaire */}
				<div className="mb-2 sm:mb-8">
					{isVocabImportStep ? (
						<LessonVocabularyImport
							lesson={lesson}
							blocks={blocks}
							lessonLanguage={lesson?.course?.target_language || userLearningLanguage}
							spokenLanguage={lesson?.course?.lang || locale}
							locale={locale}
						/>
					) : (
						<BlockRenderer block={currentBlock} index={currentSection} />
					)}
				</div>

				{/* Navigation bas - même style que le haut */}
				<div className="flex flex-col items-center gap-6">
					{/* Bouton Terminer la leçon - affiché uniquement sur le dernier step */}
					{isLastSection && (
						<button
							onClick={handleCompleteLesson}
							disabled={isLessonCompleted || isCompleting}
							className={cn(
								'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300',
								isLessonCompleted
									? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 cursor-default'
									: cn(
										'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
										'shadow-lg shadow-emerald-500/30',
										'hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105',
										'active:scale-95'
									)
							)}
						>
							{isCompleting ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									{t('methode_completing')}
								</>
							) : isLessonCompleted ? (
								<>
									<CheckCircle className="w-5 h-5" />
									{t('methode_lesson_completed')}
								</>
							) : (
								<>
									<Trophy className="w-5 h-5" />
									{t('methode_complete_lesson')}
								</>
							)}
						</button>
					)}

					{/* Navigation normale */}
					<div className={cn(
						'relative p-2 sm:p-4 rounded-full border sm:border-2 overflow-hidden inline-flex',
						isDark
							? 'bg-gradient-to-r from-slate-900/90 via-violet-950/50 to-slate-900/90 border-violet-500/30'
							: 'bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border-violet-300'
					)}>
						{/* Effet de brillance */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

						<div className="relative z-10">
							{/* Mobile */}
							<div className="flex sm:hidden items-center justify-center gap-3">
								{/* Bouton Previous - masqué sur la première step */}
								{currentSection > 0 && (
									<button
										onClick={handlePrevious}
										className={cn(
											'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
											'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:scale-110'
										)}
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
								)}

								{/* Compteur simple sur mobile */}
								<div className={cn(
									'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold',
									isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'
								)}>
									<span>{currentSection + 1}</span>
									<span className={isDark ? 'text-slate-500' : 'text-slate-400'}>/</span>
									<span>{totalSteps}</span>
								</div>

								{/* Bouton Next - masqué sur le dernier step */}
								{!isLastSection && (
									<button
										onClick={handleNext}
										className={cn(
											'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
											'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:scale-110'
										)}
									>
										<ChevronRight className="w-5 h-5" />
									</button>
								)}
							</div>

							{/* Desktop */}
							<div className="hidden sm:flex items-center justify-center gap-3">
								{/* Bouton Previous - masqué sur la première step */}
								{currentSection > 0 && (
									<button
										onClick={handlePrevious}
										className={cn(
											'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
											'border-2 border-violet-400/50 text-violet-400',
											'hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600',
											'hover:text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-110',
											'active:scale-95'
										)}
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
								)}

								{/* Indicateurs de steps */}
								<TooltipProvider delayDuration={0} skipDelayDuration={0}>
									<div className="flex items-center gap-2">
										{[...filteredBlocks, { type: 'vocabImport', title: t('methode_import_vocabulary') }].map((block, idx) => {
											const isVocabStep = idx === filteredBlocks.length
											const blockConf = isVocabStep ? vocabImportConfig : (blockConfig[block.type] || blockConfig.dialogue)
											const isActive = idx === currentSection
											const isCompleted = !isVocabStep && completedSections[idx]
											const BlockIcon = blockConf.icon

											return (
												<Tooltip key={idx} disableHoverableContent>
													<TooltipTrigger asChild>
														<button
															onClick={() => {
																setCurrentSection(idx)
																window.scrollTo({ top: 0, behavior: 'smooth' })
															}}
															className={cn(
																'relative rounded-full transition-all duration-300',
																isActive
																	? `w-10 h-4 bg-gradient-to-r ${blockConf.gradient} shadow-lg`
																	: isCompleted
																		? 'w-4 h-4 bg-emerald-500 shadow-emerald-500/30 shadow-md hover:scale-125'
																		: cn(
																			'w-4 h-4 hover:scale-125',
																			isDark
																				? 'bg-slate-600 hover:bg-slate-500'
																				: 'bg-slate-300 hover:bg-slate-400'
																		)
															)}
														>
															{isCompleted && !isActive && (
																<CheckCircle className="absolute inset-0 w-2.5 h-2.5 m-auto text-white" />
															)}
														</button>
													</TooltipTrigger>
													<TooltipContent
														side="bottom"
														className={cn(
															'px-3 py-2 rounded-xl border-2',
															'bg-gradient-to-br shadow-xl',
															isDark
																? 'from-slate-800 to-slate-900 border-violet-500/40 text-white'
																: 'from-white to-slate-50 border-violet-200 text-slate-800',
															'shadow-[0_4px_20px_rgba(139,92,246,0.2)]'
														)}
													>
														<div className="flex items-center gap-2">
															<div className={cn(
																'w-6 h-6 rounded-lg flex items-center justify-center',
																`bg-gradient-to-br ${blockConf.gradient}`
															)}>
																<BlockIcon className="w-3.5 h-3.5 text-white" />
															</div>
															<div>
																<p className="font-bold text-xs">
																	{idx + 1}. {block.title || blockConf.label}
																</p>
																{isCompleted && (
																	<p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
																		<CheckCircle className="w-3 h-3" />
																		{t('methode_completed') || 'Terminé'}
																	</p>
																)}
															</div>
														</div>
													</TooltipContent>
												</Tooltip>
											)
										})}
									</div>
								</TooltipProvider>

								{/* Bouton Next - masqué sur le dernier step */}
								{!isLastSection && (
									<button
										onClick={handleNext}
										className={cn(
											'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
											'border-2 border-violet-400/50 text-violet-400',
											'hover:border-violet-400 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600',
											'hover:text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-110',
											'active:scale-95'
										)}
									>
										<ChevronRight className="w-5 h-5" />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// Rendu du mode vue d'ensemble (carte de quete)
	const renderOverviewMode = () => {
		return (
			<div>
				{/* Header de la carte */}
				<div className={cn(
					'relative mb-8 p-6 rounded-2xl border-2 overflow-hidden',
					isDark
						? 'bg-gradient-to-r from-slate-900 via-violet-950/30 to-slate-900 border-violet-500/30'
						: 'bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border-violet-200'
				)}>
					<div className="flex items-center gap-4 mb-4">
						<div className={cn(
							'w-12 h-12 rounded-xl flex items-center justify-center',
							'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30'
						)}>
							<Map className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className={cn(
								'text-xl font-bold',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{t('methode_lesson_overview')}
							</h3>
							<p className={cn(
								'text-sm',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{completedCount} / {filteredBlocks.length} {t('methode_sections_completed')}
							</p>
						</div>

						<Badge className={cn(
							'ml-auto px-3 py-1 font-bold',
							'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0'
						)}>
							<Zap className="w-3 h-3 mr-1" />
							{Math.round(progressPercent)}%
						</Badge>
					</div>

					{/* Barre de progression */}
					<div className={cn(
						'relative h-3 rounded-full overflow-hidden',
						isDark ? 'bg-slate-800' : 'bg-violet-200'
					)}>
						<div
							className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>

				{/* Liste des sections en timeline */}
				<div className="relative">
					{/* Ligne de connexion verticale */}
					<div className={cn(
						'absolute left-6 top-0 bottom-0 w-0.5',
						isDark ? 'bg-gradient-to-b from-violet-500/50 via-slate-700 to-slate-800' : 'bg-gradient-to-b from-violet-300 via-slate-200 to-slate-100'
					)} />

					<div className="space-y-4">
						{filteredBlocks.map((block, index) => {
							const isOpen = openAccordions.includes(index)
							const isCompleted = completedSections[index]
							const config = blockConfig[block.type] || blockConfig.dialogue
							const BlockIcon = config.icon

							return (
								<div key={index} className="relative pl-14">
									{/* Node de connexion */}
									<div className={cn(
										'absolute left-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10',
										isCompleted
											? 'bg-emerald-500 border-emerald-400'
											: isOpen
												? `bg-gradient-to-br ${config.gradient} border-transparent`
												: isDark
													? 'bg-slate-800 border-slate-600'
													: 'bg-white border-slate-300'
									)}>
										{isCompleted && (
											<CheckCircle className="w-3 h-3 text-white" />
										)}
									</div>

									{/* Carte de section */}
									<div className={cn(
										'rounded-xl border-2 overflow-hidden transition-all duration-300',
										isDark
											? 'bg-slate-900/80 border-slate-700'
											: 'bg-white border-slate-200',
										isOpen && (isDark ? 'border-violet-500/30' : 'shadow-xl border-violet-300'),
										isCompleted && !isOpen && (isDark ? 'border-emerald-500/30' : 'border-emerald-300')
									)}>
										{/* Header cliquable */}
										<button
											onClick={() => toggleAccordion(index)}
											className={cn(
												'w-full flex items-center gap-4 p-4 text-left transition-colors',
												isCompleted
													? isDark
														? 'bg-emerald-500/10 hover:bg-emerald-500/15'
														: 'bg-emerald-50 hover:bg-emerald-100'
													: isDark
														? 'hover:bg-slate-800'
														: 'hover:bg-slate-50'
											)}
										>
											{/* Numéro de section */}
											<div className={cn(
												'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-white',
												`bg-gradient-to-br ${config.gradient} shadow-md`
											)}>
												{index + 1}
											</div>

											{/* Titre */}
											<div className="flex-1 min-w-0">
												<span className={cn(
													'font-bold block truncate',
													isDark ? 'text-white' : 'text-slate-900'
												)}>
													{getBlockTitle(block, index)}
												</span>
												<span className={cn(
													'text-xs',
													isDark ? 'text-slate-500' : 'text-slate-400'
												)}>
													Section {index + 1}
												</span>
											</div>

											{/* Badge temps */}
											<Badge variant="outline" className={cn(
												'gap-1 flex-shrink-0',
												isDark
													? 'border-slate-700 text-slate-400'
													: 'border-slate-200 text-slate-500'
											)}>
												<Clock className="w-3 h-3" />
												{getBlockEstimatedTime(block)} min
											</Badge>

											{/* Chevron */}
											<ChevronDown className={cn(
												'w-5 h-5 transition-transform duration-300 flex-shrink-0',
												isOpen && 'rotate-180',
												isDark ? 'text-slate-500' : 'text-slate-400'
											)} />
										</button>

										{/* Contenu */}
										{isOpen && (
											<div className={cn(
												'p-4 border-t',
												isDark ? 'border-slate-800' : 'border-slate-100'
											)}>
												<BlockRenderer block={block} index={index} />
											</div>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}

	if (!blocks || blocks.length === 0) {
		return (
			<div className={cn(
				'text-center py-12 rounded-2xl border-2 border-dashed',
				isDark ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'
			)}>
				<Scroll className="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p>{t('methode_no_content')}</p>
			</div>
		)
	}

	return (
		<div>
			{/* Toggle des modes avec style gaming */}
			<div className={cn(
				'flex justify-center mb-3 sm:mb-8 pb-3 sm:pb-6 border-b',
				isDark ? 'border-slate-800' : 'border-slate-200'
			)}>
				<div className={cn(
					'inline-flex rounded-lg sm:rounded-xl p-0.5 sm:p-1.5 border sm:border-2 w-full sm:w-auto',
					isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
				)}>
					<button
						onClick={() => setViewMode('guided')}
						className={cn(
							'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none',
							viewMode === 'guided'
								? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
								: isDark
									? 'text-slate-400 hover:text-white hover:bg-slate-800'
									: 'text-slate-600 hover:text-slate-900 hover:bg-white'
						)}
					>
						<Compass className="w-4 h-4" />
						{t('methode_guided_mode')}
					</button>
					<button
						onClick={() => setViewMode('overview')}
						className={cn(
							'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none',
							viewMode === 'overview'
								? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
								: isDark
									? 'text-slate-400 hover:text-white hover:bg-slate-800'
									: 'text-slate-600 hover:text-slate-900 hover:bg-white'
						)}
					>
						<Map className="w-4 h-4" />
						{t('methode_overview_mode')}
					</button>
				</div>
			</div>

			{/* Contenu selon le mode */}
			{viewMode === 'guided' ? renderGuidedMode() : renderOverviewMode()}
		</div>
	)
}

export default LessonNavigator
