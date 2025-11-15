import { useState, useEffect } from 'react'
import {
	Box,
	Button,
	ToggleButtonGroup,
	ToggleButton,
	LinearProgress,
	Typography,
	IconButton,
	Fade,
	Collapse,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Chip,
	useTheme,
} from '@mui/material'
import {
	ViewModule,
	ViewList,
	ArrowBack,
	ArrowForward,
	CheckCircle,
	ExpandMore,
	AccessTime,
} from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'
import BlockRenderer from './blocks/BlockRenderer'

/**
 * LessonNavigator - Composant hybride avec mode guidé et mode vue d'ensemble
 * @param {Array} blocks - Les blocs de la leçon
 * @param {String} lessonId - ID de la leçon pour sauvegarder la progression
 * @param {Function} onComplete - Callback quand l'utilisateur termine la leçon
 */
const LessonNavigator = ({ blocks = [], lessonId, onComplete }) => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Mode: 'guided' ou 'overview'
	const [viewMode, setViewMode] = useState('guided')

	// Section actuelle en mode guidé (index du bloc)
	const [currentSection, setCurrentSection] = useState(0)

	// Sections complétées (array de booléens)
	const [completedSections, setCompletedSections] = useState(
		new Array(blocks.length).fill(false)
	)

	// Charger la progression sauvegardée au montage
	useEffect(() => {
		if (typeof window !== 'undefined' && lessonId) {
			const savedProgress = localStorage.getItem(`lesson_progress_${lessonId}`)
			if (savedProgress) {
				try {
					const { section, completed } = JSON.parse(savedProgress)
					setCurrentSection(section || 0)
					setCompletedSections(completed || new Array(blocks.length).fill(false))
				} catch (e) {
					console.error('Erreur lors du chargement de la progression', e)
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

	// Calculer le pourcentage de progression
	const completedCount = completedSections.filter(Boolean).length
	const progressPercent = (completedCount / blocks.length) * 100

	// Obtenir le titre d'un bloc
	const getBlockTitle = (block, index) => {
		if (block.title) return block.title

		const typeNames = {
			dialogue: t('methode_block_dialogue'),
			grammar: t('methode_block_grammar'),
			vocabulary: t('methode_block_vocabulary'),
			culture: t('methode_block_culture'),
			tip: t('methode_block_tip'),
			conversation: t('methode_block_conversation'),
			summary: t('methode_block_summary'),
			exerciseInline: t('methode_block_exercise'),
			audio: t('methode_block_audio'),
			pronunciation: t('methode_block_pronunciation'),
		}

		return typeNames[block.type] || `Section ${index + 1}`
	}

	// Obtenir l'estimation de temps d'un bloc (en minutes)
	const getBlockEstimatedTime = (block) => {
		// Temps estimé par type de bloc
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

	// Navigation
	const handleNext = () => {
		if (currentSection < blocks.length - 1) {
			// Marquer la section actuelle comme complétée
			const newCompleted = [...completedSections]
			newCompleted[currentSection] = true
			setCompletedSections(newCompleted)

			// Avancer à la section suivante
			setCurrentSection(currentSection + 1)

			// Scroll en haut
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			// Dernière section - marquer comme complétée et appeler onComplete
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

	const handleSectionClick = (index) => {
		setCurrentSection(index)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Toggle mode
	const handleModeChange = (event, newMode) => {
		if (newMode !== null) {
			setViewMode(newMode)
		}
	}

	// Rendu du mode guidé
	const renderGuidedMode = () => {
		const currentBlock = blocks[currentSection]
		if (!currentBlock) return null

		const isLastSection = currentSection === blocks.length - 1
		const allCompleted = completedSections.every(Boolean)

		return (
			<Fade in={true} key={currentSection}>
				<Box>
					{/* Barre de progression */}
					<Box
						sx={{
							mb: 4,
							p: 3,
							borderRadius: 3,
							background: isDark
								? 'rgba(139, 92, 246, 0.1)'
								: 'rgba(139, 92, 246, 0.05)',
							border: '1px solid',
							borderColor: isDark
								? 'rgba(139, 92, 246, 0.3)'
								: 'rgba(139, 92, 246, 0.2)',
						}}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}>
							<Typography variant="body2" sx={{ fontWeight: 600, color: '#8b5cf6' }}>
								{t('methode_step')} {currentSection + 1} / {blocks.length}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{completedCount} {t('methode_completed_sections')} ({Math.round(progressPercent)}%)
							</Typography>
						</Box>
						<LinearProgress
							variant="determinate"
							value={progressPercent}
							sx={{
								height: 8,
								borderRadius: 4,
								backgroundColor: isDark
									? 'rgba(255, 255, 255, 0.1)'
									: 'rgba(0, 0, 0, 0.1)',
								'& .MuiLinearProgress-bar': {
									background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
									borderRadius: 4,
								},
							}}
						/>
					</Box>

					{/* Titre de la section actuelle */}
					<Box sx={{ mb: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 700,
									background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}>
								{getBlockTitle(currentBlock, currentSection)}
							</Typography>
							{completedSections[currentSection] && (
								<CheckCircle sx={{ color: '#22c55e' }} />
							)}
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{getBlockEstimatedTime(currentBlock)} min
							</Typography>
						</Box>
					</Box>

					{/* Contenu du bloc */}
					<Box sx={{ mb: 4 }}>
						<BlockRenderer block={currentBlock} index={currentSection} />
					</Box>

					{/* Navigation */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: 2,
							flexWrap: 'wrap',
						}}>
						<Button
							variant="outlined"
							startIcon={<ArrowBack />}
							onClick={handlePrevious}
							disabled={currentSection === 0}
							sx={{
								minWidth: 140,
								borderColor: isDark
									? 'rgba(139, 92, 246, 0.5)'
									: 'rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
								'&:hover': {
									borderColor: '#8b5cf6',
									background: 'rgba(139, 92, 246, 0.1)',
								},
							}}>
							{t('methode_previous')}
						</Button>

						<Button
							variant="contained"
							endIcon={isLastSection ? <CheckCircle /> : <ArrowForward />}
							onClick={handleNext}
							sx={{
								minWidth: 140,
								background: isLastSection
									? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
									: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
								'&:hover': {
									background: isLastSection
										? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
										: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
								},
							}}>
							{isLastSection
								? allCompleted
									? t('methode_finish_lesson')
									: t('methode_mark_complete')
								: t('methode_continue')}
						</Button>
					</Box>
				</Box>
			</Fade>
		)
	}

	// Rendu du mode vue d'ensemble (accordéons)
	const renderOverviewMode = () => {
		return (
			<Box>
				{/* Progression globale */}
				<Box
					sx={{
						mb: 4,
						p: 3,
						borderRadius: 3,
						background: isDark
							? 'rgba(139, 92, 246, 0.1)'
							: 'rgba(139, 92, 246, 0.05)',
						border: '1px solid',
						borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
					}}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							{t('methode_lesson_overview')}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							{completedCount} / {blocks.length} {t('methode_sections_completed')}
						</Typography>
					</Box>
					<LinearProgress
						variant="determinate"
						value={progressPercent}
						sx={{
							height: 8,
							borderRadius: 4,
							backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
							'& .MuiLinearProgress-bar': {
								background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
								borderRadius: 4,
							},
						}}
					/>
				</Box>

				{/* Accordéons */}
				{blocks.map((block, index) => (
					<Accordion
						key={index}
						defaultExpanded={index === currentSection}
						sx={{
							mb: 2,
							borderRadius: '12px !important',
							overflow: 'hidden',
							border: '1px solid',
							borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
							'&:before': { display: 'none' },
							boxShadow: isDark
								? '0 4px 20px rgba(0, 0, 0, 0.3)'
								: '0 4px 20px rgba(0, 0, 0, 0.05)',
						}}>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							sx={{
								background: completedSections[index]
									? isDark
										? 'rgba(34, 197, 94, 0.1)'
										: 'rgba(220, 252, 231, 0.5)'
									: isDark
									? 'rgba(30, 41, 59, 0.5)'
									: 'rgba(248, 250, 252, 0.8)',
								borderBottom: '1px solid',
								borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
								'&:hover': {
									background: completedSections[index]
										? isDark
											? 'rgba(34, 197, 94, 0.15)'
											: 'rgba(220, 252, 231, 0.7)'
										: isDark
										? 'rgba(30, 41, 59, 0.7)'
										: 'rgba(248, 250, 252, 1)',
								},
							}}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									width: '100%',
									pr: 2,
								}}>
								{completedSections[index] ? (
									<CheckCircle sx={{ color: '#22c55e', fontSize: 24 }} />
								) : (
									<Box
										sx={{
											width: 24,
											height: 24,
											borderRadius: '50%',
											border: '2px solid',
											borderColor: 'text.secondary',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 12,
											fontWeight: 600,
											color: 'text.secondary',
										}}>
										{index + 1}
									</Box>
								)}
								<Box sx={{ flex: 1 }}>
									<Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
										{getBlockTitle(block, index)}
									</Typography>
								</Box>
								<Chip
									icon={<AccessTime />}
									label={`${getBlockEstimatedTime(block)} min`}
									size="small"
									variant="outlined"
								/>
							</Box>
						</AccordionSummary>
						<AccordionDetails sx={{ p: 3 }}>
							<BlockRenderer block={block} index={index} />
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		)
	}

	if (!blocks || blocks.length === 0) {
		return (
			<Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
				{t('methode_no_content')}
			</Typography>
		)
	}

	return (
		<Box>
			{/* Toggle des modes */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					mb: 4,
					pb: 3,
					borderBottom: '1px solid',
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
				}}>
				<ToggleButtonGroup
					value={viewMode}
					exclusive
					onChange={handleModeChange}
					sx={{
						background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
						borderRadius: 2,
						'& .MuiToggleButton-root': {
							px: 3,
							py: 1.5,
							border: 'none',
							fontWeight: 600,
							'&.Mui-selected': {
								background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
								color: '#fff',
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
								},
							},
						},
					}}>
					<ToggleButton value="guided">
						<ViewModule sx={{ mr: 1 }} />
						{t('methode_guided_mode')}
					</ToggleButton>
					<ToggleButton value="overview">
						<ViewList sx={{ mr: 1 }} />
						{t('methode_overview_mode')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>

			{/* Contenu selon le mode */}
			{viewMode === 'guided' ? renderGuidedMode() : renderOverviewMode()}
		</Box>
	)
}

export default LessonNavigator
