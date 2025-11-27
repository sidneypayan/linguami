import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BlockRenderer from './blocks/BlockRenderer'
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
	Shield,
	Sparkles,
	Star,
	Scroll,
	Zap,
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
const LessonNavigator = ({ blocks = [], lessonId, onComplete, isCompleting = false }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	const [viewMode, setViewMode] = useState('guided')
	const [currentSection, setCurrentSection] = useState(0)
	const [completedSections, setCompletedSections] = useState(
		new Array(blocks.length).fill(false)
	)
	const [openAccordions, setOpenAccordions] = useState([0])

	// Charger la progression sauvegardee
	useEffect(() => {
		if (typeof window !== 'undefined' && lessonId) {
			const savedProgress = localStorage.getItem(`lesson_progress_${lessonId}`)
			if (savedProgress) {
				try {
					const { section, completed } = JSON.parse(savedProgress)
					setCurrentSection(section || 0)
					setCompletedSections(completed || new Array(blocks.length).fill(false))
				} catch (e) {
					logger.error('Erreur lors du chargement de la progression', e)
				}
			}
		}
	}, [lessonId, blocks.length])

	// Sauvegarder la progression
	useEffect(() => {
		if (typeof window !== 'undefined' && lessonId) {
			const progress = {
				section: currentSection,
				completed: completedSections,
			}
			localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(progress))
		}
	}, [currentSection, completedSections, lessonId])

	const completedCount = completedSections.filter(Boolean).length
	const progressPercent = (completedCount / blocks.length) * 100

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
		if (currentSection < blocks.length - 1) {
			const newCompleted = [...completedSections]
			newCompleted[currentSection] = true
			setCompletedSections(newCompleted)
			setCurrentSection(currentSection + 1)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			const newCompleted = [...completedSections]
			newCompleted[currentSection] = true
			setCompletedSections(newCompleted)
			if (onComplete) {
				onComplete()
			}
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
		const currentBlock = blocks[currentSection]
		if (!currentBlock) return null

		const isLastSection = currentSection === blocks.length - 1
		const allCompleted = completedSections.every(Boolean)
		const config = blockConfig[currentBlock.type] || blockConfig.dialogue
		const BlockIcon = config.icon

		return (
			<div className="animate-in fade-in duration-300">
				{/* Barre d'XP Gaming */}
				<div className={cn(
					'relative mb-8 p-5 rounded-2xl border-2 overflow-hidden',
					isDark
						? 'bg-gradient-to-r from-slate-900/90 via-violet-950/50 to-slate-900/90 border-violet-500/30'
						: 'bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border-violet-300'
				)}>
					{/* Effet de brillance */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

					<div className="relative z-10">
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-xl flex items-center justify-center',
									'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30'
								)}>
									<Flame className="w-5 h-5 text-white" />
								</div>
								<div>
									<span className={cn(
										'text-xs font-bold uppercase tracking-wider',
										isDark ? 'text-violet-400' : 'text-violet-600'
									)}>
										{t('methode_step')} {currentSection + 1} / {blocks.length}
									</span>
									<p className={cn(
										'text-sm',
										isDark ? 'text-slate-400' : 'text-slate-600'
									)}>
										{completedCount} {t('methode_completed_sections')}
									</p>
								</div>
							</div>

							<Badge className={cn(
								'px-3 py-1 font-bold',
								'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0'
							)}>
								<Zap className="w-3 h-3 mr-1" />
								{Math.round(progressPercent)}% XP
							</Badge>
						</div>

						{/* Barre de progression stylisee */}
						<div className={cn(
							'relative h-4 rounded-full overflow-hidden',
							isDark ? 'bg-slate-800' : 'bg-violet-200'
						)}>
							<div
								className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out"
								style={{ width: `${progressPercent}%` }}
							>
								{/* Effet de brillance sur la barre */}
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
							</div>

							{/* Marqueurs de sections */}
							<div className="absolute inset-0 flex">
								{blocks.map((_, idx) => (
									<div
										key={idx}
										className="flex-1 border-r border-white/20 last:border-r-0"
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Carte de competence actuelle */}
				<div className={cn(
					'relative mb-6 p-6 rounded-2xl border-2 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700'
						: 'bg-white border-slate-200 shadow-xl'
				)}>
					{/* Glow effect */}
					<div className={cn(
						'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20',
						`bg-${config.bgGlow}-500`
					)} />

					<div className="relative z-10 flex items-center gap-4 mb-4">
						<div className={cn(
							'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg',
							`bg-gradient-to-br ${config.gradient}`
						)}>
							<BlockIcon className="w-7 h-7 text-white" />
						</div>
						<div className="flex-1">
							<h2 className={cn(
								'text-xl sm:text-2xl font-bold',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{getBlockTitle(currentBlock, currentSection)}
							</h2>
							<div className="flex items-center gap-3 mt-1">
								<div className="flex items-center gap-1">
									<Clock className={cn(
										'w-4 h-4',
										isDark ? 'text-slate-500' : 'text-slate-400'
									)} />
									<span className={cn(
										'text-sm',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}>
										{getBlockEstimatedTime(currentBlock)} min
									</span>
								</div>
								{completedSections[currentSection] && (
									<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
										<CheckCircle className="w-3 h-3 mr-1" />
										Complete
									</Badge>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Contenu du bloc */}
				<div className="mb-8">
					<BlockRenderer block={currentBlock} index={currentSection} />
				</div>

				{/* Navigation gaming */}
				<div className={cn(
					'relative p-5 rounded-2xl border-2 overflow-hidden',
					isDark
						? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700'
						: 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200'
				)}>
					<div className="flex items-center justify-between gap-4">
						<Button
							variant="outline"
							size="lg"
							onClick={handlePrevious}
							disabled={currentSection === 0}
							className={cn(
								'gap-2 px-5 border-2 font-semibold transition-all',
								isDark
									? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
									: 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
							)}
						>
							<ChevronLeft className="w-5 h-5" />
							<span className="hidden sm:inline">{t('methode_previous')}</span>
						</Button>

						{/* Indicateurs de progression stylises */}
						<div className="flex items-center gap-2 px-4">
							{blocks.map((block, idx) => {
								const blockConf = blockConfig[block.type] || blockConfig.dialogue
								return (
									<button
										key={idx}
										onClick={() => {
											setCurrentSection(idx)
											window.scrollTo({ top: 0, behavior: 'smooth' })
										}}
										className={cn(
											'relative w-3 h-3 rounded-full transition-all duration-300',
											idx === currentSection
												? `w-10 bg-gradient-to-r ${blockConf.gradient} shadow-lg`
												: completedSections[idx]
													? 'bg-emerald-500 shadow-emerald-500/30 shadow-lg'
													: isDark
														? 'bg-slate-700 hover:bg-slate-600'
														: 'bg-slate-300 hover:bg-slate-400'
										)}
									>
										{idx === currentSection && (
											<Sparkles className="absolute inset-0 w-3 h-3 m-auto text-white/80" />
										)}
									</button>
								)
							})}
						</div>

						<Button
							size="lg"
							onClick={handleNext}
							disabled={isCompleting}
							className={cn(
								'gap-2 px-6 font-bold border-0 shadow-lg transition-all',
								isLastSection
									? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30'
									: 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/30'
							)}
						>
							{isCompleting ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									<span className="hidden sm:inline">{t('methode_saving')}</span>
								</>
							) : isLastSection ? (
								<>
									<span className="hidden sm:inline">{allCompleted ? t('methode_finish_lesson') : t('methode_mark_complete')}</span>
									<span className="sm:hidden">Terminer</span>
									<CheckCircle className="w-5 h-5" />
								</>
							) : (
								<>
									<span className="hidden sm:inline">{t('methode_continue')}</span>
									<span className="sm:hidden">Suivant</span>
									<ChevronRight className="w-5 h-5" />
								</>
							)}
						</Button>
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
								{completedCount} / {blocks.length} {t('methode_sections_completed')}
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
						{blocks.map((block, index) => {
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
										isOpen && (isDark ? 'shadow-lg shadow-violet-500/10 border-violet-500/30' : 'shadow-xl border-violet-300'),
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
											{/* Icone du type */}
											<div className={cn(
												'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
												`bg-gradient-to-br ${config.gradient} shadow-md`
											)}>
												<BlockIcon className="w-5 h-5 text-white" />
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
				'flex justify-center mb-8 pb-6 border-b',
				isDark ? 'border-slate-800' : 'border-slate-200'
			)}>
				<div className={cn(
					'inline-flex rounded-xl p-1.5 border-2',
					isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
				)}>
					<button
						onClick={() => setViewMode('guided')}
						className={cn(
							'flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300',
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
							'flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300',
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
